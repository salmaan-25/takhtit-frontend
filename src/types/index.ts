export interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    role: 'ADMIN' | 'MEMBER'
}

export interface Project {
    id: number
    name: string
    key: string
    description: string
    created_by: number
    created_at: string
    updated_at: string
}

export interface Sprint {
    id: number
    name: string
    project: number
    start_date: string | null
    end_date: string | null
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED'
    created_at: string
    updated_at: string
}

export interface Ticket {
    id: number
    key: string
    title: string
    description: string
    project: number
    sprint: number | null
    reporter: number
    assignee: number | null
    assignee_username: string | null
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    created_at: string
    updated_at: string
}

export interface AuthTokens {
    access: string
    refresh: string
}
