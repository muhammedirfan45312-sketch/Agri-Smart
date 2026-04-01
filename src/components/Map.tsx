import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, OverlayView } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Layers, Map as MapIcon, Satellite, Mountain, Droplets, Shovel } from 'lucide-react';
import { SOIL_STYLE, RAINFALL_STYLE, DEFAULT_STYLE, KERALA_CENTER } from '../constants';

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number, lng: number } | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

const Map: React.FC<MapProps> = ({ onLocationSelect, selectedLocation, radius, onRadiusChange }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD84Egptlb3r4xYDxHvxgJ7sX3Smb7LV74"
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

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    styles: DEFAULT_STYLE
  }), []);

  const circleOptions = useMemo(() => ({
    fillColor: "#5A5A40",
    fillOpacity: 0.2,
    strokeColor: "#5A5A40",
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    zIndex: 1
  }), []);

  return isLoaded ? (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-olive/10 border-[12px] border-white relative group cursor-crosshair"
    >
      <motion.div 
        animate={isHovering ? {
          boxShadow: [
            'inset 0 0 0 1px rgba(90, 90, 64, 0.1)',
            'inset 0 0 0 4px rgba(90, 90, 64, 0.15)',
            'inset 0 0 0 1px rgba(90, 90, 64, 0.1)'
          ]
        } : {
          boxShadow: 'inset 0 0 0 1px rgba(90, 90, 64, 0.05)'
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[28px] pointer-events-none z-10" 
      />
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || KERALA_CENTER}
        zoom={7}
        mapTypeId={mapType}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={mapOptions}
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
              options={circleOptions}
            />
            <OverlayView
              position={selectedLocation}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <motion.div
                animate={{ 
                  opacity: [0, 0.5, 0], 
                  scale: [0.8, 1.5],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeOut" 
                }}
                style={{
                  width: 60,
                  height: 60,
                  marginLeft: -30,
                  marginTop: -30,
                  borderRadius: '50%',
                  border: '2px solid #5A5A40',
                  pointerEvents: 'none'
                }}
              />
            </OverlayView>
          </>
        )}
      </GoogleMap>

      {/* Consolidated Map Controls */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:bottom-6 z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-[24px] border border-olive/10 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-8">
              {/* Radius Control */}
              <div className="w-full md:w-48">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-sans font-black text-olive/40 uppercase tracking-widest">Radius</span>
                  <span className="text-sm font-serif font-bold text-sage-900">{radius}m</span>
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
              </div>

              <div className="hidden md:block w-px h-8 bg-olive/10" />

              {/* Layer Toggle */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <LayerButton 
                  active={mapType === 'roadmap' && activeOverlay === 'none'} 
                  onClick={() => { setMapType('roadmap'); setActiveOverlay('none'); }}
                  icon={<MapIcon size={14} />}
                  label="Street"
                />
                <LayerButton 
                  active={mapType === 'satellite'} 
                  onClick={() => { setMapType('satellite'); setActiveOverlay('none'); }}
                  icon={<Satellite size={14} />}
                  label="Satellite"
                />
                <LayerButton 
                  active={mapType === 'terrain'} 
                  onClick={() => { setMapType('terrain'); setActiveOverlay('none'); }}
                  icon={<Mountain size={14} />}
                  label="Terrain"
                />
                <div className="w-px h-6 bg-olive/10 mx-1" />
                <LayerButton 
                  active={activeOverlay === 'soil'} 
                  onClick={() => { setMapType('roadmap'); setActiveOverlay(activeOverlay === 'soil' ? 'none' : 'soil'); }}
                  icon={<Shovel size={14} />}
                  label="Soil"
                />
                <LayerButton 
                  active={activeOverlay === 'rainfall'} 
                  onClick={() => { setMapType('roadmap'); setActiveOverlay(activeOverlay === 'rainfall' ? 'none' : 'rainfall'); }}
                  icon={<Droplets size={14} />}
                  label="Rain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Smooth Cursor Tooltip */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ 
              position: 'fixed', 
              left: mousePos.clientX + 20, 
              top: mousePos.clientY + 20, 
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            <div className="bg-sage-900/90 text-white text-[8px] font-sans font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md shadow-xl border border-white/10">
              Analyze Plot
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Overlay Controls Hint (Static) */}
      <div className="absolute top-6 right-6 z-20 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
        <p className="text-[8px] font-sans font-black text-olive/40 uppercase tracking-widest">
          Kerala Plot Analysis
        </p>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-sage-50 rounded-[40px] border border-olive/5">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-olive rounded-full shadow-sm shadow-olive/20"
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-[0.3em]">
            Initializing Map Engine
          </p>
          <div className="w-24 h-[1px] bg-olive/10 overflow-hidden rounded-full">
            <motion.div 
              animate={{ x: [-100, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-olive/30"
            />
          </div>
        </div>
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
