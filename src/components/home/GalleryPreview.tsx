import { Link } from 'react-router-dom';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { galleryImages } from '@/data/hotelData';
import { Hotel } from '@/models/home.models';
import { useMemo } from 'react';
import { environment } from '../../../environment';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export function GalleryPreview({ hotel }: { hotel: Hotel | null }) {
  // Combine all hotel images and map them properly
  const hotelGalleryImages = useMemo(() => {
    if (!hotel) return [];

    const images: GalleryImage[] = [];
    let imageIndex = 0;

    // Helper to construct full image URL
    const getImageUrl = (imagePath: string | undefined): string | null => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${environment.imageBaseUrl}${imagePath}`;
    };

    // Add cover image if available
    if (hotel.coverImages) {
      const coverUrl = getImageUrl(hotel.coverImages);
      if (coverUrl) {
        images.push({
          id: `cover-${imageIndex++}`,
          url: coverUrl,
          caption: `${hotel.hotelName} - Main View`,
          category: 'exterior',
        });
      }
    }

    // Add interior images
    if (hotel.interiorImage && Array.isArray(hotel.interiorImage)) {
      hotel.interiorImage.forEach((img, idx) => {
        const imagePath = typeof img === 'string' ? img : img?.url || img?.path || img;
        const imageUrl = getImageUrl(imagePath);
        if (imageUrl) {
          images.push({
            id: `interior-${idx}`,
            url: imageUrl,
            caption: `${hotel.hotelName} - Interior ${idx + 1}`,
            category: 'interior',
          });
        }
      });
    }

    // Add additional images
    if (hotel.additionalImages && Array.isArray(hotel.additionalImages)) {
      hotel.additionalImages.forEach((img, idx) => {
        const imageUrl = getImageUrl(img);
        if (imageUrl) {
          images.push({
            id: `additional-${idx}`,
            url: imageUrl,
            caption: `${hotel.hotelName} - Gallery ${idx + 1}`,
            category: 'gallery',
          });
        }
      });
    }

    return images.slice(0, 6); // Show first 6 images
  }, [hotel]);

  // Use hotel images if available, otherwise fallback to static images
  const previewImages = hotelGalleryImages.length > 0 
    ? hotelGalleryImages 
    : galleryImages.slice(0, 6);

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
        {previewImages.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery images available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
