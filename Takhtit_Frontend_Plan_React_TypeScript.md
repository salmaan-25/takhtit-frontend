# Takhtit Frontend Development Plan

> **Project:** Takhtit — Project & Sprint Management
>
> **Backend:** Django + Django REST Framework + PostgreSQL
>
> **Frontend:** React.js + TypeScript + Vite
>
> **Architecture:** React SPA consuming the Django REST API

---

# 1. Frontend Goal

Build a complete, production-style React frontend for Takhtit on top of the Django REST API.

The frontend will provide:

- User registration and login
- JWT authentication
- Automatic access-token refresh
- Protected routes
- Project management
- Sprint management
- Ticket management
- Search and filtering
- Pagination
- Ticket assignment
- Kanban board
- Drag-and-drop status changes
- Dashboard
- Responsive UI
- Loading, empty, success, and error states

The backend API is the source of truth.

The frontend should handle:

```text
UI
Routing
Forms
Client-side validation
API communication
Server-state caching
Authentication state
UX
```

The frontend should **not** duplicate backend business rules.

---

# 2. Why React + Vite Instead of Next.js?

Takhtit is primarily an authenticated project-management application.

Users will spend their time inside:

```text
Dashboard
Projects
Sprints
Tickets
Kanban
```

These pages do not need search-engine indexing or server-side rendering.

Therefore:

```text
React + Vite
        ↓
React Router
        ↓
Django REST API
```

is a simple and appropriate architecture.

We do not need:

- Next.js server components
- Next.js API routes
- Server actions
- SSR
- SSG

This also makes the separation between frontend and backend very clear.

---

# 3. Final Technology Stack

| Requirement | Technology |
|---|---|
| UI | React.js |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Server State | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| Drag & Drop | dnd-kit |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Django REST Framework |
| Authentication | JWT |
| Database | PostgreSQL |

Optional later:

```text
date-fns
Sonner / React Hot Toast
class-variance-authority
```

Do not install every library at the beginning unless it is actually needed.

---

# 4. Overall Architecture

```text
                    TAKHTIT FRONTEND
                           │
                    React + TypeScript
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   React Router       Components          Hooks
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    TanStack Query
                           │
                     API Services
                           │
                         Axios
                           │
                   JWT Authentication
                           │
                    Django REST API
                           │
                       PostgreSQL
```

A request should generally flow like:

```text
Page
 ↓
Custom Hook
 ↓
TanStack Query
 ↓
API Service
 ↓
Axios
 ↓
Django REST API
```

Avoid putting raw Axios calls throughout UI components.

---

# 5. Backend API Contract

The frontend is based on the completed Takhtit API contract.

## Authentication

```http
POST /api/register/
POST /api/auth/login/
POST /api/auth/refresh/
```

Authentication:

```http
Authorization: Bearer <access_token>
```

Token lifetime:

```text
Access token  → 60 minutes
Refresh token → 1 day
```

---

# 6. Projects API

```http
GET    /api/projects/
POST   /api/projects/
GET    /api/projects/:id/
PATCH  /api/projects/:id/
DELETE /api/projects/:id/
```

Project:

```ts
export interface Project {
  id: number;
  name: string;
  key: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}
```

Supported list parameters:

```text
search
ordering
page
```

Frontend capabilities:

```text
Project list
Search
Sorting
Pagination
Create
Edit
Delete
Project details
```

---

# 7. Sprints API

```http
GET    /api/sprints/
POST   /api/sprints/
GET    /api/sprints/:id/
PATCH  /api/sprints/:id/
DELETE /api/sprints/:id/
```

Sprint:

```ts
export type SprintStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED";

export interface Sprint {
  id: number;
  name: string;
  project: number;
  start_date: string;
  end_date: string;
  status: SprintStatus;
  created_at: string;
  updated_at: string;
}
```

Supported parameters:

```text
status
project
search
ordering
page
```

---

# 8. Tickets API

```http
GET    /api/tickets/
POST   /api/tickets/
GET    /api/tickets/:id/
PATCH  /api/tickets/:id/
DELETE /api/tickets/:id/
```

Ticket:

```ts
export type TicketStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type TicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface Ticket {
  id: number;
  key: string;
  title: string;
  description: string;
  project: number;
  sprint: number | null;
  reporter: number;
  assignee: number | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}
```

Supported parameters:

```text
status
priority
project
sprint
assignee
reporter
search
ordering
page
```

