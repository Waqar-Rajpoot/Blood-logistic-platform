"use client";
import { useState} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet default marker icons in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setLocation, position }: any) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export default function MapPicker({ onLocationSelect, defaultLocation }: any) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultLocation?.lat ? [defaultLocation.lat, defaultLocation.lng] : [30.66, 73.10] // Default to Sahiwal
  );

  const handleLocation = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border-2 border-gray-100 mt-2 z-0">
      <MapContainer center={position || [30.66, 73.10]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setLocation={handleLocation} position={position} />
      </MapContainer>
      <p className="text-[10px] text-gray-400 p-2 bg-white">Click on the map to set your precise location</p>
    </div>
  );
}