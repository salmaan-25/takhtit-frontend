import { useState, useCallback } from 'react'
import {
  Box, Typography, Button, Alert, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Tooltip, Skeleton, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {
  useGetSprintsQuery, useGetProjectsQuery,
  useCreateSprintMutation, useUpdateSprintMutation, useDeleteSprintMutation,
} from '../store/api/apiSlice'
import type { Sprint, Project } from '../types'
import SprintFormModal from '../components/sprints/SprintFormModal'
import ConfirmDeleteDialog from '../components/common/ConfirmDeleteDialog'
import { usePermissions } from '../hooks/usePermissions'

const STATUS_COLOR: Record<Sprint['status'], 'warning' | 'success' | 'default'> = {
  PLANNED: 'warning',
  ACTIVE: 'success',
  COMPLETED: 'default',
}

export default function SprintsPage() {
  const [projectFilter, setProjectFilter] = useState<number | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editSprint, setEditSprint] = useState<Sprint | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const { canCreateSprint, canEditSprint, canDeleteSprint } = usePermissions()
  const { data: projectsData } = useGetProjectsQuery()
  const { data, isLoading, isError } = useGetSprintsQuery(
    projectFilter !== '' ? { project: projectFilter as number } : undefined
  )
  const [createSprint, { isLoading: creating }] = useCreateSprintMutation()
  const [updateSprint, { isLoading: updating }] = useUpdateSprintMutation()
  const [deleteSprintMutation, { isLoading: deleting }] = useDeleteSprintMutation()

  const handleSave = useCallback(async (formData: Partial<Sprint>) => {
    try {
      if (editSprint) {
        await updateSprint({ id: editSprint.id, body: formData }).unwrap()
        setSnackbar('Sprint updated!')
      } else {
        await createSprint(formData).unwrap()
        setSnackbar('Sprint created!')
      }
      setFormOpen(false)
      setEditSprint(null)
    } catch {
      setSnackbar('Something went wrong. Please try again.')
    }
  }, [editSprint, updateSprint, createSprint])

  const handleDelete = useCallback(async () => {
    if (!sprintToDelete) return
    try {
      await deleteSprintMutation(sprintToDelete.id).unwrap()
      setSnackbar('Sprint deleted.')
      setSprintToDelete(null)
    } catch {
      setSnackbar('Failed to delete sprint.')
      setSprintToDelete(null)
    }
  }, [sprintToDelete, deleteSprintMutation])

  const openCreate = () => { setEditSprint(null); setFormOpen(true) }
  const openEdit = (s: Sprint) => { setEditSprint(s); setFormOpen(true) }
  const fmt = (d: string | null) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—'

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5">Sprints</Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.length ?? 0} sprint{(data?.length ?? 0) !== 1 ? 's' : ''}
          </Typography>
        </Box>
        {canCreateSprint && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Sprint</Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Project</InputLabel>
          <Select
            value={projectFilter}
            label="Filter by Project"
            onChange={(e) => setProjectFilter(e.target.value as number | '')}
          >
            <MenuItem value="">All Projects</MenuItem>
            {projectsData?.map((p: Project) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load sprints.</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sprint Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.map((sprint) => (
                  <TableRow key={sprint.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{sprint.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={sprint.status.replace('_', ' ')} color={STATUS_COLOR[sprint.status]} size="small" />
                    </TableCell>
                    <TableCell>{fmt(sprint.start_date)}</TableCell>
                    <TableCell>{fmt(sprint.end_date)}</TableCell>
                    <TableCell align="right">
                      {canEditSprint && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(sprint)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDeleteSprint && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setSprintToDelete(sprint)}>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && !isError && data?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>No sprints found.</Typography>
          {canCreateSprint && (
            <Button variant="outlined" onClick={openCreate}>Create Sprint</Button>
          )}
        </Box>
      )}

      <SprintFormModal
        open={formOpen}
        sprint={editSprint}
        projects={projectsData ?? []}
        defaultProjectId={projectFilter !== '' ? projectFilter as number : undefined}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        loading={creating || updating}
      />
      <ConfirmDeleteDialog
        open={!!sprintToDelete}
        title="Delete Sprint"
        message={`Delete "${sprintToDelete?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setSprintToDelete(null)}
      />
      <Snackbar open={!!snackbar} autoHideDuration={3500} onClose={() => setSnackbar(null)} message={snackbar} />
    </Box>
  )
}





