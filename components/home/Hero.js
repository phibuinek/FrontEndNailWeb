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
    button1: "Shop Collection",
    button2: "Learn More"
  };

  return (
    <div className="relative bg-vintage-paper dark:bg-vintage-dark overflow-hidden transition-colors duration-300 min-h-[600px] lg:min-h-[700px]">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-vintage-paper/80 dark:bg-vintage-dark/80 backdrop-blur-sm sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-300">
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className={`sm:text-center lg:text-left transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl tracking-tight font-extrabold text-vintage-dark dark:text-vintage-cream sm:text-6xl md:text-7xl transition-colors mb-6">
                <span className="block xl:inline font-serif leading-tight">{t.title1}</span>{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vintage-gold to-[#C5A059] xl:inline font-serif leading-tight drop-shadow-sm">{t.title2}</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-colors font-sans font-light leading-relaxed">
                {t.description}
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <Button 
                    onClick={() => router.push('/shop')} 
                    size="xl" 
                    className="w-full sm:w-auto px-8 py-4 bg-vintage-brown hover:bg-vintage-gold text-vintage-cream border-none text-lg font-medium tracking-wide"
                  >
                    {t.button1}
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                   <Button 
                        onClick={() => router.push('/about')} 
                        variant="outline"
                        size="xl"
                        className="w-full sm:w-auto px-8 py-4 border-vintage-gold text-vintage-gold hover:bg-vintage-gold/10 text-lg font-medium tracking-wide"
                   >
                       {t.button2}
                   </Button>
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
