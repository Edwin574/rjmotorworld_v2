import fetch from 'node-fetch';

// Get ImageKit credentials from environment variables
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || 'your_public_key';
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || 'your_private_key';
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id/';

/**
 * Upload an image to ImageKit
 * @param base64Image Base64 encoded image data
 * @returns Promise resolving to the URL of the uploaded image
 */
export async function uploadImage(base64Image: string): Promise<string> {
  try {
    // If using actual ImageKit API
    if (IMAGEKIT_PUBLIC_KEY !== 'your_public_key' && IMAGEKIT_PRIVATE_KEY !== 'your_private_key') {
      // Extract the base64 data from the data URL if needed
      const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1]
        : base64Image;
      
      // Prepare authorization header (Basic auth with private key)
      const authHeader = 'Basic ' + Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
      
      // Prepare form data
      const formData = new URLSearchParams();
      formData.append('file', base64Data);
      formData.append('fileName', `car_${Date.now()}.jpg`);
      formData.append('folder', '/cars');
      
      // Make API request to ImageKit
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`ImageKit upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.url;
    } else {
      // For testing/development without ImageKit API keys, return a placeholder URL
      const placeholders = [
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1617654112808-106c1d614972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560031607-99279bc29ced?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ];
      
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    }
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw new Error('Failed to upload image');
  }
}
