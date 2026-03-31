import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Map from './components/Map';
import AIPanel from './components/AIPanel';
import { FarmAdvice } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Globe, Info } from 'lucide-react';

export default function App() {
  const [advice, setAdvice] = useState<FarmAdvice>({
    lat: 0,
    lng: 0,
    advice: '',
    loading: false,
    error: null
  });

  const getAdvice = async (lat: number, lng: number) => {
    setAdvice(prev => ({ ...prev, lat, lng, loading: true, error: null }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Act as an expert Kerala agriculturalist. I am at coordinates Latitude: ${lat}, Longitude: ${lng} in Kerala. 
      Provide a detailed analysis in Markdown format:
      1. **Soil & Terrain**: Describe the likely soil type and terrain.
      2. **Recommended Crops**: Suggest 2-3 best cash crops or food crops for this specific location.
      3. **Expert Farming Tip**: Provide one key tip for success in this area.
      Keep the tone professional yet approachable. Use bullet points for readability.`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
      });

      setAdvice(prev => ({
        ...prev,
        advice: response.text || 'No advice received.',
        loading: false
      }));
    } catch (err) {
      console.error('Gemini Error:', err);
      setAdvice(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to connect to the AI service. Please try again later.'
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-olive/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-olive/5 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 px-6 pt-12 md:px-12 md:pt-16 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center text-white">
                <Leaf size={20} />
              </div>
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-olive/60">
                Precision Agriculture
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] text-sage-900">
              Agri<span className="text-olive/20 italic font-light">Smart</span><br />
              <span className="text-olive">Kerala</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-md"
          >
            <p className="text-xl text-sage-900/60 font-serif leading-relaxed italic mb-8">
              "Empowering the hands that feed us with the intelligence of tomorrow."
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-olive/5 shadow-sm">
                <Globe size={14} className="text-olive" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-olive/60">Geo-Spatial</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-olive/5 shadow-sm">
                <Info size={14} className="text-olive" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-olive/60">Real-Time</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-12 md:px-12 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full min-h-[700px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 xl:col-span-8 h-[600px] lg:h-full"
          >
            <Map 
              onLocationSelect={getAdvice} 
              selectedLocation={advice.lat ? { lat: advice.lat, lng: advice.lng } : null} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <AIPanel data={advice} />
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
