import { useState, useCallback } from 'react';
import Map from './components/Map';
import AIPanel from './components/AIPanel';
import { useAgriculturalAI } from './hooks/useAgriculturalAI';
import { motion } from 'motion/react';
import { Leaf, Globe, Info } from 'lucide-react';

export default function App() {
  const [radius, setRadius] = useState(500);
  const { advice, cropDetails, getAdvice, getCropDetails, resetAdvice, resetCropDetails } = useAgriculturalAI();

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    getAdvice(lat, lng, radius);
  }, [getAdvice, radius]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-olive/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-olive/5 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 px-4 pt-6 md:px-12 md:pt-12 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-olive/10 rounded-full flex items-center justify-center text-olive">
                <Leaf size={10} className="md:w-3 md:h-3" />
              </div>
              <span className="text-[7px] md:text-[8px] font-sans font-black uppercase tracking-[0.3em] text-olive/40">
                Precision Agriculture
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-none text-sage-900">
              AgriSmart <span className="text-olive/30 font-light italic">Kerala</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="hidden md:block max-w-xs"
          >
            <p className="text-sm text-sage-900/40 font-serif italic leading-relaxed">
              Empowering Kerala's farmers with localized, AI-driven soil and crop intelligence.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 pb-8 md:px-12 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 h-full min-h-[500px] md:min-h-[700px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 xl:col-span-8 h-[400px] sm:h-[500px] lg:h-full"
          >
            <Map 
              onLocationSelect={handleLocationSelect} 
              onDeselect={resetAdvice}
              selectedLocation={advice.lat ? { lat: advice.lat, lng: advice.lng } : null} 
              radius={radius}
              onRadiusChange={setRadius}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <AIPanel 
              data={advice} 
              onLearnMore={getCropDetails}
              cropDetails={cropDetails}
              onCloseDetails={resetCropDetails}
            />
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-12 md:px-12 max-w-[1600px] mx-auto w-full border-t border-sage-900/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-sage-900/20">
              © 2026 Agri-Smart Kerala Initiative
            </p>
            <div className="h-4 w-[1px] bg-sage-900/10" />
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-sage-900/20">
              Sustainable Future
            </p>
          </div>
          
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-sage-900/20 hover:text-olive transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
