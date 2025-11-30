import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-vintage-brown text-vintage-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-vintage-gold">Vintage Nails</h3>
            <p className="text-vintage-cream/80 text-sm leading-relaxed">
              Curating the finest nail supplies for professionals who appreciate the timeless elegance of vintage aesthetics.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">Explore</h4>
            <ul className="space-y-2 text-sm text-vintage-cream/80">
              <li><a href="/shop" className="hover:text-white transition-colors">Shop All</a></li>
              <li><a href="/collections/new" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="/collections/best-sellers" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Journal</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">Support</h4>
            <ul className="space-y-2 text-sm text-vintage-cream/80">
              <li><a href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">Stay Connected</h4>
            <p className="text-vintage-cream/80 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-vintage-cream/10 border border-vintage-cream/20 px-4 py-2 text-sm text-white placeholder-vintage-cream/50 focus:outline-none focus:border-vintage-gold w-full rounded-sm"
              />
              <button className="bg-vintage-gold text-vintage-brown px-4 py-2 text-sm font-medium hover:bg-vintage-gold-hover transition-colors rounded-sm">
                Join
              </button>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold"><Instagram size={20} /></a>
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold"><Facebook size={20} /></a>
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold"><Twitter size={20} /></a>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-vintage-cream/10 text-center text-sm text-vintage-cream/60">
          <p>&copy; {new Date().getFullYear()} Vintage Nails Supply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

