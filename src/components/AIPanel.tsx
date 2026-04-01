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

const DetailCard = React.memo(({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="p-5 bg-white rounded-2xl border border-sage-100 flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-olive shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-sm text-sage-900 font-medium leading-relaxed">{value}</p>
    </div>
  </div>
));

const RecommendedCropCard = React.memo(({ crop, onLearnMore, idx }: { crop: any, onLearnMore: (name: string) => void, idx: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * idx }}
    className="p-4 bg-white/60 rounded-2xl border border-white/80 group hover:border-olive/20 transition-colors"
  >
    <div className="flex justify-between items-center mb-1">
      <h4 className="text-sm font-bold text-sage-900 group-hover:text-olive transition-colors">{crop.name}</h4>
      <button 
        onClick={() => onLearnMore(crop.name)}
        className="p-1.5 bg-olive/5 rounded-lg text-olive hover:bg-olive hover:text-white transition-all flex items-center gap-1.5 text-[8px] font-sans font-black uppercase tracking-widest"
      >
        Details
        <ArrowRight size={10} />
      </button>
    </div>
    <p className="text-[11px] text-sage-900/50 leading-relaxed">{crop.reason}</p>
  </motion.div>
));

const AIPanel: React.FC<AIPanelProps> = ({ data, onLearnMore, cropDetails, onCloseDetails }) => {
  return (
    <div className="glass-panel rounded-[32px] md:rounded-[40px] p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center text-olive shadow-sm">
            <Sprout size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-sage-900">Insights</h2>
            <p className="text-[8px] text-olive/40 uppercase tracking-[0.2em] font-sans font-bold">Kerala Agricultural AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
        {!data.lat ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 bg-olive/5 rounded-full flex items-center justify-center text-olive/20 mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-sage-900/40 mb-1 italic">Ready to Analyze</h3>
            <p className="text-sage-900/30 font-sans text-[10px] max-w-[180px] uppercase tracking-wider">Select a plot on the map to begin</p>
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
            <div className="p-4 bg-white/40 rounded-2xl border border-white/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-olive shadow-sm">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-bold text-olive/30 uppercase tracking-widest">Plot Location</p>
                    <p className="text-xs font-sans font-bold text-sage-900">
                      {data.lat.toFixed(4)}°N, {data.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
                <div className="text-[8px] font-sans font-black text-olive/40 border border-olive/10 px-2 py-0.5 rounded-full">
                  KERALA
                </div>
              </div>

              {data.weather && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/60">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-sans font-black uppercase tracking-tighter text-olive/30">Temp</span>
                    <p className="text-xs font-sans font-bold text-sage-900">{data.weather.temperature}°C</p>
                  </div>
                  <div className="flex flex-col items-center border-x border-white/60">
                    <span className="text-[8px] font-sans font-black uppercase tracking-tighter text-olive/30">Humidity</span>
                    <p className="text-xs font-sans font-bold text-sage-900">{data.weather.humidity}%</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-sans font-black uppercase tracking-tighter text-olive/30">Rain</span>
                    <p className="text-xs font-sans font-bold text-sage-900">{data.weather.precipitation}mm</p>
                  </div>
                </div>
              )}
            </div>

            {/* Suitability Score - Simplified */}
            <div className="p-4 bg-olive/5 rounded-2xl border border-olive/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-sans font-black text-olive/30 uppercase tracking-widest mb-0.5">Agricultural Suitability</p>
                <p className="text-lg font-bold text-sage-900">Highly Productive</p>
              </div>
              <div className="text-2xl font-black text-olive/20">
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
                  <RecommendedCropCard 
                    key={idx}
                    crop={crop}
                    onLearnMore={onLearnMore}
                    idx={idx}
                  />
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

export default React.memo(AIPanel);
