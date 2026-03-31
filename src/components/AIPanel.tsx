import React from 'react';
import { Sprout, Loader2, MapPin, Wind, Droplets, Sun, Mountain, CheckCircle2, Lightbulb, Gauge } from 'lucide-react';
import { FarmAdvice } from '../types';
import { motion } from 'motion/react';

interface AIPanelProps {
  data: FarmAdvice;
}

const AIPanel: React.FC<AIPanelProps> = ({ data }) => {
  return (
    <div className="glass-panel rounded-[40px] p-8 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-olive rounded-2xl flex items-center justify-center text-white shadow-lg shadow-olive/20 rotate-3">
            <Sprout size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-sage-900">Insights</h2>
            <p className="text-[10px] text-olive/60 uppercase tracking-[0.2em] font-sans font-bold">Kerala Agricultural AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
        {!data.lat ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center text-olive/20 mb-6 animate-bounce">
              <MapPin size={40} />
            </div>
            <h3 className="text-2xl font-bold text-sage-900/40 mb-2 italic">Ready to Analyze</h3>
            <p className="text-sage-900/30 font-sans text-sm max-w-[200px]">Select a plot on the map to generate localized farming strategies.</p>
          </div>
        ) : data.loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="relative">
              <Loader2 size={64} className="animate-spin text-olive opacity-20" />
              <Sprout size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-olive animate-pulse" />
            </div>
            <p className="mt-8 text-xl font-serif italic text-sage-900/60">Consulting agricultural models...</p>
          </div>
        ) : data.error ? (
          <div className="p-6 bg-red-50/50 backdrop-blur-sm text-red-700 rounded-3xl border border-red-100/50">
            <p className="font-bold text-lg mb-2">System Interruption</p>
            <p className="text-sm opacity-80 leading-relaxed">{data.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Retry Connection
            </button>
          </div>
        ) : data.advice && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-6">
            {/* Header Info Card */}
            <div className="p-5 bg-white/40 rounded-3xl border border-white/60 flex flex-col gap-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-olive shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-sans font-bold text-olive/40 uppercase tracking-widest">Selected Coordinates</p>
                    <p className="text-sm font-sans font-bold text-sage-900">
                      {data.lat.toFixed(4)}°N, {data.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-sans font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  LOCALIZED
                </div>
              </div>

              {data.weather && (
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/60">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-olive/60">
                      <Sun size={12} />
                      <span className="text-[8px] font-sans font-black uppercase tracking-tighter">Temp</span>
                    </div>
                    <p className="text-sm font-sans font-bold text-sage-900">{data.weather.temperature}°C</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-white/60">
                    <div className="flex items-center gap-2 text-olive/60">
                      <Droplets size={12} />
                      <span className="text-[8px] font-sans font-black uppercase tracking-tighter">Humidity</span>
                    </div>
                    <p className="text-sm font-sans font-bold text-sage-900">{data.weather.humidity}%</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-olive/60">
                      <Wind size={12} />
                      <span className="text-[8px] font-sans font-black uppercase tracking-tighter">Precip</span>
                    </div>
                    <p className="text-sm font-sans font-bold text-sage-900">{data.weather.precipitation}mm</p>
                  </div>
                </div>
              )}
            </div>

            {/* Suitability Score */}
            <div className="p-6 bg-olive/5 rounded-3xl border border-olive/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-olive shadow-sm">
                  <Gauge size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-widest">Suitability Score</p>
                  <p className="text-2xl font-bold text-sage-900">Highly Productive</p>
                </div>
              </div>
              <div className="text-4xl font-black text-olive/20">
                {data.advice.suitabilityScore}%
              </div>
            </div>

            {/* Soil & Terrain */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Mountain size={14} className="text-olive" />
                <h3 className="text-[10px] font-sans font-black text-olive uppercase tracking-widest">Soil & Terrain</h3>
              </div>
              <div className="p-6 bg-white/40 rounded-3xl border border-white/60 text-sage-900/80 font-serif leading-relaxed italic">
                {data.advice.soilAndTerrain}
              </div>
            </div>

            {/* Recommended Crops */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <CheckCircle2 size={14} className="text-olive" />
                <h3 className="text-[10px] font-sans font-black text-olive uppercase tracking-widest">Recommended Crops</h3>
              </div>
              <div className="grid gap-3">
                {data.advice.recommendedCrops.map((crop, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-5 bg-white/60 rounded-3xl border border-white/80 group hover:border-olive/20 transition-colors"
                  >
                    <h4 className="text-lg font-bold text-sage-900 mb-1 group-hover:text-olive transition-colors">{crop.name}</h4>
                    <p className="text-sm text-sage-900/60 leading-relaxed">{crop.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Expert Tip */}
            <div className="p-6 bg-sage-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Lightbulb size={20} className="text-olive" />
                </div>
                <div>
                  <p className="text-[10px] font-sans font-black text-white/40 uppercase tracking-widest mb-2">Expert Farming Tip</p>
                  <p className="text-sm font-serif italic leading-relaxed text-white/90">
                    "{data.advice.expertTip}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-sage-900/5 flex flex-col items-center gap-2 relative z-10">
        <div className="flex items-center gap-2 opacity-20 grayscale">
          <div className="w-1.5 h-1.5 rounded-full bg-sage-900" />
          <div className="w-1.5 h-1.5 rounded-full bg-sage-900" />
          <div className="w-1.5 h-1.5 rounded-full bg-sage-900" />
        </div>
        <p className="text-[9px] text-sage-900/30 uppercase tracking-[0.3em] font-sans font-black">
          Agri-Smart Kerala Engine v2.0
        </p>
      </div>
    </div>
  );
};

export default AIPanel;
