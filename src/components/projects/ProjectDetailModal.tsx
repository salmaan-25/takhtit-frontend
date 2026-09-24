import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import type { Project } from '../../types'

interface Props {
  open: boolean
  project: Project | null
  onClose: () => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, pt: 0.1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}

export default function ProjectDetailModal({ open, project, onClose, onEdit, onDelete }: Props) {
  if (!project) return null

  const created = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const updated = new Date(project.updated_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={project.key}
            size="small"
            sx={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem',
              bgcolor: 'action.selected', color: 'primary.light', borderRadius: '5px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{project.name}</Typography>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: 'divider' }} />

      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        {project.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {project.description}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
            No description provided.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <InfoRow label="Project Key" value={project.key} />
          <InfoRow label="Created" value={created} />
          <InfoRow label="Last Updated" value={updated} />
        </Box>

        <Box sx={{
          mt: 3, p: 2, borderRadius: 2,
          bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider',
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Created on {created}
          </Typography>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'divider' }} />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          color="error"
          startIcon={<DeleteOutlinedIcon fontSize="small" />}
          size="small"
          onClick={() => { onDelete(project); onClose() }}
        >
          Delete
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon fontSize="small" />}
            onClick={() => { onEdit(project); onClose() }}
          >
            Edit Project
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}


