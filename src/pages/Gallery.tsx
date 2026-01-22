import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { galleryImages } from '@/data/hotelData';
import { cn } from '@/lib/utils';
import { useHotels } from '@/contexts/HotelContext';
import { environment } from '../../environment';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'room', label: 'Rooms' },
  { id: 'dining', label: 'Dining' },
  { id: 'pool', label: 'Pool' },
  { id: 'spa', label: 'Spa' },
  { id: 'events', label: 'Events' },
];

export default function Gallery() {
  const { selectedHotel } = useHotels();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  // Combine all hotel images and map them properly
  const hotelGalleryImages = useMemo(() => {
    if (!selectedHotel) return [];

    const images: GalleryImage[] = [];
    let imageIndex = 0;

    // Helper to construct full image URL
    const getImageUrl = (imagePath: string | undefined): string | null => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${environment.imageBaseUrl}${imagePath}`;
    };

    // Add cover image if available
    if (selectedHotel.coverImages) {
      const coverUrl = getImageUrl(selectedHotel.coverImages);
      if (coverUrl) {
        images.push({
          id: `cover-${imageIndex++}`,
          url: coverUrl,
          caption: `${selectedHotel.hotelName} - Main View`,
          category: 'exterior',
        });
      }
    }

    // Add interior images
    if (selectedHotel.interiorImage && Array.isArray(selectedHotel.interiorImage)) {
      selectedHotel.interiorImage.forEach((img, idx) => {
        const imagePath = typeof img === 'string' ? img : img?.url || img?.path || img;
        const imageUrl = getImageUrl(imagePath);
        if (imageUrl) {
          images.push({
            id: `interior-${idx}`,
            url: imageUrl,
            caption: `${selectedHotel.hotelName} - Interior ${idx + 1}`,
            category: 'interior',
          });
        }
      });
    }

    // Add additional images
    if (selectedHotel.additionalImages && Array.isArray(selectedHotel.additionalImages)) {
      selectedHotel.additionalImages.forEach((img, idx) => {
        const imageUrl = getImageUrl(img);
        if (imageUrl) {
          images.push({
            id: `additional-${idx}`,
            url: imageUrl,
            caption: `${selectedHotel.hotelName} - Gallery ${idx + 1}`,
            category: 'gallery',
          });
        }
      });
    }

    return images;
  }, [selectedHotel]);

  // Use hotel images if available, otherwise fallback to static images
  const allImages = hotelGalleryImages.length > 0 ? hotelGalleryImages : galleryImages;

  const filteredImages =
    activeCategory === 'all'
      ? allImages
      : allImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((prev) => (prev! + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={selectedHotel} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero">
        <div className="container-hotel text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            Photo Gallery
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Take a visual journey through our stunning resort and facilities
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-[72px] z-40 bg-card/95 backdrop-blur-md border-b border-border py-4">
        <div className="container-hotel">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-hotel">
          {filteredImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="block w-full rounded-2xl overflow-hidden group relative break-inside-avoid"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-card font-medium">{image.caption}</p>
                    <p className="text-card/80 text-sm capitalize">{image.category}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No images available in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage !== null && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-card/10 hover:bg-card/20 flex items-center justify-center text-card transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/10 hover:bg-card/20 flex items-center justify-center text-card transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/10 hover:bg-card/20 flex items-center justify-center text-card transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="max-w-5xl max-h-[85vh] p-4">
            <img
              src={filteredImages[lightboxImage].url}
              alt={filteredImages[lightboxImage].caption}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-card font-medium text-lg">
                {filteredImages[lightboxImage].caption}
              </p>
              <p className="text-card/70 text-sm mt-1">
                {lightboxImage + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer hotel={selectedHotel} />
      <WhatsAppButton />
    </div>
  );
}
