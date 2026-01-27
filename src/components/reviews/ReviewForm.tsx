import { useState } from 'react';
import { Star, Camera, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  bookingId: string;
  onSubmit: (review: ReviewFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ReviewFormData {
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  comment: string;
  photos: File[];
  isAnonymous: boolean;
}

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

function StarRating({ label, value, onChange, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                (hoverValue || value) >= star
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground self-center">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );
}

export function ReviewForm({ bookingId, onSubmit, onCancel }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    cleanlinessRating: 0,
    serviceRating: 0,
    locationRating: 0,
    comment: '',
    photos: [],
    isAnonymous: false,
  });
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 5) {
      setErrors(prev => ({ ...prev, photos: 'Maximum 5 photos allowed' }));
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotosPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    setErrors(prev => ({ ...prev, photos: '' }));
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photosPreviews[index]);
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      photos: prev.photos.filter((_, i) => i !== index) 
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Please provide an overall rating';
    }
    if (formData.comment.length < 10) {
      newErrors.comment = 'Please write at least 10 characters';
    }
    if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          Write Your Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <StarRating
              label="Overall Rating *"
              value={formData.overallRating}
              onChange={(v) => setFormData(prev => ({ ...prev, overallRating: v }))}
              size="lg"
            />
            {errors.overallRating && (
              <p className="text-sm text-destructive mt-1">{errors.overallRating}</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StarRating
              label="Cleanliness"
              value={formData.cleanlinessRating}
              onChange={(v) => setFormData(prev => ({ ...prev, cleanlinessRating: v }))}
              size="sm"
            />
            <StarRating
              label="Service"
              value={formData.serviceRating}
              onChange={(v) => setFormData(prev => ({ ...prev, serviceRating: v }))}
              size="sm"
            />
            <StarRating
              label="Location"
              value={formData.locationRating}
              onChange={(v) => setFormData(prev => ({ ...prev, locationRating: v }))}
              size="sm"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with other travelers..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between">
              {errors.comment ? (
                <p className="text-sm text-destructive">{errors.comment}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {formData.comment.length}/1000
              </span>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label>Add Photos (optional)</Label>
            <div className="flex flex-wrap gap-3">
              {photosPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.photos.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
            {errors.photos && (
              <p className="text-sm text-destructive">{errors.photos}</p>
            )}
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-b border-border">
            <div>
              <Label htmlFor="anonymous" className="font-medium">Post Anonymously</Label>
              <p className="text-sm text-muted-foreground">
                Your name will not be shown
              </p>
            </div>
            <Switch
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isAnonymous: checked }))
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
