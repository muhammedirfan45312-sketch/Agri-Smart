import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Layers, Map as MapIcon, Satellite, Mountain, Droplets, Shovel } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 10.8505,
  lng: 76.2711
};

const SOIL_STYLE = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#3d2b1f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#5c4033" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "simplified" }, { color: "#8b4513" }] }
];

const RAINFALL_STYLE = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#001f3f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0074d9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#003366" }] },
  { featureType: "road", stylers: [{ color: "#001a33" }] }
];

const DEFAULT_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#5A5A40" }] },
  { featureType: "landscape", elementType: "all", stylers: [{ color: "#f1f3f1" }] },
  { featureType: "water", elementType: "all", stylers: [{ color: "#cbd5cb" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e2e8e2" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#2d332d" }] }
];

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number, lng: number } | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

const Map: React.FC<MapProps> = ({ onLocationSelect, selectedLocation, radius, onRadiusChange }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyD84Egptlb3r4xYDxHvxgJ7sX3Smb7LV74"
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mousePos, setMousePos] = useState({ clientX: 0, clientY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'soil' | 'rainfall'>('none');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (map) {
      if (activeOverlay === 'soil') {
        map.setOptions({ styles: SOIL_STYLE });
      } else if (activeOverlay === 'rainfall') {
        map.setOptions({ styles: RAINFALL_STYLE });
      } else {
        map.setOptions({ styles: DEFAULT_STYLE });
      }
    }
  }, [map, activeOverlay]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onLocationSelect(e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      clientX: e.clientX,
      clientY: e.clientY
    });
  };

  return isLoaded ? (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-olive/10 border-[12px] border-white relative group cursor-crosshair"
    >
      <div className="absolute inset-0 border border-olive/5 rounded-[28px] pointer-events-none z-10" />
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || center}
        zoom={7}
        mapTypeId={mapType}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          styles: DEFAULT_STYLE
        }}
      >
        {selectedLocation && (
          <>
            <Marker 
              position={selectedLocation}
              animation={1} // google.maps.Animation.DROP is 1
            />
            <Circle
              center={selectedLocation}
              radius={radius}
              options={{
                fillColor: "#5A5A40",
                fillOpacity: 0.2,
                strokeColor: "#5A5A40",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1
              }}
            />
          </>
        )}
      </GoogleMap>

      {/* Radius Control UI */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col gap-3 md:gap-4"
          >
            <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-olive/10 shadow-xl w-56 md:w-64">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <Settings2 size={14} className="text-olive" />
                <h3 className="text-[8px] md:text-[10px] font-sans font-black text-olive uppercase tracking-widest">
                  Farmable Area
                </h3>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[8px] md:text-[10px] font-sans font-bold text-olive/40 uppercase tracking-wider">Radius</span>
                  <span className="text-base md:text-lg font-serif font-bold text-sage-900">{radius}m</span>
                </div>
                
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={radius}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full h-1 bg-olive/10 rounded-full appearance-none cursor-pointer accent-olive"
                />
                
                <div className="flex justify-between text-[7px] md:text-[8px] font-sans font-black text-olive/20 uppercase tracking-tighter">
                  <span>100m</span>
                  <span>5km</span>
                </div>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="relative">
              <button 
                onClick={() => setShowLayers(!showLayers)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all shadow-lg ${showLayers ? 'bg-olive text-white' : 'bg-white/90 text-olive hover:bg-white'}`}
              >
                <Layers size={18} />
              </button>

              <AnimatePresence>
                {showLayers && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    className="absolute left-12 md:left-16 top-0 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-[24px] md:rounded-[32px] border border-olive/10 shadow-xl w-56 md:w-64 z-30"
                  >
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <h4 className="text-[8px] md:text-[9px] font-sans font-black text-olive/40 uppercase tracking-widest mb-2 md:mb-3">Map Type</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <LayerButton 
                            active={mapType === 'roadmap' && activeOverlay === 'none'} 
                            onClick={() => {
                              setMapType('roadmap');
                              setActiveOverlay('none');
                            }}
                            icon={<MapIcon size={12} />}
                            label="Street"
                          />
                          <LayerButton 
                            active={mapType === 'satellite'} 
                            onClick={() => {
                              setMapType('satellite');
                              setActiveOverlay('none');
                            }}
                            icon={<Satellite size={12} />}
                            label="Satellite"
                          />
                          <LayerButton 
                            active={mapType === 'terrain'} 
                            onClick={() => {
                              setMapType('terrain');
                              setActiveOverlay('none');
                            }}
                            icon={<Mountain size={12} />}
                            label="Terrain"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[8px] md:text-[9px] font-sans font-black text-olive/40 uppercase tracking-widest mb-2 md:mb-3">Data Overlays</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <LayerButton 
                            active={activeOverlay === 'soil'} 
                            onClick={() => {
                              setMapType('roadmap');
                              setActiveOverlay(activeOverlay === 'soil' ? 'none' : 'soil');
                            }}
                            icon={<Shovel size={12} />}
                            label="Soil Map"
                          />
                          <LayerButton 
                            active={activeOverlay === 'rainfall'} 
                            onClick={() => {
                              setMapType('roadmap');
                              setActiveOverlay(activeOverlay === 'rainfall' ? 'none' : 'rainfall');
                            }}
                            icon={<Droplets size={12} />}
                            label="Rainfall"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulsating Indicator Tooltip */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
              position: 'fixed', 
              left: mousePos.clientX, 
              top: mousePos.clientY, 
              pointerEvents: 'none',
              zIndex: 9999,
              transform: 'translate(-50%, -50%)' 
            }}
            className="flex items-center justify-center"
          >
            {/* The Dot (Centered on cursor) */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute w-6 h-6 bg-olive rounded-full"
              />
              <div className="w-2 h-2 bg-olive rounded-full border border-white shadow-lg relative z-10" />
            </div>
            
            {/* The Text (Floating just above the dot) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-full mb-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-olive/10 shadow-2xl whitespace-nowrap"
            >
              <p className="text-[8px] font-sans font-black text-olive uppercase tracking-[0.05em]">
                Click for advice
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Overlay Controls Hint (Static) - Moved to Bottom Right to avoid search bar */}
      <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-olive/10 shadow-sm opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-sans font-black text-olive/60 uppercase tracking-widest">
          Kerala Plot Analysis
        </p>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-sage-50 rounded-[40px] border border-olive/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-olive/10 border-t-olive rounded-full animate-spin" />
        <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-[0.3em]">Initializing Map Engine</p>
      </div>
    </div>
  );
};

const LayerButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${active ? 'bg-olive text-white border-olive' : 'bg-white text-olive/60 border-olive/5 hover:border-olive/20'}`}
  >
    {icon}
    <span className="text-[7px] font-sans font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default React.memo(Map);