---

# 9. Important API Contract Considerations

There are two things to verify before the assignment-heavy parts of the UI.

## User information

Tickets expose:

```text
assignee: number
reporter: number
```

Projects expose:

```text
created_by: number
```

If the API does not expose a user lookup/profile endpoint, the frontend cannot reliably display:

```text
Mohamed
John
Sarah
```

from IDs alone.

Consider eventually providing:

```http
GET /api/users/
GET /api/users/:id/
```

or nested user information in serializers.

For example:

```json
{
  "assignee": {
    "id": 5,
    "username": "salmaan",
    "first_name": "Mohamed"
  }
}
```

Do not work around this by hardcoding users in the frontend.

---

## Ticket key generation

The frontend should not invent ticket keys unless the backend explicitly requires the frontend to provide them.

For example:

```text
TKF-1
TKF-2
TKF-3
```

Ideally the backend generates these based on:

```text
Project key + sequential number
```

Verify this behavior before implementing the final Create Ticket form.

---

# 10. Project Setup

Create the React project:

```bash
npm create vite@latest takhtit-frontend
```

Select:

```text
Framework → React
Variant   → TypeScript
```

Then:

```bash
cd takhtit-frontend
npm install
npm run dev
```

---

# 11. Install Core Dependencies

Install:

```bash
npm install react-router-dom axios
```

TanStack Query:

```bash
npm install @tanstack/react-query
```

Forms:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Drag and drop:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Tailwind should be configured according to the current Vite/Tailwind setup you choose.

Icons:

```bash
npm install lucide-react
```

---

# 12. Environment Variables

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

Use:

```ts
const API_URL = import.meta.env.VITE_API_URL;
```

Never hardcode:

```text
http://localhost:8000
```

throughout the application.

Production:

```env
VITE_API_URL=https://your-production-api.com
```

---

# 13. Recommended Folder Structure

Use a clean feature-oriented structure:

```text
takhtit-frontend/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── projects/
│   │   ├── sprints/
│   │   ├── tickets/
│   │   └── dashboard/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectDetails.tsx
│   │   │   └── ProjectBoard.tsx
│   │   │
│   │   ├── sprints/
│   │   │   └── Sprints.tsx
│   │   │
│   │   └── tickets/
│   │       ├── Tickets.tsx
│   │       └── TicketDetails.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── sprintService.ts
│   │   └── ticketService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   ├── useSprints.ts
│   │   └── useTickets.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── project.ts
│   │   ├── sprint.ts
│   │   └── ticket.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── lib/
│   │   ├── storage.ts
│   │   └── utils.ts
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 14. Why These Folders Exist

## components/

Reusable UI:

```text
Button
Modal
Input
Table
Badge
Sidebar
TicketCard
ProjectCard
```

## pages/

Route-level screens:

```text
Login
Register
Dashboard
Projects
ProjectDetails
Sprints
Tickets
TicketDetails
Board
```

## services/

Only API communication:

```text
GET
POST
PATCH
DELETE
```

## hooks/

Reusable application logic:

```text
useProjects()
useSprints()
useTickets()
useAuth()
```

## types/

TypeScript contracts.

## context/

Client-side authentication/session state.

## layouts/

Common page structure.

---

# 15. Phase 1 — Clean the Vite Project

After creating the project, remove the demo code.

Remove:

```text
React logo
Vite logo
Counter
Demo CSS
```

Create a simple:

```tsx
function App() {
  return <h1>Takhtit</h1>;
}
```

Verify:

```bash
npm run dev
```

At this stage the only goal is:

```text
React works
TypeScript works
Vite works
```

---

# 16. Phase 2 — Application Routing

Install React Router.

Create:

```text
routes/AppRoutes.tsx
routes/ProtectedRoute.tsx
```

Initial routes:

```text
/
 /login
 /register
 /dashboard
 /projects
 /projects/:id
 /projects/:id/sprints
 /projects/:id/board
 /tickets
 /tickets/:id
```

Recommended behavior:

```text
/ 
 ↓
/dashboard
```

if authenticated.

Otherwise:

```text
/
 ↓
/login
```

---

# 17. Route Architecture

Public:

```text
/login
/register
```

Protected:

```text
/dashboard
/projects
/projects/:id
/projects/:id/sprints
/projects/:id/board
/tickets
/tickets/:id
```

Structure:

```text
BrowserRouter
     │
     ▼
