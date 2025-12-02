import { Button } from '../ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D Scene to avoid SSR issues
const Scene3D = dynamic(() => import('../3d/Scene3D'), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-vintage-paper dark:bg-vintage-dark animate-pulse" />
});

export default function Hero({ texts }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = texts || {
    title1: "Timeless Beauty for",
    title2: "Modern Artistry",
    description: "Discover our curated collection of premium nail supplies. From classic polishes to professional tools, we bring the vintage aesthetic to your salon.",
    button1: "Shop Collection"
  };

  return (
    <div className="relative bg-vintage-paper dark:bg-vintage-dark overflow-hidden transition-colors duration-300 min-h-[600px] lg:min-h-[700px]">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-vintage-paper/80 dark:bg-vintage-dark/80 backdrop-blur-sm sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-300">
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-vintage-dark dark:text-vintage-cream sm:text-5xl md:text-6xl transition-colors">
                <span className="block xl:inline font-serif">{t.title1}</span>{' '}
                <span className="block text-vintage-gold xl:inline font-serif">{t.title2}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-colors font-sans">
                {t.description}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow vintage-shadow hover:shadow-lg transition-shadow duration-300">
                  <Button onClick={() => router.push('/shop')} size="lg" className="w-full sm:w-auto bg-vintage-brown hover:bg-vintage-gold text-vintage-cream border-vintage-gold">{t.button1}</Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 h-56 w-full sm:h-72 md:h-96 lg:h-full relative">
        {mounted && (
            <Suspense fallback={<div className="w-full h-full bg-vintage-paper dark:bg-vintage-dark" />}>
                <Scene3D />
            </Suspense>
        )}
        {/* Vintage Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(74,59,50,0.15)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] z-20" />
        {/* Fallback/Background Image for depth if needed, currently 3D scene covers it but good to have just in case of load fail */}
        {!mounted && (
             <Image 
             src={mounted && resolvedTheme === 'dark' ? "/vintageHero.png" : "/hero.jpg"} 
             alt="Vintage Salon Ambience" 
             fill
             className="object-cover transition-opacity duration-500"
             priority
             unoptimized
           />
        )}
      </div>
    </div>
  );
}
