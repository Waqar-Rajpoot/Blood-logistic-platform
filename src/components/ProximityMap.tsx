"use client";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Droplet, } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// This fixes the issue where Leaflet icons don't show up correctly in Next.js
const createCustomIcon = (color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color: color }}>
      <Droplet fill={color} size={32} />
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

interface ProximityMapProps {
  hospitalLoc: { lat: number; lng: number };
  donors: any[];
}

export default function ProximityMap({ hospitalLoc, donors }: ProximityMapProps) {
  const center: [number, number] = [hospitalLoc.lat, hospitalLoc.lng];

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Visualizing the Search Radius (10km) */}
        <Circle 
          center={center} 
          pathOptions={{ fillColor: 'red', color: 'red', fillOpacity: 0.1 }} 
          radius={10000} 
        />

        {/* 2. Hospital / Receiver Marker */}
        <Marker position={center}>
          <Popup>
            <div className="font-bold text-center">
              Your Current Location<br/>
              <span className="text-gray-500 font-normal">Searching from here</span>
            </div>
          </Popup>
        </Marker>

        {/* 3. Donor Markers */}
        {donors.map((donor) => (
          <Marker
            key={donor._id}
            position={[donor.location.coordinates[1], donor.location.coordinates[0]]}
            icon={createCustomIcon("#dc2626")} // Red for donors
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-black text-gray-900">{donor.username}</p>
                <p className="text-red-600 font-bold">{donor.bloodGroup}</p>
                <p className="text-[10px] text-gray-500">{donor.phoneNumber}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}