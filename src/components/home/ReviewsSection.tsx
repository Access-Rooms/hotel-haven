import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { reviews } from '@/data/hotelData';
import { cn } from '@/lib/utils';

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-background blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-background blur-3xl" />
      </div>

      <div className="container-hotel relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            What Our Guests Say
          </h2>
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <Quote size={80} className="absolute -top-8 left-0 text-primary-foreground/10" />

            {/* Review Content */}
            <div className="text-center px-8 sm:px-16">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={cn(
                    'transition-all duration-500',
                    index === activeIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 absolute inset-0 translate-y-8 pointer-events-none'
                  )}
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={cn(
                          i < review.rating
                            ? 'text-hotel-accent fill-hotel-accent'
                            : 'text-primary-foreground/30'
                        )}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xl sm:text-2xl text-primary-foreground leading-relaxed mb-8 font-light italic">
                    "{review.comment}"
                  </p>

                  {/* Guest Info */}
                  <div className="flex items-center justify-center gap-4">
                    {review.avatar && (
                      <img
                        src={review.avatar}
                        alt={review.guestName}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-foreground/20"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-display font-semibold text-primary-foreground">
                        {review.guestName}
                      </p>
                      <p className="text-sm text-primary-foreground/70">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all duration-300',
                      index === activeIndex
                        ? 'bg-primary-foreground w-8'
                        : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
                    )}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="Next review"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
