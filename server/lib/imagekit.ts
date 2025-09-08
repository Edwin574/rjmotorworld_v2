import 'dotenv/config';
import fetch from 'node-fetch';

// Get ImageKit credentials from environment variables
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;
const IMAGEKIT_FOLDER = process.env.IMAGEKIT_FOLDER;

/**
 * Upload an image to ImageKit
 * @param base64Image Base64 encoded image data
 * @returns Promise resolving to the URL of the uploaded image
 */
export async function uploadImage(base64Image: string): Promise<string> {
  try {
    // Ensure real ImageKit credentials are present
    const USE_FAKE = process.env.IMAGEKIT_FAKE_UPLOAD === '1';

    // Basic validation
    const { mimeType, sizeBytes } = validateBase64Image(base64Image);
    const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
    const MAX_BYTES = Number(process.env.IMAGE_MAX_UPLOAD_BYTES || 5 * 1024 * 1024); // 5MB default

    if (!ALLOWED.has(mimeType)) {
      const allowedList = Array.from(ALLOWED).join(', ');
      const msg = `Unsupported file type. Allowed: ${allowedList}.`;
      const help = `Please upload a JPG, PNG, or WebP image under ${Math.round(MAX_BYTES / (1024 * 1024))}MB.`;
      const error: any = new Error(msg);
      error.status = 415;
      error.help = help;
      throw error;
    }

    if (sizeBytes > MAX_BYTES) {
      const msg = `File too large. Max size is ${Math.round(MAX_BYTES / (1024 * 1024))}MB.`;
      const help = `Try compressing the image or choosing a smaller one.`;
      const error: any = new Error(msg);
      error.status = 413;
      error.help = help;
      throw error;
    }
    // If using actual ImageKit API
    if (!USE_FAKE && IMAGEKIT_PUBLIC_KEY && IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT) {
      // Extract the base64 data from the data URL if needed
      const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1]
        : base64Image;
      
      // Prepare authorization header (Basic auth with private key)
      const authHeader = 'Basic ' + Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
      
      // Prepare form data
      const formData = new URLSearchParams();
      formData.append('file', base64Data);
      const ext = mimeType.split('/')[1] || 'jpg';
      formData.append('fileName', `car_${Date.now()}.${ext}`);
      formData.append('folder', `/${IMAGEKIT_FOLDER}`);
      
      // Make API request to ImageKit
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
        body: formData
      });
      
      if (!response.ok) {
        let detail = response.statusText;
        try {
          const j: any = await response.json();
          if (j && typeof j === 'object' && typeof j.message === 'string') {
            detail = j.message;
          }
        } catch {}
        const err: any = new Error(`ImageKit upload failed: ${detail}`);
        err.status = response.status;
        throw err;
      }
      
      const data: any = await response.json();
      return data.url as string;
    } else if (USE_FAKE) {
      // Explicitly enabled fake uploads for local dev
      const placeholders = [
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1617654112808-106c1d614972?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560031607-99279bc29ced?auto=format&fit=crop&w=1200&q=80"
      ];
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    } else {
      const err: any = new Error('ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.');
      err.status = 500;
      err.help = 'Add the keys to your .env and restart. Or set IMAGEKIT_FAKE_UPLOAD=1 to use placeholder URLs during local development.';
      throw err;
    }
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    const e = error as any;
    const message = e?.message || 'Failed to upload image';
    const status = e?.status || 500;
    const help = e?.help;
    const enriched: any = new Error(message);
    enriched.status = status;
    if (help) enriched.help = help;
    throw enriched;
  }
}

function validateBase64Image(dataUrl: string): { mimeType: string; sizeBytes: number } {
  // data:[<mediatype>][;base64],<data>
  let mimeType = 'application/octet-stream';
  let payload = dataUrl;

  const commaIndex = dataUrl.indexOf(',');
  if (dataUrl.startsWith('data:') && commaIndex !== -1) {
    const header = dataUrl.substring(5, commaIndex); // skip 'data:'
    const parts = header.split(';');
    if (parts[0]) mimeType = parts[0];
    payload = dataUrl.substring(commaIndex + 1);
  }

  // Calculate byte size of base64 payload
  const len = payload.length;
  const padding = (payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0);
  const sizeBytes = Math.floor((len * 3) / 4) - padding;

  return { mimeType, sizeBytes };
}
