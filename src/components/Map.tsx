"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  donors: any[];
}

export default function Map({ donors }: MapProps) {
  const center: [number, number] = [31.5204, 74.3587]; // Default to Lahore

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {donors.map((donor) => (
        <Marker 
          key={donor._id} 
          position={[31.5204 + (Math.random() - 0.5) * 0.1, 74.3587 + (Math.random() - 0.5) * 0.1]} 
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{donor.username}</h3>
              <p className="text-red-600 font-bold">{donor.bloodGroup}</p>
              <p className="text-xs">{donor.area}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}