import css from "./MapPicker.module.css";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправление стандартного бага Leaflet с иконкой маркера в Webpack/Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Вспомогательный компонент для обработки клика по карте
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse Geocoding через OpenStreetMap Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        );
        const data = await response.json();

        // Формируем адрес из полученных данных
        const addressText =
          data.display_name ||
          `Delivery to coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        onLocationSelect(addressText, [lng, lat]);
      } catch (error) {
        console.error("Geocoding error:", error);
        onLocationSelect(
          `Delivery to coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          [lng, lat],
        );
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

export const MapPicker = ({ onLocationSelect }) => {
  // Координаты по умолчанию (Одесса)
  const defaultCenter = [46.4825, 30.7233];
  const [position, setPosition] = useState(null);

  return (
    <div className={css.mapWrapper}>
      <p className={css.mapHint}>
        Click on the map to choose your delivery spot:
      </p>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className={css.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};
