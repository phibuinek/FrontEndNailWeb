'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">Journal</h1>
        <p className="text-lg text-vintage-dark dark:text-vintage-cream/80">
          Our blog is coming soon. Stay tuned for tips, trends, and tutorials!
        </p>
      </div>
      <Footer />
    </main>
  );
}

