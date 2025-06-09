import { useState, useEffect, useCallback } from 'react'
import { apiClient, ApiError } from '@/lib/api-client'
import { toast } from 'sonner'

interface UseApiOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { initialData, onSuccess, onError, enabled = true } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<T>(endpoint)
      setData(response)
      if (onSuccess) {
        onSuccess(response)
      }
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred')
      setError(error)
      
      // Show error toast if no custom error handler
      if (!onError) {
        const message = err instanceof ApiError 
          ? err.message 
          : 'Failed to fetch data'
        
        toast.error('Error', {
          description: message,
        })
      } else {
        onError(error)
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, onSuccess, onError])

  // Fetch data on mount if enabled
  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled, fetchData])

  // Refetch data function
  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}

// Mutation hook for POST, PUT, PATCH, DELETE operations
interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
}

export function useMutation<TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | undefined>(undefined)

  const mutate = useCallback(
    async (variables?: TVariables) => {
      setIsLoading(true)
      setError(null)

      try {
        let response: TData

        switch (method) {
          case 'POST':
            response = await apiClient.post<TData>(endpoint, variables)
            break
          case 'PUT':
            response = await apiClient.put<TData>(endpoint, variables)
            break
          case 'PATCH':
            response = await apiClient.patch<TData>(endpoint, variables)
            break
          case 'DELETE':
            response = await apiClient.delete<TData>(endpoint)
            break
          default:
            throw new Error(`Unsupported method: ${method}`)
        }

        setData(response)
        if (onSuccess) {
          onSuccess(response)
        }
        return response
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred')
        setError(error)
        
        // Show error toast if no custom error handler
        if (!onError) {
          const message = err instanceof ApiError 
            ? err.message 
            : `Failed to ${method.toLowerCase()} data`
          
          toast.error('Error', {
            description: message,
          })
        } else {
          onError(error)
        }
        
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, method, onSuccess, onError]
  )

  return {
    mutate,
    isLoading,
    error,
    data,
  }
} 