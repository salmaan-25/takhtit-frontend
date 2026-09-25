import { useState, useCallback } from 'react'
import {
  Box, Typography, Button, Grid, TextField, InputAdornment,
  MenuItem, Select, FormControl, InputLabel, Skeleton, Alert, Snackbar,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined'
import {
  useGetProjectsQuery, useCreateProjectMutation,
  useUpdateProjectMutation, useDeleteProjectMutation,
} from '../store/api/apiSlice'
import type { Project } from '../types'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import ProjectDetailModal from '../components/projects/ProjectDetailModal'
import ConfirmDeleteDialog from '../components/common/ConfirmDeleteDialog'
import { usePermissions } from '../hooks/usePermissions'

interface FormData { name: string; key: string; description: string }

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [formOpen, setFormOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const { canCreateProject } = usePermissions()
  const { data, isLoading, isError } = useGetProjectsQuery({ search, ordering })
  const [createProject, { isLoading: creating }] = useCreateProjectMutation()
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation()
  const [deleteProjectMutation, { isLoading: deleting }] = useDeleteProjectMutation()

  const handleSave = useCallback(async (formData: FormData) => {
    setFormError(null)
    try {
      if (editProject) {
        await updateProject({ id: editProject.id, body: formData }).unwrap()
        setSnackbar('Project updated!')
      } else {
        await createProject(formData).unwrap()
        setSnackbar('Project created!')
      }
      setFormOpen(false)
      setEditProject(null)
    } catch {
      setFormError('Something went wrong. Please try again.')
    }
  }, [editProject, updateProject, createProject])

  const handleDelete = useCallback(async () => {
    if (!projectToDelete) return
    try {
      await deleteProjectMutation(projectToDelete.id).unwrap()
      setSnackbar('Project deleted.')
      setProjectToDelete(null)
    } catch {
      setSnackbar('Failed to delete project.')
      setProjectToDelete(null)
    }
  }, [projectToDelete, deleteProjectMutation])

  const openCreate = () => { setEditProject(null); setFormError(null); setFormOpen(true) }
  const openEdit = (p: Project) => { setEditProject(p); setFormError(null); setFormOpen(true) }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h5">Projects</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {data?.length ?? 0} project{(data?.length ?? 0) !== 1 ? 's' : ''} total
          </Typography>
        </Box>
        {canCreateProject && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Project</Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3.5, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
            },
          }}
          sx={{ minWidth: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={ordering} label="Sort by" onChange={(e) => setOrdering(e.target.value)}>
            <MenuItem value="-created_at">Newest first</MenuItem>
            <MenuItem value="created_at">Oldest first</MenuItem>
            <MenuItem value="name">Name A–Z</MenuItem>
            <MenuItem value="-name">Name Z–A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load projects. Is the backend running?</Alert>}

      <Grid container spacing={2.5}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton variant="rounded" height={160} sx={{ bgcolor: 'action.hover' }} />
              </Grid>
            ))
          : data?.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProjectCard
                  project={project}
                  onView={setDetailProject}
                  onEdit={openEdit}
                  onDelete={setProjectToDelete}
                />
              </Grid>
            ))
        }
      </Grid>

      {!isLoading && !isError && data?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <FolderOffOutlinedIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>No projects yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first project to get started.
          </Typography>
          {canCreateProject && (
            <Button variant="contained" onClick={openCreate}>Create Project</Button>
          )}
        </Box>
      )}

      <ProjectDetailModal
        open={!!detailProject}
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onEdit={(p) => { setDetailProject(null); openEdit(p) }}
        onDelete={(p) => { setDetailProject(null); setProjectToDelete(p) }}
      />
      <ProjectFormModal
        open={formOpen}
        project={editProject}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        loading={creating || updating}
        error={formError}
      />
      <ConfirmDeleteDialog
        open={!!projectToDelete}
        title="Delete Project"
        message={`Delete "${projectToDelete?.name}"? All associated tickets will be deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setProjectToDelete(null)}
      />
      <Snackbar open={!!snackbar} autoHideDuration={3500} onClose={() => setSnackbar(null)} message={snackbar} />
    </Box>
  )
}



