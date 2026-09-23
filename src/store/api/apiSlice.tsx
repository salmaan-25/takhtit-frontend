import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { logOut, setCredentials } from '../slice/authSlice'
import type { RootState } from '../index'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = (api.getState() as RootState).auth.refresh
    if (refresh) {
      const refreshResult = await baseQuery(
        {
          url: '/api/auth/refresh/',
          method: 'POST',
          body: { refresh },
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        // Success
        api.dispatch(setCredentials({ 
          access: (refreshResult.data as any).access, 
          refresh 
        }))
        // Retry
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh token failed -> log user out
        api.dispatch(logOut())
      }
    } else {
      api.dispatch(logOut())
    }
  }
  return result
}

// Define the central API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = apiSlice
