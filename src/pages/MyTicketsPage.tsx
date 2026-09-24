import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Chip, Grid, Paper, Skeleton, Alert, Snackbar,
  TextField, InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import {
  useGetMyTicketsQuery, useGetSprintsQuery, useGetUsersQuery,
  useUpdateTicketMutation,
} from '../store/api/apiSlice'
import type { Ticket } from '../types'
import type { RootState } from '../store'
import TicketListView from '../components/tickets/TicketListView'
import TicketFormModal from '../components/tickets/TicketFormModal'
import { useGetProjectsQuery } from '../store/api/apiSlice'

const STATUS_TABS: { value: string; label: string; color: 'default' | 'warning' | 'info' | 'success' }[] = [
  { value: 'all',         label: 'All',         color: 'default' },
  { value: 'TODO',        label: 'To Do',       color: 'default' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'warning' },
  { value: 'IN_REVIEW',   label: 'In Review',   color: 'info' },
  { value: 'DONE',        label: 'Done',        color: 'success' },
]

interface StatCardProps { label: string; value: number; color?: string }
function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Paper variant="outlined" sx={{
      p: 2.5, borderRadius: 2,
      borderColor: color ? `${color}30` : 'divider',
      bgcolor: color ? `${color}08` : 'background.paper',
    }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: color || 'text.primary', lineHeight: 1, mb: 0.75 }}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Paper>
  )
}

export default function MyTicketsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editTicket, setEditTicket] = useState<Ticket | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const { data: tickets, isLoading, isError } = useGetMyTicketsQuery()
  const { data: projectsData } = useGetProjectsQuery()
  const { data: sprintsData } = useGetSprintsQuery()
  const { data: usersData } = useGetUsersQuery()
  const [updateTicket, { isLoading: updating }] = useUpdateTicketMutation()

  // Compute counts per status
  const counts = {
    all: tickets?.length ?? 0,
    TODO: tickets?.filter(t => t.status === 'TODO').length ?? 0,
    IN_PROGRESS: tickets?.filter(t => t.status === 'IN_PROGRESS').length ?? 0,
    IN_REVIEW: tickets?.filter(t => t.status === 'IN_REVIEW').length ?? 0,
    DONE: tickets?.filter(t => t.status === 'DONE').length ?? 0,
  }

  // Apply filters
  const filtered = tickets?.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.key.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }) ?? []

  const handleStatusChange = useCallback(async (ticketId: number, status: Ticket['status']) => {
    try {
      await updateTicket({ id: ticketId, body: { status } }).unwrap()
      setSnackbar('Status updated.')
    } catch {
      setSnackbar('Failed to update status.')
    }
  }, [updateTicket])

  const handleSave = useCallback(async (formData: Partial<Ticket>) => {
    if (!editTicket) return
    try {
      await updateTicket({ id: editTicket.id, body: formData }).unwrap()
      setSnackbar('Ticket updated!')
      setFormOpen(false)
      setEditTicket(null)
    } catch {
      setSnackbar('Something went wrong.')
    }
  }, [editTicket, updateTicket])

  const openEdit = (t: Ticket) => { setEditTicket(t); setFormOpen(true) }

  const greeting = currentUser?.first_name || currentUser?.username || 'you'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">My Tickets</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Tickets assigned to {greeting}
        </Typography>
      </Box>

      {/* Stats grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3, md: 'auto' }} sx={{ minWidth: 130 }}>
          <StatCard label="To Do" value={counts.TODO} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 'auto' }} sx={{ minWidth: 130 }}>
          <StatCard label="In Progress" value={counts.IN_PROGRESS} color="#F59E0B" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 'auto' }} sx={{ minWidth: 130 }}>
          <StatCard label="In Review" value={counts.IN_REVIEW} color="#38BDF8" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 'auto' }} sx={{ minWidth: 130 }}>
          <StatCard label="Done" value={counts.DONE} color="#10B981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 'auto' }} sx={{ minWidth: 130 }}>
          <StatCard label="Total" value={counts.all} color="#4F6BED" />
        </Grid>
      </Grid>

      {/* Search + Status filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search my tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
            },
          }}
          sx={{ minWidth: 240 }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {STATUS_TABS.map(tab => (
            <Chip
              key={tab.value}
              label={`${tab.label}${tab.value === 'all' ? ` (${counts.all})` : counts[tab.value as keyof typeof counts] > 0 ? ` (${counts[tab.value as keyof typeof counts]})` : ''}`}
              onClick={() => setStatusFilter(tab.value)}
              variant={statusFilter === tab.value ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer', fontWeight: 500, borderRadius: '6px',
                ...(statusFilter === tab.value && {
                  bgcolor: 'action.selected', color: 'primary.light',
                  borderColor: 'primary.main',
                }),
              }}
            />
          ))}
        </Box>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load tickets.</Alert>}

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={44} />)}
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <AssignmentLateOutlinedIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
            {counts.all === 0 ? 'No tickets assigned to you' : 'No tickets match your filter'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {counts.all === 0
              ? 'Ask your team lead to assign you some tickets.'
              : 'Try changing the status filter or search term.'}
          </Typography>
        </Box>
      ) : (
        <TicketListView
          tickets={filtered}
          sprints={sprintsData ?? []}
          users={usersData ?? []}
          onTicketClick={openEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {editTicket && (
        <TicketFormModal
          open={formOpen}
          ticket={editTicket}
          projects={projectsData ?? []}
          sprints={sprintsData ?? []}
          users={usersData ?? []}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          loading={updating}
        />
      )}
      <Snackbar open={!!snackbar} autoHideDuration={3500} onClose={() => setSnackbar(null)} message={snackbar} />
    </Box>
  )
}






