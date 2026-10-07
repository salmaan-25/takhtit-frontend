import { useState, useCallback, useMemo } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import {
  Box, Typography, Button, Alert, Snackbar,
  Select, MenuItem, FormControl, InputLabel, Skeleton, ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import {
  useGetTicketsQuery, useGetProjectsQuery, useGetSprintsQuery, useGetUsersQuery,
  useCreateTicketMutation, useUpdateTicketMutation, useDeleteTicketMutation,
  apiSlice,
} from '../store/api/apiSlice'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import type { Ticket, Project, Sprint } from '../types'
import KanbanColumn from '../components/tickets/KanbanColumn'
import TicketFormModal from '../components/tickets/TicketFormModal'
import TicketListView from '../components/tickets/TicketListView'
import ConfirmDeleteDialog from '../components/common/ConfirmDeleteDialog'
import { usePermissions } from '../hooks/usePermissions'

const COLUMNS: { key: Ticket['status']; label: string }[] = [
  { key: 'TODO',        label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'IN_REVIEW',  label: 'In Review' },
  { key: 'DONE',       label: 'Done' },
]

type ViewMode = 'board' | 'list'

/** Extract a readable message from an RTK Query error */
function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (e.data && typeof e.data === 'object') {
      const data = e.data as Record<string, unknown>
      if (typeof data.detail === 'string') return data.detail
      const first = Object.values(data)[0]
      if (Array.isArray(first) && typeof first[0] === 'string') return first[0]
    }
    if (typeof e.error === 'string') return e.error
  }
  return 'Something went wrong. Please try again.'
}

