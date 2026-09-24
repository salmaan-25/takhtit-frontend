import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box, TextField, Button, Typography,
  Alert, CircularProgress, InputAdornment, IconButton, Divider,
  useColorScheme, Tooltip,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { useLoginMutation } from '../store/api/apiSlice'
import { setCredentials, setCurrentUser } from '../store/slice/authSlice'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()
  const { mode, setMode } = useColorScheme()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const response = await login({ username, password }).unwrap()
      dispatch(setCredentials(response))
      // Fetch current user profile and store it
      try {
        const me = await fetch(
          (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '/api/auth/me/',
          { headers: { Authorization: `Bearer ${response.access}` } }
        ).then(r => r.json())
        dispatch(setCurrentUser(me))
      } catch { /* non-critical */ }
      navigate('/projects')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      bgcolor: 'background.default',
      position: 'relative',
    }}>
      {/* Theme Toggle Top Right */}
      <Box sx={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          <IconButton size="small" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Left branding panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '42%',
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        px: 8,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 8 }}>
          <Box component="img" src="/logo-takhtit.png" alt="Takhtit" sx={{ height: 84, width: 'auto', objectFit: 'contain' }} />
        </Box>

        <Typography variant="h4" sx={{ mb: 2, lineHeight: 1.25, textAlign: 'center' }}>
          Project management,<br />done right.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, textAlign: 'center' }}>
          Plan sprints, track tickets, and ship faster - all from one clean workspace.
        </Typography>

        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
          {['Plan with sprints', 'Track with Kanban', 'Collaborate with your team'].map((f) => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">{f}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right login form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 5 }}>
            <Box component="img" src="/logo-takhtit.png" alt="Takhtit" sx={{ height: 72, width: 'auto', objectFit: 'contain' }} />
          </Box>

          <Typography variant="h5" sx={{ mb: 0.5, textAlign: { xs: 'center', md: 'left' } }}>Sign in</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
            Enter your credentials to access your workspace.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              Invalid username or password. Please try again.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.75 }}>
                Username
              </Typography>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth required autoFocus autoComplete="username"
                placeholder="your-username"
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.75 }}>
                Password
              </Typography>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth required autoComplete="current-password"
                placeholder="        "
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" tabIndex={-1}>
                          {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 0.5, py: 1.2, fontSize: '0.9rem' }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
            Contact your admin to create an account.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

