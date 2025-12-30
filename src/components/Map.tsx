// "use client";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix for default marker icons in Next.js
// const customIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// interface MapProps {
//   donors: any[];
// }

// export default function Map({ donors }: MapProps) {
//   const center: [number, number] = [31.5204, 74.3587]; // Default to Lahore

//   return (
//     <MapContainer 
//       center={center} 
//       zoom={13} 
//       style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
      
//       {donors.map((donor) => (
//         <Marker 
//           key={donor._id} 
//           position={[31.5204 + (Math.random() - 0.5) * 0.1, 74.3587 + (Math.random() - 0.5) * 0.1]} 
//           icon={customIcon}
//         >
//           <Popup>
//             <div className="p-2">
//               <h3 className="font-bold">{donor.username}</h3>
//               <p className="text-red-600 font-bold">{donor.bloodGroup}</p>
//               <p className="text-xs">{donor.area}</p>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }







// "use client";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useEffect } from "react";

// const customIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// // Helper to move map when center changes
// function RecenterMap({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center && !isNaN(center[0]) && !isNaN(center[1])) {
//       map.setView(center, map.getZoom());
//     }
//   }, [center, map]);
//   return null;
// }

// interface MapProps {
//   donors: any[];
//   center?: [number, number];
// }

// export default function DonorMap({ donors, center }: MapProps) {
//   // 1. Fallback to a safe default if center is undefined or invalid
//   const safeCenter: [number, number] = (center && !isNaN(center[0]) && !isNaN(center[1])) 
//     ? center 
//     : [30.3753, 69.3451]; // Center of Pakistan

//   return (
//     <div className="h-full w-full">
//       <MapContainer 
//         center={safeCenter} 
//         zoom={12} 
//         style={{ height: "100%", width: "100%" }}
//         className="z-0"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; OpenStreetMap'
//         />
        
//         <RecenterMap center={safeCenter} />
        
//         {donors?.map((donor) => {
//           // 2. Extract coordinates safely
//           const lat = donor.latitude ?? donor.location?.coordinates[1];
//           const lng = donor.longitude ?? donor.location?.coordinates[0];

//           // 3. CRITICAL FIX: Only render Marker if coordinates are valid numbers
//           if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
//             console.warn(`Donor ${donor.username} has invalid coordinates:`, { lat, lng });
//             return null;
//           }

//           return (
//             <Marker 
//               key={donor._id} 
//               position={[lat, lng]} 
//               icon={customIcon}
//             >
//               <Popup>
//                 <div className="p-1 min-w-[120px]">
//                   <h3 className="font-bold text-gray-800">{donor.username}</h3>
//                   <p className="text-red-600 font-bold text-xs">{donor.bloodGroup}</p>
//                   <p className="text-[10px] text-gray-500">{donor.area}</p>
//                   <a href={`tel:${donor.phoneNumber}`} className="mt-2 block bg-red-600 text-white text-[10px] text-center py-1 rounded font-bold">
//                     Call
//                   </a>
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }





"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- THE CRITICAL FIX FOR INVISIBLE MARKERS ---
// This manually sets the icon images because Next.js often breaks the default paths.
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set it as the default for all markers
L.Marker.prototype.options.icon = DefaultIcon;

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

interface MapProps {
  donors: any[];
  center?: [number, number];
}

export default function DonorMap({ donors, center }: MapProps) {
  const safeCenter: [number, number] = (center && !isNaN(center[0]) && !isNaN(center[1])) 
    ? center 
    : [30.3753, 69.3451];

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={safeCenter} 
        zoom={12} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        <RecenterMap center={safeCenter} />
        
        {donors?.map((donor) => {
          // ENSURE COORDINATE ORDER: [Lat, Lng]
          // GeoJSON stores as [Lng, Lat], so we must flip them
          const lat = donor.latitude || donor.location?.coordinates[1];
          const lng = donor.longitude || donor.location?.coordinates[0];

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker 
              key={donor._id} 
              position={[lat, lng]} 
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-gray-800">{donor.username}</p>
                  <p className="text-red-600 text-xs font-bold">{donor.bloodGroup}</p>
                  <p className="text-[10px] text-gray-500">{donor.area}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}