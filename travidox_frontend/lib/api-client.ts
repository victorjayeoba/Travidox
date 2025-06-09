import { toast } from 'sonner'

interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
}

class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: HeadersInit

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      retries = 3,
      retryDelay = 300,
      headers,
      ...fetchOptions
    } = options

    const url = `${this.baseUrl}${endpoint}`
    
    const mergedHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    let lastError: Error | null = null
    let attempts = 0

    while (attempts <= retries) {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers: mergedHeaders,
        })

        if (!response.ok) {
          let errorData = null
          try {
            errorData = await response.json()
          } catch (e) {
            // JSON parsing failed, continue with null errorData
          }

          throw new ApiError(
            errorData?.message || `Request failed with status ${response.status}`,
            response.status,
            errorData
          )
        }

        // For 204 No Content responses
        if (response.status === 204) {
          return {} as T
        }

        return await response.json()
      } catch (error: any) {
        lastError = error
        
        // Don't retry for client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error
        }

        if (attempts >= retries) {
          break
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempts + 1)))
        attempts++
      }
    }

    // Show toast notification for failed requests
    toast.error('Network request failed', {
      description: lastError?.message || 'Please check your connection and try again.',
    })

    throw lastError || new Error('Request failed')
  }

  // Convenience methods
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

// Export the error class for type checking
export { ApiError } 