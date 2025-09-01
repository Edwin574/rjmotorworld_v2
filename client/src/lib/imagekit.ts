// ImageKit configuration
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'your_public_key';
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id/';

/**
 * Uploads an image to ImageKit via the backend proxy
 * @param file The file to upload
 * @returns Promise resolving to the URL of the uploaded image
 */
export const uploadImage = async (file: File, adminAuth: { username: string, password: string }): Promise<string> => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Upload via backend proxy
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'username': adminAuth.username,
        'password': adminAuth.password
      },
      body: JSON.stringify({ image: base64 })
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Converts a file to base64 encoding
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Gets an optimized URL for an image with transformations
 */
export const getOptimizedImageUrl = (
  url: string, 
  width: number = 600, 
  height?: number, 
  quality: number = 80
): string => {
  if (!url) return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  
  // If it's already an ImageKit URL, add transformations
  if (url.includes('ik.imagekit.io')) {
    const transformations = [];
    transformations.push(`w-${width}`);
    if (height) transformations.push(`h-${height}`);
    transformations.push(`q-${quality}`);
    
    // Insert transformations into the URL
    return url.replace(
      'ik.imagekit.io/', 
      `ik.imagekit.io/tr:${transformations.join(',')}/`
    );
  } else if (url.includes('unsplash.com')) {
    // Handle Unsplash URLs (for demo content)
    const params = new URLSearchParams();
    params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  // Return original URL for other sources or fallback to placeholder
  try {
    new URL(url);
    return url;
  } catch {
    return `https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=${quality}`;
  }
};
