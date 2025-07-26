// components/LocationPicker.tsx
import { useMapEvents } from "react-leaflet";
import L from "leaflet";
import { apiService } from "../services/api";

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  setRoute: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
  setRouteInfo: React.Dispatch<React.SetStateAction<any>>;
}

const LocationPicker = ({ onLocationSelect, setUserInfo, setRoute, setRouteInfo }: Props) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onLocationSelect(lat, lng);

      try {
        // Using apiService instead of direct fetch
        const data = await apiService.getAddressFromCoordinates(lat, lng);
        if (data.address) {
          setUserInfo((prev: any) => ({ ...prev, address: data.address }));
        }

        const startLat = 10.808131355448648;
        const startLng = 106.70645211764977;

        // Using apiService instead of direct fetch
        const routeData = await apiService.getRouteDistance(startLat, startLng, lat, lng);

        if (routeData.message === "Tính khoảng cách thành công!") {
          setRoute([
            new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
            new L.LatLng(lat, lng),
          ]);
          setRouteInfo({
            distance: parseFloat(routeData.distance_km),
            duration: parseFloat(routeData.duration_minutes),
          });
        }
      } catch (error) {
        console.error("Lỗi khi chọn vị trí:", error);
      }
    },
  });

  return null;
};
interface GetCurrentLocationParams {
    setMapLocation: (location: { lat: number; lng: number }) => void;
    setUserInfo: (cb: (prev: any) => any) => void;
    setRoute: (route: L.LatLng[]) => void;
    setRouteInfo: (info: { distance: number; duration: number }) => void;
  }
  
  export const getCurrentLocation = ({
    setMapLocation,
    setUserInfo,
    setRoute,
    setRouteInfo,
  }: GetCurrentLocationParams) => {
    if (navigator.geolocation) {
      // Request high accuracy in geolocation options
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Get precise coordinates and fix to 6 decimal places for consistency
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          
          console.log("Raw geolocation coordinates:", position.coords.latitude, position.coords.longitude);
          console.log("Processed coordinates:", lat, lng);
          console.log("Accuracy:", position.coords.accuracy, "meters");
          
          setMapLocation({ lat, lng });
  
          try {
            // Using apiService with precise coordinates
            const data = await apiService.getAddressFromCoordinates(lat, lng);
            console.log("Address data received:", data);
            
            if (data.address) {
              setUserInfo((prev) => ({ ...prev, address: data.address }));
            } else {
              alert("Không thể lấy địa chỉ!");
              return;
            }
  
            // Tính khoảng cách và thời gian
            const startLat = 10.808131355448648;
            const startLng = 106.70645211764977;
  
            // Using apiService with precise coordinates
            const routeData = await apiService.getRouteDistance(startLat, startLng, lat, lng);
            console.log("Route data received:", routeData);
  
            if (routeData.message === "Tính khoảng cách thành công!") {
              // Ensure coordinates are properly parsed as numbers
              const fromLat = typeof routeData.from.lat === 'string' ? parseFloat(routeData.from.lat) : routeData.from.lat;
              const fromLng = typeof routeData.from.lng === 'string' ? parseFloat(routeData.from.lng) : routeData.from.lng;
              
              setRoute([
                new L.LatLng(fromLat, fromLng),
                new L.LatLng(lat, lng),
              ]);
              
              setRouteInfo({
                distance: parseFloat(routeData.distance_km),
                duration: parseFloat(routeData.duration_minutes),
              });
            } else {
              alert("Không thể tính khoảng cách!");
            }
          } catch (error) {
            console.error("Lỗi khi lấy vị trí hoặc tính khoảng cách:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(`Không thể truy cập vị trí! Lỗi: ${error.message}`);
        },
        options // Use the high accuracy options
      );
    } else {
      alert("Trình duyệt không hỗ trợ lấy vị trí!");
    }
  };

export default LocationPicker;
