import React, { useState } from 'react';
import MapComponent from './MapComponent';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  display_name: string;
}

const AddressToMap: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLocation, setMapLocation] = useState({
    latitude: 10.8021,
    longitude: 106.7136,
    zoom: 16,
    name: 'Trụ sở Tripook'
  });
  const [error, setError] = useState('');

  // Sử dụng Nominatim API (miễn phí) để geocoding
  const searchAddress = async () => {
    if (!address.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Thêm "Vietnam" vào cuối để tăng độ chính xác
      const searchQuery = address.includes('Vietnam') ? address : `${address}, Vietnam`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      
      const results = await response.json();

      if (results.length > 0) {
        const result = results[0];
        setMapLocation({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          zoom: 16,
          name: result.display_name
        });
      } else {
        setError('Không tìm thấy địa chỉ. Vui lòng thử lại với địa chỉ khác.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm địa chỉ.');
      console.error('Geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  // Một số địa chỉ mẫu phổ biến tại Việt Nam
  const sampleAddresses = [
    '69/68 Đặng Thuỳ Trâm, Phường 13, Bình Thạnh, TP.HCM',
    'Chợ Bến Thành, Quận 1, TP.HCM',
    'Hồ Gươm, Hà Nội',
    'Cầu Rồng, Đà Nẵng',
    'Vinpearl Phú Quốc',
    'Đường Nguyễn Huệ, Quận 1, TP.HCM'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        🏠 Tìm vị trí bằng địa chỉ
      </h3>

      {/* Address Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập địa chỉ cần tìm:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ví dụ: Chợ Bến Thành, Quận 1, TP.HCM"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={searchAddress}
              disabled={loading || !address.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium min-w-[100px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                '🔍 Tìm'
              )}
            </button>
          </div>
        </div>

        {/* Sample Addresses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hoặc chọn địa chỉ mẫu:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleAddresses.map((sampleAddress, index) => (
              <button
                key={index}
                onClick={() => setAddress(sampleAddress)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
              >
                📍 {sampleAddress}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">❌ {error}</p>
          </div>
        )}

        {/* Current Location Info */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-green-600 text-lg">🗺️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">Vị trí hiện tại</h4>
              <p className="text-sm text-green-700 mb-2">{mapLocation.name}</p>
              <div className="text-xs text-green-600 space-y-1">
                <p><strong>Vĩ độ:</strong> {mapLocation.latitude.toFixed(6)}</p>
                <p><strong>Kinh độ:</strong> {mapLocation.longitude.toFixed(6)}</p>
                <p><strong>Zoom:</strong> {mapLocation.zoom}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="relative">
        <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
          <MapComponent
            latitude={mapLocation.latitude}
            longitude={mapLocation.longitude}
            zoom={mapLocation.zoom}
            className="w-full h-96"
          />
        </div>
        
        {/* Map Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">📍 Kết quả tìm kiếm</p>
          <p className="text-xs text-gray-600 line-clamp-2">{mapLocation.name}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Hướng dẫn:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Nhập địa chỉ càng chi tiết càng tốt (đường, phường/xã, quận/huyện, tỉnh/thành)</li>
          <li>• Bạn có thể nhập tên landmarks nổi tiếng (Chợ Bến Thành, Hồ Gươm...)</li>
          <li>• Hệ thống sẽ tự động thêm "Vietnam" để tăng độ chính xác</li>
          <li>• Sử dụng tiếng Việt có dấu để kết quả chính xác hơn</li>
        </ul>
      </div>
    </div>
  );
};

export default AddressToMap;