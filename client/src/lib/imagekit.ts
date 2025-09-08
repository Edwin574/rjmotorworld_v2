// ImageKit configuration
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
/**
 * Uploads an image to ImageKit via the backend proxy
 * @param file The file to upload
 * @returns Promise resolving to the URL of the uploaded image
 */
export const uploadImage = async (file: File, adminAuth?: { authorization?: string }): Promise<string> => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Upload via backend proxy
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminAuth?.authorization ? { 'Authorization': adminAuth.authorization } : {})
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
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      // Expect: /<endpoint-id>/<rest-of-path>
      if (parts.length >= 2) {
        const endpointId = parts[0];
        const rest = parts.slice(1);
        const tr: string[] = [`w-${width}`];
        if (height) tr.push(`h-${height}`);
        tr.push(`q-${quality}`);
        u.pathname = `/${endpointId}/tr:${tr.join(',')}/${rest.join('/')}`;
        return u.toString();
      }
      return url;
    } catch {
      return url;
    }
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
