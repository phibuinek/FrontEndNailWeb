import ProductCard from './ProductCard';

export default function ProductGrid({ products, title }) {
  return (
    <div className="bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <div className="max-w-2xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {title && (
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-vintage-dark dark:text-vintage-gold mb-6 sm:mb-8 text-center transition-colors px-4">
                {title}
            </h2>
        )}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
