import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar, { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './Sidebar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const sidebarWidth = collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          transition: 'width 0.2s ease',
        }}
      >
        {isMobile && (
          <AppBar position="sticky" elevation={0} sx={{
            bgcolor: 'background.paper',
            borderBottom: 1, borderColor: 'divider',
          }}>
            <Toolbar sx={{ minHeight: 52 }}>
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: 'text.secondary', mr: 2 }}>
                <MenuIcon fontSize="small" />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Takhtit</Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ p: { xs: 2.5, md: 3.5 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}


