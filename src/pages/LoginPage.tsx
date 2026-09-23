import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ThemeProvider, Card, TextField, Button, Typography, Alert } from '@liteui/core'
import { useLoginMutation } from '../store/api/apiSlice'
import { setCredentials } from '../store/slice/authSlice'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // RTK Query gives us the function to call, plus loading/error states for free!
  const [login, { isLoading, error }] = useLoginMutation()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      // .unwrap() gets the raw data from the payload, or throws the error so we can catch it
      const response = await login({ username, password }).unwrap()
      
      // Save tokens to Redux & localStorage
      dispatch(setCredentials(response))
      
      navigate('/projects')
    } catch (err) {
      console.error('Failed to log in:', err)
    }
  }

  return (
    <ThemeProvider>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)'
      }}>
        <Card style={{ width: '100%', maxWidth: 420, padding: '2rem' }}>
          <Typography variant="h4" style={{ marginBottom: '0.5rem' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
            Sign in to your Takhtit workspace
          </Typography>

          {error && (
            <Alert severity="error" style={{ marginBottom: '1rem' }}>
              Invalid username or password. Please try again.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              style={{ marginBottom: '1.5rem' }}
            />
            <Button
              type="submit"
              variant="solid"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  )
}
