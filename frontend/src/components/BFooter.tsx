import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BFooter: React.FC = () => {
  // Tọa độ của địa chỉ: 69/68 Đ. Đặng Thuỳ Trâm, Phường 13, Bình Thạnh, TP.HCM
  const officeLocation = {
    latitude: 10.8021,  // Tọa độ chính xác của địa chỉ
    longitude: 106.7136
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const handleContactClick = () => {
    // Bạn có thể thêm logic chuyển hướng hoặc mở modal liên hệ ở đây
    console.log('Contact button clicked');
    // Ví dụ: window.location.href = '/contact';
  };

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Clean up existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      try {
        // Initialize new map
        const map = L.map(mapRef.current).setView([officeLocation.latitude, officeLocation.longitude], 16);
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
        
        L.marker([officeLocation.latitude, officeLocation.longitude], { icon: customIcon })
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
  }, [officeLocation.latitude, officeLocation.longitude]);

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung bên trái */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Kết nối trực tiếp với chúng tôi
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Trụ sở: 69/68 Đ. Đặng Thuỳ Trâm, Phường 13, Bình Thạnh, Thành phố Hồ Chí Minh 70000, Việt Nam
              </p>
            </div>
            
            {/* Thông tin bổ sung */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500 p-2 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-600">Dễ dàng tìm thấy trong khu vực trung tâm</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500 p-2 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-600">Mở cửa 24/7 để phục vụ bạn</span>
              </div>
            </div>

            {/* Button liên hệ */}
            <div className="pt-4">
              <button
                onClick={handleContactClick}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold text-lg rounded-full hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ ngay
              </button>
            </div>
          </div>

          {/* Map bên phải */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Vị trí trụ sở chính
              </h3>
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                  <div 
                    ref={mapRef}
                    className="h-80 w-full rounded-xl"
                    style={{ minHeight: '320px' }}
                  />
                </div>
                
                {/* Overlay thông tin */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-medium text-gray-900">Tripook Vietnam</p>
                  <p className="text-xs text-gray-600">Phường 13, Bình Thạnh, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BFooter;