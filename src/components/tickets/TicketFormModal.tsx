/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Divider,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import type { Ticket, Project, Sprint, User } from '../../types'

interface Props {
  open: boolean
  ticket: Ticket | null
  projects: Project[]
  sprints: Sprint[]
  users: User[]
  defaultProjectId?: number
  onClose: () => void
  onSave: (data: Partial<Ticket>) => Promise<void>
  onDelete?: (ticket: Ticket) => void
  loading?: boolean
}

export default function TicketFormModal({
  open, ticket, projects, sprints, users, defaultProjectId, onClose, onSave, onDelete, loading,
}: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [project, setProject] = useState<number | ''>('')
  const [sprint, setSprint] = useState<number | ''>('')
  const [status, setStatus] = useState<Ticket['status']>('TODO')
  const [priority, setPriority] = useState<Ticket['priority']>('MEDIUM')
  const [assignee, setAssignee] = useState<number | ''>('')

  useEffect(() => {
    if (open) {
      setTitle(ticket?.title ?? '')
      setDescription(ticket?.description ?? '')
      setProject(ticket?.project ?? defaultProjectId ?? '')
      setSprint(ticket?.sprint ?? '')
      setStatus(ticket?.status ?? 'TODO')
      setPriority(ticket?.priority ?? 'MEDIUM')
      setAssignee(ticket?.assignee ?? '')
    }
  }, [ticket, open, defaultProjectId])

  const filteredSprints = sprints.filter((s) => s.project === project)

  const handleSave = () => onSave({
    title, description,
    project: project as number,
    sprint: sprint !== '' ? sprint as number : null,
    status, priority,
    assignee: assignee !== '' ? assignee as number : null,
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{ticket ? `Edit ${ticket.key}` : 'New Ticket'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth required autoFocus
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth multiline rows={3}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Project *</InputLabel>
              <Select value={project} label="Project *" onChange={(e) => { setProject(e.target.value as number); setSprint('') }}>
                {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Sprint</InputLabel>
              <Select value={sprint} label="Sprint" onChange={(e) => setSprint(e.target.value as number | '')}>
                <MenuItem value="">No Sprint</MenuItem>
                {filteredSprints.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as Ticket['status'])}>
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="IN_REVIEW">In Review</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value as Ticket['priority'])}>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Assignee</InputLabel>
            <Select value={assignee} label="Assignee" onChange={(e) => setAssignee(e.target.value as number | '')}>
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.first_name && u.last_name ? `${u.first_name} ${u.last_name} (${u.username})` : u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <Divider sx={{ borderColor: 'divider' }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {ticket && onDelete && (
            <Button
              color="error"
              startIcon={<DeleteOutlinedIcon fontSize="small" />}
              onClick={() => onDelete(ticket)}
              disabled={loading}
              size="small"
            >
              Delete
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !title.trim() || !project}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            {ticket ? 'Save Changes' : 'Create Ticket'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}



