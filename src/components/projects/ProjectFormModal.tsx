/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress, Alert,
} from '@mui/material'
import type { Project } from '../../types'

interface FormData {
  name: string
  key: string
  description: string
}

interface Props {
  open: boolean
  project: Project | null
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
  loading?: boolean
  error?: string | null
}

export default function ProjectFormModal({ open, project, onClose, onSave, loading, error }: Props) {
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      setName(project?.name ?? '')
      setKey(project?.key ?? '')
      setDescription(project?.description ?? '')
    }
  }, [project, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: error ? 0 : 1 }}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth required autoFocus
          />
          <TextField
            label="Key (e.g. TKF)"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            fullWidth required
            slotProps={{ htmlInput: { maxLength: 6 } }}
            helperText="Short uppercase identifier for tickets (3–6 chars)"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth multiline rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave({ name, key, description })}
          disabled={loading || !name.trim() || !key.trim()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


