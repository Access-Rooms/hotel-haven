import { Link } from 'react-router-dom';
import { ArrowRight, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { galleryImages } from '@/data/hotelData';

export function GalleryPreview() {
  const previewImages = galleryImages.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container-hotel">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
              Gallery
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Explore Our Resort
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild className="self-start sm:self-auto">
            <Link to="/gallery">
              <Images size={18} />
              View All Photos
            </Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((image, index) => (
            <Link
              key={image.id}
              to="/gallery"
              className={`relative rounded-2xl overflow-hidden group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.caption}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  index === 0 ? 'h-64 sm:h-80 md:h-full' : 'h-40 sm:h-48'
                }`}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-card opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-medium">{image.caption}</p>
                <p className="text-sm text-card/80 capitalize">{image.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