AppRoutes
     │
     ├── Public Routes
     │
     └── ProtectedRoute
              │
              ▼
       DashboardLayout
              │
              ▼
        Application Pages
```

---

# 18. Phase 3 — Application Layout

Create:

```text
DashboardLayout
Sidebar
Header
Main Content
```

Suggested sidebar:

```text
TAKHTIT

Dashboard

WORK
Projects
Tickets
Sprints

────────────

Settings
Profile

────────────

Logout
```

Header:

```text
Search
Notifications
User
```

Initially keep it simple.

Polish later.

---

# 19. Phase 4 — Authentication

Create:

```text
Login
Register
AuthContext
ProtectedRoute
authService
```

---

# 20. Register Flow

UI:

```text
Username
Email
Password
First Name
Last Name
```

Request:

```http
POST /api/register/
```

Success:

```text
Register
   ↓
Success
   ↓
/login
```

Handle:

```text
Username already exists
Invalid email
Password validation
Server validation
```

---

# 21. Login Flow

Request:

```http
POST /api/auth/login/
```

Expected:

```json
{
  "access": "...",
  "refresh": "..."
}
```

Flow:

```text
Login form
     ↓
API
     ↓
Access + Refresh
     ↓
Auth state
     ↓
Dashboard
```

---

# 22. Token Storage Strategy

The backend currently uses:

```text
Access token → 60 minutes
Refresh token → 1 day
```

For a browser application, the preferred long-term architecture is:

```text
Refresh token
        ↓
HttpOnly + Secure cookie
        ↓
Not directly readable by JavaScript
```

If the current Django backend returns the refresh token in JSON and requires frontend storage, isolate that decision inside:

```text
lib/storage.ts
AuthContext
authService
```

Do not access localStorage/sessionStorage from random components.

Important:

```text
Do not store authentication tokens in:
- Redux unnecessarily
- individual components
- random localStorage calls
```

Keep authentication centralized.

---

# 23. Axios Client

Create:

```text
services/api.ts
```

Example:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

# 24. Axios Request Interceptor

Every authenticated request should become:

```http
Authorization: Bearer <access_token>
```

Conceptually:

```text
Component
   ↓
API service
   ↓
Axios
   ↓
Interceptor
   ↓
Attach access token
   ↓
Django
```

The UI should not manually add the token every time.

---

# 25. Automatic Token Refresh

Important flow:

```text
API request
     ↓
401?
     ↓
Refresh token
     ↓
POST /api/auth/refresh/
     ↓
New access token
     ↓
Retry original request
```

If refresh fails:

```text
Clear session
     ↓
Logout
     ↓
/login
```

Avoid multiple refresh requests when several API requests fail simultaneously.

Use a refresh queue/single-flight approach.

---

# 26. Phase 5 — TypeScript Types

Create:

```text
types/auth.ts
types/api.ts
types/project.ts
types/sprint.ts
types/ticket.ts
```

Pagination:

```ts
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

---

# 27. Separate Request and Response Types

Do not use one interface for everything.

Example:

```ts
export interface Project {
  id: number;
  name: string;
  key: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}
```

Create request:

```ts
export interface CreateProjectRequest {
  name: string;
  key: string;
  description: string;
}
```

Update:

```ts
export interface UpdateProjectRequest {
  name?: string;
  key?: string;
  description?: string;
}
```

This becomes especially useful when backend serializers evolve.

---

# 28. Phase 6 — API Service Layer

Create:

```text
authService.ts
projectService.ts
sprintService.ts
ticketService.ts
```

Example:

```ts
export const getProjects = (params?: ProjectQueryParams) =>
  api.get<PaginatedResponse<Project>>(
    "/api/projects/",
    { params }
  );
```

Project methods:

```text
getProjects()
getProject(id)
createProject(data)
updateProject(id, data)
deleteProject(id)
```

Sprint:

```text
getSprints()
getSprint(id)
createSprint(data)
updateSprint(id, data)
deleteSprint(id)
```

Ticket:

```text
getTickets()
getTicket(id)
createTicket(data)
updateTicket(id, data)
deleteTicket(id)
```

---

# 29. Phase 7 — TanStack Query

Install and configure:

```text
QueryClient
QueryClientProvider
```

Create:

```text
providers/QueryProvider.tsx
```

Use TanStack Query for:

```text
Projects
Sprints
Tickets
```

Not for every piece of UI state.

---

