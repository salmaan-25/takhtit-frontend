import { Droppable } from '@hello-pangea/dnd'
import { Box, Typography, Paper } from '@mui/material'
import type { Ticket } from '../../types'
import TicketCard from './TicketCard'

const COLUMN_ACCENT: Record<string, string> = {
  TODO: '#6366f1',
  IN_PROGRESS: '#f59e0b',
  IN_REVIEW: '#22d3ee',
  DONE: '#10b981',
}

interface Props {
  status: Ticket['status']
  label: string
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
}

export default function KanbanColumn({ status, label, tickets, onTicketClick }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 260, flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLUMN_ACCENT[status], flexShrink: 0 }} />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem', fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Box sx={{
          ml: 'auto', px: 0.75, height: 18, minWidth: 24,
          bgcolor: 'action.hover', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {tickets.length}
          </Typography>
        </Box>
      </Box>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Paper
            ref={provided.innerRef}
            {...provided.droppableProps}
            variant="outlined"
            sx={{
              flexGrow: 1, minHeight: 300, p: 1.5,
              bgcolor: snapshot.isDraggingOver ? 'rgba(99,102,241,0.07)' : 'transparent',
              borderColor: snapshot.isDraggingOver ? 'primary.main' : 'divider',
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
          >
            {tickets.map((ticket, index) => (
              <TicketCard key={ticket.id} ticket={ticket} index={index} onClick={onTicketClick} />
            ))}
            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Box>
  )
}


