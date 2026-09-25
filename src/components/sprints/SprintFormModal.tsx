/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress, Select, MenuItem,
  FormControl, InputLabel,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { type Dayjs } from 'dayjs'
import type { Sprint, Project } from '../../types'

interface Props {
  open: boolean
  sprint: Sprint | null
  projects: Project[]
  defaultProjectId?: number
  onClose: () => void
  onSave: (data: Partial<Sprint>) => Promise<void>
  loading?: boolean
}

export default function SprintFormModal({ open, sprint, projects, defaultProjectId, onClose, onSave, loading }: Props) {
  const [name, setName] = useState('')
  const [project, setProject] = useState<number | ''>('')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [status, setStatus] = useState<Sprint['status']>('PLANNED')

  useEffect(() => {
    if (open) {
      setName(sprint?.name ?? '')
      setProject(sprint?.project ?? defaultProjectId ?? '')
      setStartDate(sprint?.start_date ? dayjs(sprint.start_date) : null)
      setEndDate(sprint?.end_date ? dayjs(sprint.end_date) : null)
      setStatus(sprint?.status ?? 'PLANNED')
    }
  }, [sprint, open, defaultProjectId])

  async function handleSubmit() {
    await onSave({
      name,
      project: project as number,
      start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
      end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
      status,
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{sprint ? 'Edit Sprint' : 'New Sprint'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Sprint Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth required autoFocus
          />
          <FormControl fullWidth size="small">
            <InputLabel>Project *</InputLabel>
            <Select
              value={project}
              label="Project *"
              onChange={(e) => setProject(e.target.value as number)}
            >
              {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as Sprint['status'])}>
              <MenuItem value="PLANNED">Planned</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate ?? undefined}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !project}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {sprint ? 'Save Changes' : 'Create Sprint'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


