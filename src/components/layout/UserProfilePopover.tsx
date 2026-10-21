import { Popper, Fade, Box, Avatar, Typography, type PopperPlacementType } from '@mui/material'
import type { User } from '../../types'

interface UserProfilePopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  placement?: PopperPlacementType
  user?: User | null
  isDark: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function UserProfilePopover({
  open,
  anchorEl,
  placement = 'top-start',
  user,
  isDark,
  onMouseEnter,
  onMouseLeave,
}: UserProfilePopoverProps) {
  const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'Account'
  const initial = (user?.first_name?.trim()?.[0] || user?.username?.trim()?.[0] || 'U').toUpperCase()
  const roleLabel = user?.role ? user.role.toUpperCase() : null
  const email = user?.email?.trim() || ''
  const usernameFormatted = user?.username ? `@${user.username}` : 'Not set'
  const organizationName = user?.organization?.name?.trim() || 'Not set'

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      transition
      style={{ pointerEvents: open ? 'auto' : 'none', zIndex: 1400 }}
      modifiers={[
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            boundary: 'viewport',
            padding: 8,
          },
        },
        {
          name: 'offset',
          options: {
            offset: placement.startsWith('right') ? [0, 12] : [0, 10],
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={180}>
          <Box
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            sx={{
              width: 320,
              borderRadius: '12px',
              bgcolor: isDark ? '#1e1e24' : '#ffffff',
              color: isDark ? '#f1f5f9' : '#0f172a',
              border: '1px solid',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.10)'
                : 'rgba(0, 0, 0, 0.08)',
              boxShadow: isDark
                ? '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255,255,255,0.05)'
                : '0 12px 36px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              fontFamily: '"Roboto", "Inter", sans-serif',
              userSelect: 'none',
            }}
          >
            {/* Header Section: Identity */}
            <Box
              sx={{
                p: 1.75,
                bgcolor: isDark
                  ? 'rgba(37, 37, 45, 0.95)'
                  : 'rgba(241, 245, 249, 0.90)',
                borderBottom: '1px solid',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {/* Avatar with online indicator */}
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#1976d2',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  {initial}
                </Avatar>
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    bgcolor: '#10b981',
                    border: '2px solid',
                    borderColor: isDark ? '#1e1e24' : '#ffffff',
                    borderRadius: '50%',
                  }}
                  title="Online"
                />
              </Box>

              {/* Name, role badge, email */}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isDark ? '#ffffff' : '#0f172a',
                    }}
                  >
                    {displayName}
                  </Typography>
                  {roleLabel && (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: isDark ? '#082f49' : '#e0f2fe',
                        color: isDark ? '#38bdf8' : '#0369a1',
                        border: '1px solid',
                        borderColor: isDark
                          ? 'rgba(3, 105, 161, 0.6)'
                          : 'rgba(56, 189, 248, 0.5)',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        px: 0.75,
                        py: 0.15,
                        borderRadius: '4px',
                        lineHeight: 1.3,
                        flexShrink: 0,
                      }}
                    >
                      {roleLabel}
                    </Box>
                  )}
                </Box>
                <Typography
                  noWrap
                  title={email || 'Email not set'}
                  sx={{
                    fontSize: '0.75rem',
                    color: email ? (isDark ? '#a1a1aa' : '#64748b') : (isDark ? '#71717a' : '#94a3b8'),
                    fontStyle: email ? 'normal' : 'italic',
                    mt: 0.25,
                  }}
                >
                  {email || 'Email not set'}
                </Typography>
              </Box>
            </Box>

            {/* User Details Info Section */}
            <Box
              sx={{
                px: 2,
                py: 1.75,
                bgcolor: isDark ? 'rgba(26, 26, 32, 0.65)' : '#ffffff',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
              }}
            >
              {/* Username */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: isDark ? '#a1a1aa' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  Username
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: user?.username ? (isDark ? '#e4e4e7' : '#1e293b') : (isDark ? '#71717a' : '#94a3b8'),
                    fontStyle: user?.username ? 'normal' : 'italic',
                  }}
                >
                  {usernameFormatted}
                </Typography>
              </Box>

              {/* Email */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: isDark ? '#a1a1aa' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  noWrap
                  title={email || 'Email not set'}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: email ? (isDark ? '#e4e4e7' : '#1e293b') : (isDark ? '#71717a' : '#94a3b8'),
                    fontStyle: email ? 'normal' : 'italic',
                    maxWidth: 220,
                    textAlign: 'right',
                  }}
                >
                  {email || 'Not set'}
                </Typography>
              </Box>

              {/* Organization */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: isDark ? '#a1a1aa' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  Organization
                </Typography>
                <Typography
                  noWrap
                  title={organizationName}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: user?.organization?.name ? (isDark ? '#e4e4e7' : '#1e293b') : (isDark ? '#71717a' : '#94a3b8'),
                    fontStyle: user?.organization?.name ? 'normal' : 'italic',
                    maxWidth: 200,
                    textAlign: 'right',
                  }}
                >
                  {organizationName}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </Popper>
  )
}
