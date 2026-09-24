import { createTheme, alpha } from '@mui/material/styles'

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#9c27b0',
          light: '#ba68c8',
          dark: '#7b1fa2',
          contrastText: '#ffffff',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#121212',
          secondary: '#555555',
        },
        divider: 'rgba(0, 0, 0, 0.10)',
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
          light: '#e3f2fd',
          dark: '#42a5f5',
          contrastText: '#000000',
        },
        secondary: {
          main: '#ce93d8',
          light: '#f3e5f5',
          dark: '#ab47bc',
          contrastText: '#000000',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
        divider: 'rgba(255, 255, 255, 0.10)',
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // ─── Smooth color transitions ────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },

    // ─── Buttons ─────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
          padding: '7px 18px',
          transition: 'all 0.18s ease',
        },
        contained: ({ theme }) => ({
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
          },
        }),
        text: ({ theme }) => ({
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
          },
        }),
        sizeSmall: {
          padding: '5px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 26px',
          fontSize: '1rem',
        },
      },
    },

    // ─── Icon Buttons ─────────────────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.18s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },

    // ─── Dialog (Modal) ───────────────────────────────────────────────────
    MuiDialog: {
      defaultProps: {
        transitionDuration: 250,
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 64px rgba(0,0,0,0.8)'
            : '0 24px 64px rgba(0,0,0,0.18)',
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        }),
        backdrop: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.45)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1.1rem',
          fontWeight: 700,
          padding: '20px 24px 14px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '14px 24px 20px',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 8,
        }),
      },
    },

    // ─── Cards ────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0,0,0,0.4)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.55)'
              : '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        }),
      },
    },

    // ─── Text Fields ──────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'box-shadow 0.18s ease',
            '&.Mui-focused': {
              boxShadow: ({ theme }: { theme: any }) =>
                `0 0 0 3px ${alpha(theme.palette.primary.main, 0.18)}`,
            },
          },
        },
      },
    },

    // ─── Chip ────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },

    // ─── Paper ────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: ({ theme }) => ({
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0,0,0,0.4)'
            : '0 2px 8px rgba(0,0,0,0.07)',
        }),
      },
    },

    // ─── Menu ─────────────────────────────────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 10,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: 160,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 6px',
          padding: '7px 10px',
          fontSize: '0.875rem',
          '&:last-child': {
            marginBottom: 4,
          },
          '&:first-of-type': {
            marginTop: 4,
          },
        },
      },
    },
  },
})