export default function TicketsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const { canCreateTicket } = usePermissions()
  const [projectFilter, setProjectFilter] = useState<number | ''>('')
  const [sprintFilter, setSprintFilter] = useState<number | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTicket, setEditTicket] = useState<Ticket | null>(null)
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  const { data: projectsData } = useGetProjectsQuery()
  const { data: sprintsData } = useGetSprintsQuery(
    projectFilter !== '' ? { project: projectFilter as number } : undefined
  )
  const { data: usersData } = useGetUsersQuery()

  // Stable reference — only changes when the filter values actually change
  const ticketParams = useMemo<{ project?: number; sprint?: number } | undefined>(() => {
    const p: { project?: number; sprint?: number } = {}
    if (projectFilter !== '') p.project = projectFilter as number
    if (sprintFilter !== '') p.sprint = sprintFilter as number
    return Object.keys(p).length > 0 ? p : undefined
  }, [projectFilter, sprintFilter])

  const { data: tickets, isLoading, isError } = useGetTicketsQuery(ticketParams)
  const [createTicket, { isLoading: creating }] = useCreateTicketMutation()
  const [updateTicket, { isLoading: updating }] = useUpdateTicketMutation()
  const [deleteTicketMutation, { isLoading: deleting }] = useDeleteTicketMutation()

  const getByStatus = (status: Ticket['status']) =>
    tickets?.filter((t) => t.status === status) ?? []

  // ── Optimistic status change helper ────────────────────────────────────────
  const optimisticStatusUpdate = useCallback(
    async (ticketId: number, newStatus: Ticket['status']) => {
      // 1. Instantly update the cache (UI changes immediately)
      const patchResult = dispatch(
        apiSlice.util.updateQueryData('getTickets', ticketParams, (draft) => {
          const ticket = draft.find((t) => t.id === ticketId)
          if (ticket) ticket.status = newStatus
        })
      )

      try {
        // 2. Fire the real API call in the background
        await updateTicket({ id: ticketId, body: { status: newStatus } }).unwrap()
      } catch (err) {
        // 3. On failure: revert the cache and show the API error message
        patchResult.undo()
        setSnackbar({ message: getErrorMessage(err), severity: 'error' })
      }
    },
    [dispatch, ticketParams, updateTicket]
  )

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination || result.destination.droppableId === result.source.droppableId) return
    await optimisticStatusUpdate(
      Number(result.draggableId),
      result.destination.droppableId as Ticket['status']
    )
  }, [optimisticStatusUpdate])

  const handleStatusChange = useCallback(async (ticketId: number, status: Ticket['status']) => {
    await optimisticStatusUpdate(ticketId, status)
  }, [optimisticStatusUpdate])

  const handleSave = useCallback(async (formData: Partial<Ticket>) => {
    try {
      if (editTicket) {
        await updateTicket({ id: editTicket.id, body: formData }).unwrap()
        setSnackbar({ message: 'Ticket updated!', severity: 'success' })
      } else {
        await createTicket(formData).unwrap()
        setSnackbar({ message: 'Ticket created!', severity: 'success' })
      }
      setFormOpen(false)
      setEditTicket(null)
    } catch (err) {
      setSnackbar({ message: getErrorMessage(err), severity: 'error' })
    }
  }, [editTicket, updateTicket, createTicket])

  const handleDelete = useCallback(async () => {
    if (!ticketToDelete) return
    try {
      await deleteTicketMutation(ticketToDelete.id).unwrap()
      setSnackbar({ message: 'Ticket deleted.', severity: 'success' })
      setTicketToDelete(null)
      setFormOpen(false)
    } catch (err) {
      setSnackbar({ message: getErrorMessage(err), severity: 'error' })
    }
  }, [ticketToDelete, deleteTicketMutation])

  const openEdit = (t: Ticket) => { setEditTicket(t); setFormOpen(true) }
  const openCreate = () => { setEditTicket(null); setFormOpen(true) }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, minHeight: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5">Tickets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {tickets?.length ?? 0} ticket{(tickets?.length ?? 0) !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => { if (v) setViewMode(v) }}
            size="small"
          >
            <ToggleButton value="board" aria-label="Board view">
              <ViewKanbanOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} /> Board
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view">
              <TableRowsOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} /> List
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} disabled={!canCreateTicket}>New Ticket</Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={projectFilter}
            label="Project"
            onChange={(e) => { setProjectFilter(e.target.value as number | ''); setSprintFilter('') }}
          >
            <MenuItem value="">All Projects</MenuItem>
            {projectsData?.map((p: Project) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }} disabled={projectFilter === ''}>
          <InputLabel>Sprint</InputLabel>
          <Select value={sprintFilter} label="Sprint" onChange={(e) => setSprintFilter(e.target.value as number | '')}>
            <MenuItem value="">All Sprints</MenuItem>
            {sprintsData?.map((s: Sprint) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load tickets.</Alert>}

      {/* Views */}
      {isLoading ? (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', minWidth: 0 }}>
          {COLUMNS.map((c) => <Skeleton key={c.key} variant="rounded" sx={{ minWidth: 240, flex: 1 }} height={400} />)}
        </Box>
      ) : viewMode === 'board' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, flexGrow: 1, alignItems: 'flex-start', minWidth: 0, minHeight: 0 }}>
            {COLUMNS.map(({ key, label }) => (
              <KanbanColumn
                key={key}
                status={key}
                label={label}
                tickets={getByStatus(key)}
                onTicketClick={openEdit}
              />
            ))}
          </Box>
        </DragDropContext>
      ) : (
        <TicketListView
          tickets={tickets ?? []}
          sprints={sprintsData ?? []}
          users={usersData ?? []}
          onTicketClick={openEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      <TicketFormModal
        open={formOpen}
        ticket={editTicket}
        projects={projectsData ?? []}
        sprints={sprintsData ?? []}
        users={usersData ?? []}
        defaultProjectId={projectFilter !== '' ? projectFilter as number : undefined}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onDelete={(t) => { setFormOpen(false); setTicketToDelete(t) }}
        loading={creating || updating}
      />
      <ConfirmDeleteDialog
        open={!!ticketToDelete}
        title="Delete Ticket"
        message={`Delete "${ticketToDelete?.title}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setTicketToDelete(null)}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3500}
        onClose={() => setSnackbar(null)}
        message={snackbar?.message}
        slotProps={{ content: { sx: snackbar?.severity === 'error'
            ? { bgcolor: 'error.dark', color: 'error.contrastText' }
            : { bgcolor: 'success.dark', color: 'success.contrastText' } } }}
      />
    </Box>
  )
}
