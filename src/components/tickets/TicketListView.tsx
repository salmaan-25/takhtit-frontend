import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Select, MenuItem, Typography, Box, Tooltip, IconButton,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { Ticket, Sprint, User } from '../../types'

const PRIORITY_COLOR: Record<Ticket['priority'], string> = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#F97316',
  URGENT: '#EF4444',
}

interface Props {
  tickets: Ticket[]
  sprints: Sprint[]
  users: User[]
  onTicketClick: (ticket: Ticket) => void
  onStatusChange: (ticketId: number, status: Ticket['status']) => void
}

export default function TicketListView({ tickets, sprints, users, onTicketClick, onStatusChange }: Props) {
  const sprintMap = Object.fromEntries(sprints.map(s => [s.id, s.name]))
  const userMap = Object.fromEntries(users.map(u => [u.id, u.username]))

  if (tickets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography color="text.secondary">No tickets found.</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 90 }}>Key</TableCell>
            <TableCell>Title</TableCell>
            <TableCell sx={{ width: 160 }}>Status</TableCell>
            <TableCell sx={{ width: 110 }}>Priority</TableCell>
            <TableCell sx={{ width: 130 }}>Assignee</TableCell>
            <TableCell sx={{ width: 130 }}>Sprint</TableCell>
            <TableCell sx={{ width: 48 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              hover
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Chip
                  label={ticket.key}
                  size="small"
                  sx={{
                    fontFamily: 'monospace', fontWeight: 600, fontSize: '0.7rem',
                    bgcolor: 'action.selected', color: 'primary.light', borderRadius: '4px', height: 20,
                  }}
                />
              </TableCell>
              <TableCell onClick={() => onTicketClick(ticket)} sx={{ maxWidth: 280 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxWidth: 280,
                  }}
                >
                  {ticket.title}
                </Typography>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Select
                  value={ticket.status}
                  size="small"
                  variant="outlined"
                  onChange={(e) => onStatusChange(ticket.id, e.target.value as Ticket['status'])}
                  sx={{
                    fontSize: '0.78rem', fontWeight: 500,
                    height: 28,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  }}
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="IN_REVIEW">In Review</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: PRIORITY_COLOR[ticket.priority], flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>{ticket.priority}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {ticket.assignee ? (ticket.assignee_username || userMap[ticket.assignee] || `#${ticket.assignee}`) : '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {ticket.sprint ? (sprintMap[ticket.sprint] || `#${ticket.sprint}`) : '—'}
                </Typography>
              </TableCell>
              <TableCell align="right" onClick={() => onTicketClick(ticket)}>
                <Tooltip title="Edit ticket">
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



