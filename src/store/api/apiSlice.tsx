import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { logOut, setCredentials } from '../slice/authSlice'
import type { RootState } from '../index'
import type { Project, Sprint, Ticket, User, AuthTokens } from '../../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args, api, extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = (api.getState() as RootState).auth.refresh
    if (refresh) {
      const refreshResult = await baseQuery(
        { url: '/api/auth/refresh/', method: 'POST', body: { refresh } },
        api, extraOptions
      )
      if (refreshResult.data) {
        api.dispatch(setCredentials({
          access: (refreshResult.data as { access: string }).access,
          refresh,
        }))
        result = await baseQuery(args, api, extraOptions)
      } else {
        api.dispatch(logOut())
      }
    } else {
      api.dispatch(logOut())
    }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project', 'Sprint', 'Ticket'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokens, { username: string; password: string }>({
      query: (credentials) => ({ url: '/api/auth/login/', method: 'POST', body: credentials }),
    }),

    // ── PROJECTS ──
    getProjects: builder.query<Project[], { search?: string; ordering?: string } | void>({
      query: (params) => ({ url: '/api/projects/', params: params || undefined }),
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: '/api/projects/', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: number; body: Partial<Project> }>({
      query: ({ id, body }) => ({ url: `/api/projects/${id}/`, method: 'PATCH', body }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/projects/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),

    // ── SPRINTS ──
    getSprints: builder.query<Sprint[], { project?: number; status?: string; search?: string } | void>({
      query: (params) => ({ url: '/api/sprints/', params: params || undefined }),
      providesTags: ['Sprint'],
    }),
    createSprint: builder.mutation<Sprint, Partial<Sprint>>({
      query: (body) => ({ url: '/api/sprints/', method: 'POST', body }),
      invalidatesTags: ['Sprint'],
    }),
    updateSprint: builder.mutation<Sprint, { id: number; body: Partial<Sprint> }>({
      query: ({ id, body }) => ({ url: `/api/sprints/${id}/`, method: 'PATCH', body }),
      invalidatesTags: ['Sprint'],
    }),
    deleteSprint: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/sprints/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Sprint'],
    }),

    // ── TICKETS ──
    getTickets: builder.query<Ticket[], { project?: number; sprint?: number; status?: string; search?: string } | void>({
      query: (params) => ({ url: '/api/tickets/', params: params || undefined }),
      providesTags: ['Ticket'],
    }),
    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (body) => ({ url: '/api/tickets/', method: 'POST', body }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicket: builder.mutation<Ticket, { id: number; body: Partial<Ticket> }>({
      query: ({ id, body }) => ({ url: `/api/tickets/${id}/`, method: 'PATCH', body }),
      invalidatesTags: ['Ticket'],
    }),
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/tickets/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Ticket'],
    }),

    // -- USERS --
    getUsers: builder.query<User[], void>({
      query: () => '/api/users/',
    }),

    // -- ME --
    getMe: builder.query<User, void>({
      query: () => '/api/auth/me/',
    }),

    // -- MY TICKETS --
    getMyTickets: builder.query<Ticket[], { status?: string; priority?: string } | void>({
      query: (params) => ({ url: '/api/tickets/my/', params: params || undefined }),
      providesTags: ['Ticket'],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetSprintsQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetUsersQuery,
  useGetMeQuery,
  useGetMyTicketsQuery,
} = apiSlice