# 30. Server State vs Client State

### Server state

TanStack Query:

```text
Projects
Sprints
Tickets
```

### Authentication state

AuthContext:

```text
authenticated
user/session
login
logout
```

### UI state

React state:

```text
Modal open
Sidebar open
Selected ticket
Dropdown
```

Avoid introducing Redux unless a genuine global client-state requirement appears.

---

# 31. Query Key Strategy

Use predictable keys:

```ts
["projects"]
["projects", projectId]

["sprints"]
["sprints", sprintId]

["tickets"]
["tickets", ticketId]
```

Filtered data:

```ts
[
  "tickets",
  {
    project: 1,
    sprint: 2,
    status: "IN_PROGRESS"
  }
]
```

This makes invalidation predictable.

---

# 32. Phase 8 — Projects

Route:

```text
/projects
```

Build:

```text
Project list
Search
Ordering
Pagination
Create
Edit
Delete
```

UI:

```text
Projects                         + Create Project

Search projects...

┌──────────────────────────────────────────┐
│ Name       Key       Updated      Action │
├──────────────────────────────────────────┤
│ Takhtit    TKT       Today               │
│ Website    WEB       Yesterday           │
└──────────────────────────────────────────┘
```

---

# 33. Create Project

Modal/page:

```text
Project Name
Project Key
Description

Cancel
Create Project
```

Request:

```http
POST /api/projects/
```

After success:

```text
Create
 ↓
Invalidate projects query
 ↓
Project list updates
```

---

# 34. Edit Project

Request:

```http
PATCH /api/projects/:id/
```

Only send changed fields when appropriate.

Example:

```json
{
  "name": "Takhtit Web"
}
```

After success:

```text
Invalidate:
["projects"]
["projects", id]
```

---

# 35. Delete Project

Use confirmation:

```text
Delete Project?

This action cannot be undone.

[Cancel] [Delete]
```

Request:

```http
DELETE /api/projects/:id/
```

Then invalidate the projects query.

---

# 36. Phase 9 — Project Details

Route:

```text
/projects/:id
```

Layout:

```text
Takhtit
TKT

Description...

Overview
Sprints
Board
```

Suggested tabs:

```text
Overview
Sprints
Board
```

---

# 37. Phase 10 — Sprints

Route:

```text
/projects/:id/sprints
```

Support:

```text
List
Search
Status filter
Create
Edit
Delete
Pagination
```

Statuses:

```text
PLANNED
ACTIVE
COMPLETED
```

---

# 38. Sprint Creation

Fields:

```text
Name
Project
Start Date
End Date
Status
```

Frontend validation:

```text
End date >= Start date
```

But remember:

```text
Frontend validation
        +
Backend validation
```

The backend remains authoritative.

---

# 39. Phase 11 — Tickets

Tickets are the central feature of Takhtit.

Build two interfaces:

```text
Ticket List
Kanban Board
```

---

# 40. Ticket List

Route:

```text
/tickets
```

Filters:

```text
Search
Project
Sprint
Status
Priority
Assignee
Reporter
Ordering
```

Use server-side filtering:

```http
GET /api/tickets/?status=IN_PROGRESS
```

instead of fetching every ticket and filtering locally.

---

# 41. Ticket Creation

Form:

```text
Title
Description
Project
Sprint
Assignee
Status
Priority
```

Do not ask the user for:

```text
Reporter
```

if the backend automatically assigns the authenticated user.

If the backend generates the ticket key:

```text
Do not show Key as a required create field.
```

---

# 42. Ticket Details

Route:

```text
/tickets/:id
```

Display:

```text
TKF-1
Setup Next.js

Priority
Status

Description

Project
Sprint
Assignee
Reporter

Created
Updated
```

Actions:

```text
Edit
Delete
Change status
Change assignee
Move to sprint
```

---

# 43. Ticket Update

The backend's PATCH endpoint makes partial updates easy.

Status:

```http
PATCH /api/tickets/1/
```

```json
{
  "status": "IN_PROGRESS"
}
```

Assignee:

```json
{
  "assignee": 5
}
```

Sprint:

```json
{
  "sprint": 2
}
```

This same mechanism will power the Kanban board.

---

# 44. Phase 12 — Kanban Board

Route:

```text
/projects/:id/board
```

Columns:

```text
TODO
IN PROGRESS
IN REVIEW
DONE
```

Fetch:

```http
GET /api/tickets/?project=1&sprint=2
```

