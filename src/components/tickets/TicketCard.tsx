import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material'
import type { Ticket } from '../../types'

const PRIORITY_DOT: Record<Ticket['priority'], string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f43f5e',
  URGENT: '#9333ea',
}

interface Props {
  ticket: Ticket
  index: number
  onClick: (ticket: Ticket) => void
}

export default function TicketCard({ ticket, index, onClick }: Props) {
  return (
    <Draggable draggableId={String(ticket.id)} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(ticket)}
          sx={{
            mb: 1.5, cursor: 'pointer',
            opacity: snapshot.isDragging ? 0.9 : 1,
            transform: snapshot.isDragging ? 'rotate(1.5deg) scale(1.02)' : 'none',
            transition: 'opacity 0.15s',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.04em' }}
              >
                {ticket.key}
              </Typography>
              <Tooltip title={`Priority: ${ticket.priority}`}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: PRIORITY_DOT[ticket.priority], flexShrink: 0 }} />
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4,
              }}
            >
              {ticket.title}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

