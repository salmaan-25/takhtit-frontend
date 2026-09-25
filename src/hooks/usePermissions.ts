import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { OrgRole } from '../types'

/**
 * Central hook for role-based access control.
 * Reads the current user role from Redux state and exposes
 * easy-to-use boolean flags for use throughout the UI.
 *
 * Usage:
 *   const { canCreateProject, isAdmin } = usePermissions()
 *   {canCreateProject && <Button>New Project</Button>}
 */
export function usePermissions() {
    const role: OrgRole | null = useSelector(
        (state: RootState) => state.auth.currentUser?.role ?? null
    )

    const isAdmin = role === 'ADMIN'
    const isMember = role === 'MEMBER' || isAdmin
    const isViewer = role === 'VIEWER'

    return {
        // Role flags
        isAdmin,
        isMember,
        isViewer,
        role,

        // Project permissions (Admin only)
        canCreateProject: isAdmin,
        canEditProject: isAdmin,
        canDeleteProject: isAdmin,

        // Sprint permissions (Admin + Member can write)
        canCreateSprint: isMember,
        canEditSprint: isMember,
        canDeleteSprint: isMember,

        // Ticket permissions (Admin + Member can write)
        canCreateTicket: isMember,
        canEditTicket: isMember,
        canDeleteTicket: isMember,
    }
}
