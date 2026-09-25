import { useState } from 'react'
import {
  Card, CardContent, CardActionArea, Typography, Box, Chip,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import type { Project } from '../../types'
import { usePermissions } from '../../hooks/usePermissions'

interface Props {
  project: Project
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectCard({ project, onView, onEdit, onDelete }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { canEditProject, canDeleteProject } = usePermissions()

  // Only show the menu button if the user has any write access
  const showMenu = canEditProject || canDeleteProject

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      {/* The MoreVert icon is OUTSIDE CardActionArea to avoid button-in-button */}
      {showMenu && (
        <Box
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget) }}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <CardActionArea
        onClick={() => onView(project)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 0 }}
      >
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, pr: 4 }}>
            <Chip
              label={project.key}
              size="small"
              sx={{
                bgcolor: 'action.selected', color: 'primary.main',
                fontFamily: 'monospace', fontWeight: 700, fontSize: '0.7rem',
                borderRadius: '4px', height: 20,
              }}
            />
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {project.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}
          >
            {project.description || 'No description.'}
          </Typography>
        </CardContent>

        <Box sx={{ px: 2, pb: 1.75, width: '100%' }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
      </CardActionArea>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {canEditProject && (
          <MenuItem onClick={() => { onEdit(project); setAnchorEl(null) }}>
            <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {canDeleteProject && (
          <MenuItem onClick={() => { onDelete(project); setAnchorEl(null) }} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteOutlinedIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  )
}
