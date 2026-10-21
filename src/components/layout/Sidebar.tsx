import { useState, useRef, useEffect } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  Typography, Avatar, IconButton, Tooltip, Divider, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { logOut, setCurrentUser } from '../../store/slice/authSlice'
import type { RootState } from '../../store'
import { useGetMeQuery } from '../../store/api/apiSlice'
import UserProfilePopover from './UserProfilePopover'

export const DRAWER_WIDTH = 220
export const MINI_DRAWER_WIDTH = 58

const NAV_ITEMS = [
  { label: 'Projects', path: '/projects', icon: <FolderOutlinedIcon sx={{ fontSize: 19 }} /> },
  { label: 'Sprints',  path: '/sprints',  icon: <DirectionsRunOutlinedIcon sx={{ fontSize: 19 }} /> },
  { label: 'Tickets',  path: '/tickets',  icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 19 }} /> },
  { label: 'My Tickets', path: '/my-tickets', icon: <AssignmentIndOutlinedIcon sx={{ fontSize: 19 }} /> },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  variant: 'permanent' | 'temporary'
}

function DrawerContent({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { mode, setMode } = useColorScheme()
  const isDark = mode === 'dark'

  // User profile data from Redux / API
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const { data: meData } = useGetMeQuery()
  const user = meData || currentUser

  useEffect(() => {
    if (meData) {
      dispatch(setCurrentUser(meData))
    }
  }, [meData, dispatch])

  const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'My Account'
  const initial = (user?.first_name?.trim()?.[0] || user?.username?.trim()?.[0] || 'U').toUpperCase()

  // Anchored Popover state & handlers
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 120)
  }

  const handlePopoverMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handlePopoverMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 120)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  const handleLogout = () => {
    setIsOpen(false)
    setAnchorEl(null)
    dispatch(logOut())
    navigate('/login')
  }

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider',
      width: collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo + Toggle */}
      <Box sx={{
        px: collapsed ? 1.5 : 2, py: 1.5,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 52,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/logo-takhtit.png" alt="Takhtit" sx={{ height: 44, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          </Box>
        )}
        {collapsed && (
          <Box component="img" src="/logo-takhtit.png" alt="Takhtit" sx={{ width: 48, height: 48, objectFit: 'contain', margin: '0 auto' }} />
        )}
        {!collapsed && (
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary', ml: 1 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Nav */}
      <List sx={{ px: collapsed ? 0.75 : 1, pt: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          const btn = (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '6px',
                  py: 0.85,
                  px: collapsed ? 1.25 : 1.5,
                  minWidth: 0,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: isActive ? 'primary.light' : 'text.secondary',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: isActive ? 'rgba(79,107,237,0.16)' : 'action.hover' },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0, mr: collapsed ? 0 : 1.5,
                  color: 'inherit',
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <Typography sx={{ fontSize: '0.865rem', fontWeight: isActive ? 600 : 400, color: 'inherit' }}>
                    {item.label}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          )
          return collapsed
            ? <Tooltip key={item.path} title={item.label} placement="right">{btn}</Tooltip>
            : btn
        })}
      </List>

      {/* Expand button when collapsed */}
      {collapsed && (
        <>
          <Divider sx={{ borderColor: 'divider', mx: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <Tooltip title="Expand sidebar" placement="right">
              <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      <Divider sx={{ borderColor: 'divider' }} />

      {/* User row */}
      <Box sx={{
        px: collapsed ? 1 : 1.5, py: 1.25,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between', gap: 1,
      }}>
        {/* Profile Trigger Button with hover popover support */}
        <Box
          component="button"
          onClick={(e) => {
            e.stopPropagation()
            if (isOpen) {
              setIsOpen(false)
            } else {
              setAnchorEl(e.currentTarget)
              setIsOpen(true)
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 0.5,
            borderRadius: '8px',
            bgcolor: isOpen ? 'action.selected' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'inherit',
            transition: 'background-color 0.15s ease',
            outline: 'none',
            minWidth: 0,
            maxWidth: collapsed ? 'auto' : 130,
            '&:hover': {
              bgcolor: 'action.hover',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
            },
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: '#1976d2',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {initial}
            </Avatar>
            <Box
              component="span"
              sx={{
                position: 'absolute',
                bottom: -1,
                right: -1,
                width: 8,
                height: 8,
                bgcolor: '#10b981',
                border: '1.5px solid',
                borderColor: 'background.paper',
                borderRadius: '50%',
              }}
            />
          </Box>
          {!collapsed && (
            <Typography
              noWrap
              sx={{
                fontSize: '0.825rem',
                fontWeight: 500,
                color: 'text.primary',
                maxWidth: 82,
              }}
            >
              {displayName}
            </Typography>
          )}
        </Box>

        {/* Theme and direct logout buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} placement={collapsed ? 'right' : 'top'}>
            <IconButton size="small" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightModeOutlinedIcon sx={{ fontSize: 17 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 17 }} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" placement={collapsed ? 'right' : 'top'}>
            <IconButton size="small" onClick={() => setLogoutOpen(true)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
              <LogoutOutlinedIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* MUI User Profile Popover as per Stitch design */}
      <UserProfilePopover
        open={isOpen}
        anchorEl={anchorEl}
        placement={collapsed ? 'right-end' : 'top-start'}
        user={user}
        isDark={isDark}
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handlePopoverMouseLeave}
      />

      {/* Logout confirmation */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sign out?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to sign out of Takhtit?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleLogout}>Sign out</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, variant }: SidebarProps) {
  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { bgcolor: 'transparent', border: 'none', boxShadow: 'none' } } }}
      >
        <DrawerContent collapsed={false} onToggle={onMobileClose} />
      </Drawer>
    )
  }
  return (
    <Box sx={{
      width: collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
      transition: 'width 0.2s ease',
      flexShrink: 0,
    }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 'drawer' }}>
        <DrawerContent collapsed={collapsed} onToggle={onToggle} />
      </Box>
    </Box>
  )
}








