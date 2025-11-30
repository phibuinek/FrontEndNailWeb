import HomeView from '@/components/views/HomeView';

async function getProducts() {
  try {
    const res = await fetch('http://127.0.0.1:3001/products', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback mock data if backend is down
    return [
        {
            id: 1,
            name: 'Golden Era Cuticle Oil',
            price: 24.00,
            rating: 4.8,
            description: 'Nourishing oil infused with 24k gold flakes and essential oils.',
            image: '/placeholder.jpg',
        },
        {
            id: 2,
            name: 'Victorian Rose Gel Polish',
            price: 18.50,
            rating: 4.9,
            description: 'A deep, romantic rose shade reminiscent of Victorian gardens.',
            image: '/placeholder.jpg',
        },
        {
            id: 3,
            name: 'Antique Brass Nippers',
            price: 35.00,
            rating: 4.7,
            description: 'Precision crafted cuticle nippers with a stunning antique brass finish.',
            image: '/placeholder.jpg',
        },
        {
            id: 4,
            name: 'Silk Wrap System',
            price: 45.00,
            rating: 4.6,
            description: 'The classic method for natural nail reinforcement and repair.',
            image: '/placeholder.jpg',
        }
    ];
  }
}

export default async function Home() {
  const products = await getProducts();
  // Display only first 8 products for the homepage
  const featuredProducts = products.slice(0, 8);

  return <HomeView products={featuredProducts} />;
}
