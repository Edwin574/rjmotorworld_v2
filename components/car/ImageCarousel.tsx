import { useState } from "react";
import { getOptimizedImageUrl } from "@/lib/imagekit";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

const ImageCarousel = ({ images, alt }: ImageCarouselProps) => {
  const [activeImage, setActiveImage] = useState(0);
  
  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="No image available" 
          className="w-full aspect-[4/3] object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/1200x800/f3f4f6/6b7280?text=No+Image+Available";
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="rounded-lg overflow-hidden mb-4">
        <img 
          src={getOptimizedImageUrl(images[activeImage], 1200, 800)}
          alt={`${alt} - Image ${activeImage + 1}`}
          className="w-full aspect-[4/3] object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`cursor-pointer border-2 rounded-md overflow-hidden hover:border-primary transition ${
              index === activeImage ? 'border-primary' : 'border-gray-200'
            }`}
            onClick={() => setActiveImage(index)}
          >
            <img 
              src={getOptimizedImageUrl(image, 150, 100)}
              alt={`${alt} thumbnail ${index + 1}`}
              className="w-24 h-16 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows for multiple images */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
            onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
            onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