Group tickets by:

```text
ticket.status
```

---

# 45. Ticket Card

Example:

```text
┌─────────────────────────┐
│ TKF-21                  │
│ Build authentication    │
│                         │
│ HIGH                    │
│ 👤 Mohamed              │
└─────────────────────────┘
```

Keep cards small and scannable.

---

# 46. Drag & Drop

Use:

```text
@dnd-kit
```

Flow:

```text
Drag ticket
     ↓
Determine destination column
     ↓
New status
     ↓
PATCH /api/tickets/:id/
     ↓
{
  "status": "IN_REVIEW"
}
```

---

# 47. Optimistic Kanban Updates

Desired UX:

```text
Drag
 ↓
Immediately move card
 ↓
PATCH backend
 ↓
Success
 ↓
Keep card
```

Failure:

```text
PATCH fails
 ↓
Show error
 ↓
Rollback card
```

This is much better than:

```text
Drag
 ↓
Wait for API
 ↓
Move card
```

---

# 48. Filtering + URL State

Where practical, synchronize ticket filters with URL query parameters.

Example:

```text
/tickets?project=1&status=IN_PROGRESS&priority=HIGH
```

Benefits:

```text
Refresh persistence
Browser back/forward
Shareable filtered URLs
Better navigation
```

Do the same for project/sprint filters where useful.

---

# 49. Pagination

Backend response:

```json
{
  "count": 47,
  "next": "...",
  "previous": "...",
  "results": []
}
```

Frontend:

```text
Previous
1
2
3
Next
```

Do not assume:

```text
next !== null
previous !== null
```

Always handle the boundaries.

---

# 50. Phase 13 — Dashboard

Route:

```text
/dashboard
```

Suggested:

```text
Welcome back

Projects       Active Sprints      Open Tickets
   4                 2                  17
```

Then:

```text
Recent Projects

Active Sprints

My Tickets
```

The dashboard can initially compose existing API data.

You do not necessarily need a dedicated dashboard API endpoint.

Later, if performance becomes an issue, the backend can expose an aggregated dashboard endpoint.

---

# 51. Loading States

Every API page needs:

```text
Loading
Empty
Success
Error
```

Examples:

```text
Loading projects...
```

```text
No projects found.

+ Create Project
```

```text
Unable to load projects.

Try Again
```

Use skeletons where appropriate.

---

# 52. Error Handling

Handle:

```text
400
401
403
404
409
422
500
```

Forms:

```text
Field-level validation
```

General errors:

```text
Toast
Alert
Error state
```

401:

```text
Try refresh
 ↓
Refresh fails
 ↓
Logout
```

Do not show raw backend stack traces to users.

---

# 53. Form Architecture

Use:

```text
React Hook Form
+
Zod
```

Example:

```text
ProjectSchema
SprintSchema
TicketSchema
LoginSchema
RegisterSchema
```

Benefits:

```text
Controlled validation
Reusable schemas
Type-safe form values
Cleaner components
```

---

# 54. UI Components

Create reusable components:

```text
Button
Input
Textarea
Select
Modal
Dialog
Badge
Table
Pagination
Dropdown
Skeleton
EmptyState
ErrorState
Spinner
```

Feature-specific:

```text
ProjectCard
SprintCard
TicketCard
TicketFilters
KanbanColumn
KanbanBoard
```

Do not make every feature-specific component generic unnecessarily.

---

# 55. Status and Priority Mapping

Keep UI labels separate from API values.

Backend:

```text
IN_PROGRESS
```

UI:

```text
In Progress
```

Backend:

```text
URGENT
```

UI:

```text
Urgent
```

Create centralized mappings:

```ts
const ticketStatusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};
```

This avoids repeated string formatting.

---

# 56. Responsive Design

Desktop:

```text
Sidebar
+
Main content
```

Tablet:

```text
Collapsible sidebar
```

Mobile:

```text
Drawer / mobile navigation
```

Kanban:

```text
Horizontal scrolling
```

Tables:

```text
Horizontal scroll
```

or mobile card views.

Do not wait until the end to make everything responsive.

---

# 57. Accessibility

Build accessibility into components.

Examples:

```text
Buttons have labels
Inputs have labels
Dialogs can be closed with keyboard
Focus is managed
Color is not the only status indicator
Keyboard navigation works
```

Especially important for:

```text
Kanban
Modals
Dropdowns
Forms
Tables
```

