'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Loading Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-vintage-dark rounded-lg shadow-md overflow-hidden border border-vintage-border animate-pulse flex-shrink-0 w-[280px] sm:w-[300px]">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4 sm:p-5">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function ProductCarousel({ products, title, loading = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Reset to first slide when products change
  useEffect(() => {
    setCurrentIndex(0);
  }, [products.length]);

  // Number of products to show at once (responsive)
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1280) return 4; // xl
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 640) return 2; // sm
    return 1; // mobile
  };

  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);
      // Reset to first slide when viewport changes
      setCurrentIndex(0);
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Calculate max index based on current itemsPerView
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only auto-play if conditions are met
    if (!isAutoPlaying || loading || products.length === 0 || products.length <= itemsPerView) {
      return;
    }

    // Start auto-play
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // If we've reached the end, loop back to start
        if (nextIndex > maxIndex) {
          return 0;
        }
        return nextIndex;
      });
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, loading, products.length, itemsPerView, maxIndex]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-vintage-dark dark:text-vintage-gold mb-8 text-center transition-colors">
              {title}
            </h2>
          )}
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-vintage-dark dark:text-vintage-gold mb-8 text-center transition-colors">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 z-10 bg-white/95 dark:bg-vintage-dark/95 backdrop-blur-md rounded-full p-3 sm:p-4 shadow-xl hover:bg-vintage-gold hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group border border-vintage-border/50"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-vintage-dark dark:text-vintage-cream group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 z-10 bg-white/95 dark:bg-vintage-dark/95 backdrop-blur-md rounded-full p-3 sm:p-4 shadow-xl hover:bg-vintage-gold hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group border border-vintage-border/50"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-vintage-dark dark:text-vintage-cream group-hover:text-white transition-colors" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {products.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-vintage-gold'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-vintage-gold/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

