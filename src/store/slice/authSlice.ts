import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthTokens } from '../../types'

interface AuthState {
    access: string | null
    refresh: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthTokens>) => {
            state.access = action.payload.access
            state.refresh = action.payload.refresh
            state.isAuthenticated = true
            localStorage.setItem('access_token', action.payload.access)
            localStorage.setItem('refresh_token', action.payload.refresh)
        },
        logOut: (state) => {
            state.access = null
            state.refresh = null
            state.isAuthenticated = false
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
    },
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer
