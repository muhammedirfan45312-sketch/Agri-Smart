import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sprout, Loader2, MapPin, Wind, Droplets, Sun } from 'lucide-react';
import { FarmAdvice } from '../types';

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
        
        {data.lat !== 0 && !data.loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-olive/40"><Sun size={14} /></div>
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-olive/40"><Droplets size={14} /></div>
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-olive/40"><Wind size={14} /></div>
          </div>
        )}
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
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-8 p-5 bg-white/40 rounded-3xl border border-white/60 flex items-center justify-between group">
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
            
            <div className="markdown-body">
              <ReactMarkdown>{data.advice}</ReactMarkdown>
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
