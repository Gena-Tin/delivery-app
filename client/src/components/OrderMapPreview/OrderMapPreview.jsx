import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import css from "./OrderMapPreview.module.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const OrderMapPreview = ({ coordinates }) => {
  // В GeoJSON координаты хранятся как [lng, lat]
  // Leaflet ожидает [lat, lng]
  if (!coordinates || coordinates.length < 2) return null;

  const [lng, lat] = coordinates;
  const position = [lat, lng];

  return (
    <div className={css.mapWrapper}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        dragging={!L.Browser.mobile} // отключение случайного скролла на мобилках
        className={css.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};
