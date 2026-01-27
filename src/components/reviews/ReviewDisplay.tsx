import { format } from 'date-fns';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BookingReview } from '@/types/booking';
import { cn } from '@/lib/utils';

interface ReviewDisplayProps {
  review: BookingReview;
  guestName?: string;
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-24">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8">{value}/5</span>
    </div>
  );
}

export function ReviewDisplay({ review, guestName }: ReviewDisplayProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">
                {review.isAnonymous ? 'Anonymous Guest' : guestName || 'Guest'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), 'dd MMM yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-5 h-5',
                  review.overallRating >= star
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
        </div>

        {/* Ratings Breakdown */}
        <div className="space-y-2 mb-4 pb-4 border-b border-border">
          {review.cleanlinessRating > 0 && (
            <RatingBar label="Cleanliness" value={review.cleanlinessRating} />
          )}
          {review.serviceRating > 0 && (
            <RatingBar label="Service" value={review.serviceRating} />
          )}
          {review.locationRating > 0 && (
            <RatingBar label="Location" value={review.locationRating} />
          )}
        </div>

        {/* Comment */}
        <p className="text-foreground leading-relaxed">{review.comment}</p>

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {review.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Already Reviewed Badge */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-accent" />
            Review submitted on {format(new Date(review.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
