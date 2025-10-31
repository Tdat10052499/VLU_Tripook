import React, { useEffect, useRef } from 'react';

interface SimpleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15, 
  className = "" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      // Load CSS first
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/leaflet/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Check if Leaflet is already loaded
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = '/leaflet/dist/leaflet.js';
        script.async = true;
        
        return new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
    };

    const initializeMap = () => {
      if (!isMounted || !mapRef.current) return;
      
      const L = (window as any).L;
      if (!L) return;

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        // Clear container
        mapRef.current.innerHTML = '';

        // Create map
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create custom icon
        const customIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        // Add marker
        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <strong style="color: #1e40af;">🏢 Trụ sở Tripook</strong><br/>
              <small style="color: #6b7280;">
                69/68 Đ. Đặng Thuỳ Trâm<br/>
                Phường 13, Bình Thạnh<br/>
                TP. Hồ Chí Minh<br/>
                📞 1900 1234
              </small>
            </div>
          `)
          .openPopup();

      } catch (error) {
        console.warn('Map initialization error:', error);
      }
    };

    loadLeaflet().then(() => {
      if (isMounted) {
        // Small delay to ensure DOM is ready
        setTimeout(initializeMap, 100);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.warn('Map cleanup error:', error);
        }
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30"
        style={{ minHeight: '400px', backgroundColor: '#f3f4f6' }}
      />
      
      {/* Map overlay with company info */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs z-[1000]">
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
      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce z-[1000]">
        <span className="text-blue-900 text-xl">🗺️</span>
      </div>
      
      <div className="absolute -bottom-2 -left-2 bg-blue-500 rounded-full p-3 shadow-lg animate-pulse z-[1000]">
        <span className="text-white text-xl">📍</span>
      </div>
    </div>
  );
};

export default SimpleMap;