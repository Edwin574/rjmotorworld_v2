import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '../contexts/AdminAuthContext';

interface AuthenticatedFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export const useAuthenticatedQuery = <T = any>(
  queryKey: any[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, refreshToken } = useAuth();

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        // Token might be expired, try to refresh
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request
          const retryResponse = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    enabled: !!accessToken,
    ...options,
  });
};

export const useAuthenticatedMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  const { accessToken, refreshToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      if (!accessToken) {
        throw new Error('No access token available');
      }
      return await mutationFn(variables);
    },
    ...options,
  });
};