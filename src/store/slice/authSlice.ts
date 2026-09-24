import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthTokens, User } from '../../types'

interface AuthState {
    access: string | null
    refresh: string | null
    isAuthenticated: boolean
    currentUser: User | null
}

const initialState: AuthState = {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    currentUser: null,
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
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload
        },
        logOut: (state) => {
            state.access = null
            state.refresh = null
            state.isAuthenticated = false
            state.currentUser = null
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
    },
})

export const { setCredentials, setCurrentUser, logOut } = authSlice.actions
export default authSlice.reducer
