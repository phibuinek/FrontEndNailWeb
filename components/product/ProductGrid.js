import ProductCard from './ProductCard';

export default function ProductGrid({ products, title }) {
  return (
    <div className="bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-vintage-dark dark:text-vintage-gold mb-8 text-center transition-colors">
            {title || "Featured Collections"}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
