import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15, 
  className = "" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Clean up existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      try {
        // Clear the container first
        mapRef.current.innerHTML = '';
        
        // Initialize new map
        const map = L.map(mapRef.current).setView([latitude, longitude], zoom);
        mapInstanceRef.current = map;
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker for the location
        const customIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center;">
              <strong>🏢 Trụ sở Tripook</strong><br/>
              <small>69/68 Đ. Đặng Thuỳ Trâm<br/>
              Phường 13, Bình Thạnh<br/>
              TP. Hồ Chí Minh</small>
            </div>
          `)
          .openPopup();
      } catch (error) {
        console.warn('Map initialization error:', error);
      }
    };

    // Initialize map directly since Leaflet is imported
    initializeMap();
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map overlay with company info */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Tripook</h3>
            <p className="text-xs text-gray-600">Trụ sở chính</p>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          📍 69/68 Đặng Thuỳ Trâm<br/>
          Phường 13, Bình Thạnh<br/>
          📞 1900 1234
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
        <span className="text-blue-900 text-xl">🗺️</span>
      </div>
      
      <div className="absolute -bottom-2 -left-2 bg-blue-500 rounded-full p-3 shadow-lg animate-pulse">
        <span className="text-white text-xl">📍</span>
      </div>
    </div>
  );
};

export default MapComponent;