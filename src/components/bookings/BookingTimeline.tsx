import { format } from 'date-fns';
import { 
  CalendarPlus, 
  CreditCard, 
  LogIn, 
  LogOut, 
  Edit, 
  RefreshCw,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { BookingTimelineEvent } from '@/types/booking';
import { cn } from '@/lib/utils';

interface BookingTimelineProps {
  events: BookingTimelineEvent[];
}

const eventConfig: Record<BookingTimelineEvent['type'], { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  created: { icon: CalendarPlus, color: 'text-primary bg-primary/10' },
  payment: { icon: CreditCard, color: 'text-secondary bg-secondary/10' },
  checkin: { icon: LogIn, color: 'text-secondary bg-secondary/10' },
  checkout: { icon: LogOut, color: 'text-muted-foreground bg-muted' },
  modified: { icon: Edit, color: 'text-accent bg-accent/10' },
  refund: { icon: RefreshCw, color: 'text-accent bg-accent/10' },
  cancelled: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
};

export function BookingTimeline({ events }: BookingTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4">
        {sortedEvents.map((event, index) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;
          const isFirst = index === 0;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div 
                className={cn(
                  'relative z-10 flex items-center justify-center w-10 h-10 rounded-full',
                  config.color,
                  isFirst && 'ring-4 ring-background'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {event.description}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(event.timestamp), 'dd MMM yyyy, h:mm a')}
                  </time>
                </div>
              </div>
            </div>
          );
        })}

        {/* Completed indicator */}
        <div className="relative flex gap-4">
          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-muted">
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 flex items-center">
            <p className="text-sm text-muted-foreground">Booking journey started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
