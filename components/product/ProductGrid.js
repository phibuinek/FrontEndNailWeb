import ProductCard from './ProductCard';

// Loading Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-vintage-dark rounded-lg shadow-md overflow-hidden border border-vintage-border animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4 sm:p-5">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, title, loading = false }) {
  return (
    <div className="bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <div className="max-w-2xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {title && (
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-vintage-dark dark:text-vintage-gold mb-6 sm:mb-8 text-center transition-colors px-4">
                {title}
            </h2>
        )}
        {loading ? (
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
