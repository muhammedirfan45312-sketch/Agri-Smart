import React from 'react';
import { Sprout, Loader2, MapPin, Wind, Droplets, Sun, Mountain, CheckCircle2, Lightbulb, Gauge, ArrowRight, X, Calendar, Droplet, FlaskConical, Bug, Timer, TrendingUp } from 'lucide-react';
import { FarmAdvice, DetailedCropInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AIPanelProps {
  data: FarmAdvice;
  onLearnMore: (cropName: string) => void;
  cropDetails: {
    loading: boolean;
    data: DetailedCropInfo | null;
    error: string | null;
  };
  onCloseDetails: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ data, onLearnMore, cropDetails, onCloseDetails }) => {
  return (
    <div className="glass-panel rounded-[32px] md:rounded-[40px] p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-olive rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-olive/20 rotate-3">
            <Sprout size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-sage-900">Insights</h2>
            <p className="text-[8px] md:text-[10px] text-olive/60 uppercase tracking-[0.2em] font-sans font-bold">Kerala Agricultural AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
        {!data.lat ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-sage-100 rounded-full flex items-center justify-center text-olive/20 mb-4 md:mb-6 animate-bounce">
              <MapPin size={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-sage-900/40 mb-2 italic">Ready to Analyze</h3>
            <p className="text-sage-900/30 font-sans text-xs md:text-sm max-w-[200px]">Select a plot on the map to generate localized farming strategies.</p>
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
            <div className="p-4 md:p-6 bg-olive/5 rounded-2xl md:rounded-3xl border border-olive/10 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-olive shadow-sm">
                  <Gauge size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-sans font-black text-olive/40 uppercase tracking-widest">Suitability Score</p>
                  <p className="text-xl md:text-2xl font-bold text-sage-900">Highly Productive</p>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-olive/20">
                {data.advice.suitabilityScore}%
              </div>
            </div>

            {/* Soil & Terrain */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Mountain size={12} className="text-olive md:w-3.5 md:h-3.5" />
                <h3 className="text-[8px] md:text-[10px] font-sans font-black text-olive uppercase tracking-widest">Soil & Terrain</h3>
              </div>
              <div className="p-4 md:p-6 bg-white/40 rounded-2xl md:rounded-3xl border border-white/60 text-sage-900/80 font-serif text-sm md:text-base leading-relaxed italic">
                {data.advice.soilAndTerrain}
              </div>
            </div>

            {/* Recommended Crops */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 px-2">
                <CheckCircle2 size={12} className="text-olive md:w-3.5 md:h-3.5" />
                <h3 className="text-[8px] md:text-[10px] font-sans font-black text-olive uppercase tracking-widest">Recommended Crops</h3>
              </div>
              <div className="grid gap-2 md:gap-3">
                {data.advice.recommendedCrops.map((crop, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-4 md:p-5 bg-white/60 rounded-2xl md:rounded-3xl border border-white/80 group hover:border-olive/20 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base md:text-lg font-bold text-sage-900 group-hover:text-olive transition-colors">{crop.name}</h4>
                      <button 
                        onClick={() => onLearnMore(crop.name)}
                        className="p-1.5 md:p-2 bg-olive/5 rounded-lg md:rounded-xl text-olive hover:bg-olive hover:text-white transition-all flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-sans font-black uppercase tracking-widest"
                      >
                        Details
                        <ArrowRight size={10} className="md:w-3 md:h-3" />
                      </button>
                    </div>
                    <p className="text-xs md:text-sm text-sage-900/60 leading-relaxed">{crop.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Expert Tip */}
            <div className="p-5 md:p-6 bg-sage-900 text-white rounded-2xl md:rounded-[32px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
              <div className="flex items-start gap-3 md:gap-4 relative z-10">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Lightbulb size={16} className="text-olive md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-sans font-black text-white/40 uppercase tracking-widest mb-1 md:mb-2">Expert Farming Tip</p>
                  <p className="text-xs md:text-sm font-serif italic leading-relaxed text-white/90">
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

      {/* Crop Details Overlay */}
      <AnimatePresence>
        {(cropDetails.loading || cropDetails.data || cropDetails.error) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/80 backdrop-blur-xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-olive rounded-lg md:rounded-xl flex items-center justify-center text-white">
                  <Sprout size={16} className="md:w-5 md:h-5" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-sage-900">Crop Intelligence</h3>
              </div>
              <button 
                onClick={onCloseDetails}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-900 hover:bg-sage-200 transition-colors"
              >
                <X size={16} className="md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {cropDetails.loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Loader2 size={48} className="animate-spin text-olive opacity-20 mb-4" />
                  <p className="text-lg font-serif italic text-sage-900/60">Fetching deep insights...</p>
                </div>
              ) : cropDetails.error ? (
                <div className="p-6 bg-red-50 text-red-700 rounded-3xl border border-red-100">
                  <p className="font-bold mb-2">Error</p>
                  <p className="text-sm">{cropDetails.error}</p>
                </div>
              ) : cropDetails.data && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 md:p-6 bg-olive/5 rounded-2xl md:rounded-3xl border border-olive/10">
                    <h4 className="text-2xl md:text-3xl font-bold text-sage-900 mb-1 md:mb-2">{cropDetails.data.name}</h4>
                    <div className="flex items-center gap-2 text-olive">
                      <TrendingUp size={14} className="md:w-4 md:h-4" />
                      <span className="text-[8px] md:text-[10px] font-sans font-black uppercase tracking-widest">Market Demand: {cropDetails.data.marketDemand}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <DetailCard icon={<Calendar size={18} />} title="Planting Season" value={cropDetails.data.plantingSeason} />
                    <DetailCard icon={<Droplet size={18} />} title="Water Requirements" value={cropDetails.data.waterRequirements} />
                    <DetailCard icon={<FlaskConical size={18} />} title="Fertilizer Needs" value={cropDetails.data.fertilizerNeeds} />
                    <DetailCard icon={<Bug size={18} />} title="Common Pests" value={cropDetails.data.commonPests} />
                    <DetailCard icon={<Timer size={18} />} title="Harvest Time" value={cropDetails.data.harvestTime} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailCard: React.FC<{ icon: React.ReactNode, title: string, value: string }> = ({ icon, title, value }) => (
  <div className="p-5 bg-white rounded-2xl border border-sage-100 flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-olive shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-sm text-sage-900 font-medium leading-relaxed">{value}</p>
    </div>
  </div>
);

export default AIPanel;
