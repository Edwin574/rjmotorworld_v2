import { apiRequest } from './queryClient';

export interface AuthenticatedRequestOptions {
  accessToken: string;
  refreshToken?: () => Promise<boolean>;
}

export const makeAuthenticatedRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data: any = null,
  options: AuthenticatedRequestOptions
): Promise<any> => {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${options.accessToken}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null
    });

    // If token expired, try to refresh
    if (response.status === 403 && options.refreshToken) {
      const refreshed = await options.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        return makeAuthenticatedRequest(method, url, data, options);
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Authenticated request failed:', error);
    throw error;
  }
};