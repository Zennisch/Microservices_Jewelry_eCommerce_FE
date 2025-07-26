import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cartOrderService from 'container/cartOrderService';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// LocationSelector component for handling map clicks
const LocationSelector = ({ onLocationSelect, setAddress, setRoute, setRouteInfo }) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onLocationSelect({ lat, lng });

      try {
        // Get address from coordinates
        const data = await cartOrderService.getAddressFromCoordinates(lat, lng);
        if (data.address) {
          setAddress(data.address);
        }

        // Calculate route from store to selected location
        // Using fixed store coordinates
        const startLat = 10.808131355448648;
        const startLng = 106.70645211764977;
        const routeData = await cartOrderService.calculateRoute(
          startLat,
          startLng,
          lat,
          lng
        );

        if (routeData.message === "Tính khoảng cách thành công!") {
          setRoute([
            new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
            new L.LatLng(lat, lng),
          ]);
          
          setRouteInfo({
            distance: parseFloat(routeData.distance_km),
            duration: parseFloat(routeData.duration_minutes)
          });
        }
      } catch (error) {
        console.error("Error getting location data:", error);
      }
    },
  });
  return null;
};

const LocationPicker = ({ 
  visible, 
  onClose, 
  onSelectLocation, 
  initialLocation = { lat: 10.7769, lng: 106.7009 } 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [route, setRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setSelectedLocation({ lat, lng });
          
          try {
            // Get address from coordinates
            const data = await cartOrderService.getAddressFromCoordinates(lat, lng);
            if (data.address) {
              setAddress(data.address);
            }
            
            // Calculate route
            const startLat = 10.808131355448648;
            const startLng = 106.70645211764977;
            const routeData = await cartOrderService.calculateRoute(
              startLat,
              startLng,
              lat,
              lng
            );
            
            if (routeData.message === "Tính khoảng cách thành công!") {
              setRoute([
                new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
                new L.LatLng(lat, lng),
              ]);
              
              setRouteInfo({
                distance: parseFloat(routeData.distance_km),
                duration: parseFloat(routeData.duration_minutes)
              });
            }
          } catch (error) {
            console.error("Error getting current location data:", error);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.");
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
    }
  };
  
  const handleConfirmLocation = () => {
    onSelectLocation(selectedLocation, address, routeInfo);
    onClose();
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium text-gray-800">Chọn địa chỉ giao hàng</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <i className="fas fa-info-circle mr-2 text-amber-600"></i>
              Click vào bản đồ để chọn vị trí hoặc sử dụng vị trí hiện tại của bạn.
            </p>
            
            <div className="flex items-center mb-2">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={address} 
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Địa chỉ được chọn sẽ hiển thị ở đây"
                />
              </div>
              <button 
                onClick={handleCurrentLocation}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center"
              >
                <i className="fas fa-location-arrow mr-2"></i>
                Vị trí hiện tại
              </button>
            </div>
            
            {routeInfo && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Khoảng cách:</span> {routeInfo.distance.toFixed(1)} km
                <span className="font-medium ml-4">Thời gian:</span> {routeInfo.duration.toFixed(0)} phút
              </div>
            )}
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Store marker */}
              <Marker 
                position={[10.808131355448648, 106.70645211764977]}
                icon={new L.Icon({
                  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })}
              >
                <Popup>Cửa hàng Tinh Tú</Popup>
              </Marker>
              
              {/* Selected location marker */}
              <Marker 
                position={[selectedLocation.lat, selectedLocation.lng]} 
                icon={customIcon}
              >
                <Popup>Vị trí đã chọn</Popup>
              </Marker>
              
              {/* Route line */}
              {route.length > 0 && (
                <Polyline 
                  positions={route} 
                  color="#e67e22" 
                  weight={5} 
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}
              
              <LocationSelector 
                onLocationSelect={handleLocationSelect}
                setAddress={setAddress}
                setRoute={setRoute}
                setRouteInfo={setRouteInfo}
              />
            </MapContainer>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
          >
            Hủy
          </button>
          <button 
            onClick={handleConfirmLocation}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            disabled={!address}
          >
            Xác nhận địa chỉ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;