---

# 58. Performance

Do not optimize prematurely.

First make the application correct.

Later consider:

```text
React.memo
useMemo
useCallback
Code splitting
Lazy routes
Virtualized large ticket lists
Image optimization
```

TanStack Query caching will already solve many unnecessary API requests.

---

# 59. Security Considerations

Remember:

```text
React frontend is NOT a security boundary.
```

The backend must enforce:

```text
Authentication
Authorization
Ownership
Permissions
Validation
```

Never trust:

```text
project ID
user ID
assignee ID
ticket ID
```

coming from the browser.

The Django backend must validate all of them.

---

# 60. CORS

Because frontend and backend run separately during development:

```text
React:
http://localhost:5173

Django:
http://localhost:8000
```

Django must allow the frontend origin.

Configure Django CORS appropriately.

Do not use:

```text
CORS_ALLOW_ALL_ORIGINS = True
```

as the final production configuration.

Prefer explicit origins.

---

# 61. Development Environment

Local setup:

```text
React
http://localhost:5173
        │
        │ HTTP
        ▼
Django
http://localhost:8000
        │
        ▼
PostgreSQL
```

Production:

```text
React Hosting
        │
        ▼
Django API
        │
        ▼
PostgreSQL
```

Keep environment-specific URLs in `.env`.

---

# 62. Development Order

Do not build the pages randomly.

Follow this sequence:

```text
Phase 1
React + Vite setup
        ↓
Phase 2
Routing + layouts
        ↓
Phase 3
Authentication
        ↓
Phase 4
Axios + JWT refresh
        ↓
Phase 5
TypeScript API types
        ↓
Phase 6
API services
        ↓
Phase 7
TanStack Query
        ↓
Phase 8
Projects
        ↓
Phase 9
Sprints
        ↓
Phase 10
Tickets
        ↓
Phase 11
Kanban
        ↓
Phase 12
Dashboard
        ↓
Phase 13
Polish + testing
```

---

# 63. Milestone 1 — React Foundation

Goal:

```text
React project running
```

Checklist:

- [ ] Create Vite project
- [ ] TypeScript setup
- [ ] Clean default Vite code
- [ ] Install React Router
- [ ] Install Axios
- [ ] Install TanStack Query
- [ ] Install React Hook Form
- [ ] Install Zod
- [ ] Install dnd-kit
- [ ] Install Lucide
- [ ] Configure Tailwind
- [ ] Add `.env`
- [ ] Create folder structure

---

# 64. Milestone 2 — Routing + Layout

Build:

```text
/login
/register
/dashboard
/projects
/tickets
```

Create:

```text
DashboardLayout
AuthLayout
Sidebar
Header
ProtectedRoute
```

At this point the pages can contain placeholder content.

---

# 65. Milestone 3 — Authentication

Build completely:

```text
Register
Login
Logout
ProtectedRoute
Access token
Refresh token
Axios interceptor
Automatic refresh
Session expiration
```

Do not proceed to complex CRUD until this works.

---

# 66. Milestone 4 — API Foundation

Build:

```text
TypeScript models
Axios client
API services
TanStack Query provider
Query hooks
Mutation hooks
Error handling
```

Test these against the real Django API.

---

# 67. Milestone 5 — Projects

Complete:

```text
Projects list
Search
Pagination
Create
Edit
Delete
Details
```

This establishes your reusable CRUD pattern.

---

# 68. Milestone 6 — Sprints

Complete:

```text
Sprint list
Project filtering
Status filtering
Search
Create
Edit
Delete
Details
```

Reuse patterns learned from Projects.

---

# 69. Milestone 7 — Tickets

Complete:

```text
Ticket list
Search
Filtering
Pagination
Create
Edit
Delete
Details
Assignment
Sprint assignment
Status changes
Priority
```

This establishes the core Takhtit functionality.

---

# 70. Milestone 8 — Kanban

Complete:

```text
Board
Columns
Cards
Drag & Drop
PATCH status
Optimistic updates
Rollback
```

This is where Takhtit starts feeling like a real project-management product.

---

# 71. Milestone 9 — Dashboard

Add:

```text
Project statistics
Sprint statistics
Ticket statistics
Recent projects
Recent tickets
My tickets
```

Initially derive these from existing API endpoints.

---

# 72. Milestone 10 — Production Polish

Complete:

