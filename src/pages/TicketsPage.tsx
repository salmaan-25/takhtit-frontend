import { useState, useCallback } from 'react'
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
} from '../store/api/apiSlice'
import type { Ticket, Project, Sprint } from '../types'
import KanbanColumn from '../components/tickets/KanbanColumn'
import TicketFormModal from '../components/tickets/TicketFormModal'
import TicketListView from '../components/tickets/TicketListView'
import ConfirmDeleteDialog from '../components/common/ConfirmDeleteDialog'

const COLUMNS: { key: Ticket['status']; label: string }[] = [
  { key: 'TODO',        label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'IN_REVIEW',  label: 'In Review' },
  { key: 'DONE',       label: 'Done' },
]

type ViewMode = 'board' | 'list'

export default function TicketsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [projectFilter, setProjectFilter] = useState<number | ''>('')
  const [sprintFilter, setSprintFilter] = useState<number | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTicket, setEditTicket] = useState<Ticket | null>(null)
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const { data: projectsData } = useGetProjectsQuery()
  const { data: sprintsData } = useGetSprintsQuery(
    projectFilter !== '' ? { project: projectFilter as number } : undefined
  )
  const { data: usersData } = useGetUsersQuery()

  const ticketParams = (() => {
    const p: { project?: number; sprint?: number } = {}
    if (projectFilter !== '') p.project = projectFilter as number
    if (sprintFilter !== '') p.sprint = sprintFilter as number
    return Object.keys(p).length > 0 ? p : undefined
  })()

  const { data: tickets, isLoading, isError } = useGetTicketsQuery(ticketParams)
  const [createTicket, { isLoading: creating }] = useCreateTicketMutation()
  const [updateTicket, { isLoading: updating }] = useUpdateTicketMutation()
  const [deleteTicketMutation, { isLoading: deleting }] = useDeleteTicketMutation()

  const getByStatus = (status: Ticket['status']) =>
    tickets?.filter((t) => t.status === status) ?? []

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination || result.destination.droppableId === result.source.droppableId) return
    try {
      await updateTicket({
        id: Number(result.draggableId),
        body: { status: result.destination.droppableId as Ticket['status'] },
      }).unwrap()
    } catch {
      setSnackbar('Failed to move ticket.')
    }
  }, [updateTicket])

  const handleStatusChange = useCallback(async (ticketId: number, status: Ticket['status']) => {
    try {
      await updateTicket({ id: ticketId, body: { status } }).unwrap()
    } catch {
      setSnackbar('Failed to update status.')
    }
  }, [updateTicket])

  const handleSave = useCallback(async (formData: Partial<Ticket>) => {
    try {
      if (editTicket) {
        await updateTicket({ id: editTicket.id, body: formData }).unwrap()
        setSnackbar('Ticket updated!')
      } else {
        await createTicket(formData).unwrap()
        setSnackbar('Ticket created!')
      }
      setFormOpen(false)
      setEditTicket(null)
    } catch {
      setSnackbar('Something went wrong.')
    }
  }, [editTicket, updateTicket, createTicket])

  const handleDelete = useCallback(async () => {
    if (!ticketToDelete) return
    try {
      await deleteTicketMutation(ticketToDelete.id).unwrap()
      setSnackbar('Ticket deleted.')
      setTicketToDelete(null)
      setFormOpen(false)
    } catch {
      setSnackbar('Failed to delete ticket.')
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Ticket</Button>
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
      <Snackbar open={!!snackbar} autoHideDuration={3500} onClose={() => setSnackbar(null)} message={snackbar} />
    </Box>
  )
}