```text
Loading skeletons
Empty states
Error states
Toast notifications
Confirmation dialogs
Responsive design
Accessibility
API error handling
Performance
Security review
Production environment
```

---

# 73. Testing Checklist

## Authentication

- [ ] Register succeeds
- [ ] Invalid registration handled
- [ ] Login succeeds
- [ ] Invalid credentials handled
- [ ] Access token attached
- [ ] Access token expiry handled
- [ ] Refresh succeeds
- [ ] Refresh failure logs out
- [ ] Protected routes work
- [ ] Logout works

## Projects

- [ ] List
- [ ] Search
- [ ] Ordering
- [ ] Pagination
- [ ] Create
- [ ] Edit
- [ ] Delete
- [ ] Details

## Sprints

- [ ] List
- [ ] Project filter
- [ ] Status filter
- [ ] Search
- [ ] Pagination
- [ ] Create
- [ ] Edit
- [ ] Delete
- [ ] Date validation

## Tickets

- [ ] List
- [ ] Search
- [ ] Project filter
- [ ] Sprint filter
- [ ] Status filter
- [ ] Priority filter
- [ ] Assignee filter
- [ ] Reporter filter
- [ ] Pagination
- [ ] Create
- [ ] Edit
- [ ] Delete
- [ ] Assignment
- [ ] Sprint assignment
- [ ] Status update

## Kanban

- [ ] Load board
- [ ] Display all columns
- [ ] Display tickets
- [ ] Drag TODO → IN_PROGRESS
- [ ] Drag IN_PROGRESS → IN_REVIEW
- [ ] Drag IN_REVIEW → DONE
- [ ] Persist after refresh
- [ ] Rollback failed update
- [ ] Handle API error

---

# 74. Final Definition of Done

A user should be able to perform this complete flow:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Project
   ↓
Create Sprint
   ↓
Create Ticket
   ↓
Assign Ticket
   ↓
Move Ticket to Sprint
   ↓
Open Kanban
   ↓
Drag Ticket
   ↓
Status changes
   ↓
Refresh browser
   ↓
Status remains persisted
   ↓
Edit ticket
   ↓
Delete ticket
   ↓
Logout
```

All data must be coming from the real:

```text
React
   ↓
Django REST API
   ↓
PostgreSQL
```

No mock data should remain in the final application.

---

# 75. Final Architecture

```text
                         TAKHTIT
                            │
                  React + TypeScript
                            │
                         Vite
                            │
                  ┌─────────┴─────────┐
                  │                   │
            React Router          Components
                  │                   │
                  │               UI System
                  │                   │
                  └─────────┬─────────┘
                            │
                       AuthContext
                            │
                       TanStack Query
                            │
                       API Services
                            │
                          Axios
                            │
                     JWT Interceptors
                            │
                            ▼
                 Django REST Framework
                            │
                            ▼
                       PostgreSQL
```

---

# 76. Learning Strategy

The goal is not simply to generate the frontend.

Use Takhtit to understand how a real React application is structured.

Learn in this order:

```text
1. Vite
2. React project structure
3. Components
4. Props
5. State
6. Events
7. React Router
8. Forms
9. Axios
10. REST APIs
11. JWT
12. Interceptors
13. Protected routes
14. TanStack Query
15. CRUD
16. Pagination
17. Filtering
18. Optimistic updates
19. Drag & Drop
20. Error handling
21. Responsive design
22. Production deployment
```

At every stage:

```text
Understand
   ↓
Implement
   ↓
Test
   ↓
Refactor
   ↓
Move forward
```

Do not blindly copy architecture.

---

# 77. First Task — Start Here

Do **only this first**:

```text
Create Vite React + TypeScript project
        ↓
Clean Vite boilerplate
        ↓
Install dependencies
        ↓
Configure environment variable
        ↓
Create folder structure
        ↓
Create basic AppRoutes
        ↓
Create Login page
        ↓
Create Register page
        ↓
Create Dashboard placeholder
```

Do NOT start with:

```text
Kanban
Dashboard statistics
Advanced UI
Drag & Drop
```

Those come later.

The first objective is to establish a clean React foundation that can communicate with your completed Django backend.

---

# 78. First Command

Start with:

```bash
npm create vite@latest takhtit-frontend
```

Select:

```text
React
TypeScript
```

Then:

```bash
cd takhtit-frontend
npm install
npm run dev
```

Once the Vite app is running, begin the frontend implementation from **Phase 1** and move through the milestones sequentially.
