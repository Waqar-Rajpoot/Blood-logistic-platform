// "use client";
// import React, { useState, useEffect, useCallback, Suspense } from "react";
// import { 
//   MapPin, 
//   Droplets, 
//   Phone,
//   Loader2,
//   Search as SearchIcon,
//   Navigation,
//   User
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import dynamic from "next/dynamic";
// import Link from "next/link";

// const DonorMap = dynamic(() => import("@/components/Map"), { 
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
//         Initializing Map Engine...
//     </div>
//   )
// });

// interface Donor {
//   _id: string;
//   username: string;
//   bloodGroup: string;
//   city: string;
//   area: string;
//   phoneNumber: string;
//   location: {
//     coordinates: [number, number];
//   };
// }

// export default function AdvancedSearchPage() {
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <Loader2 className="animate-spin text-red-600" size={32} />
//       </div>
//     }>
//       <AdvancedSearchContent />
//     </Suspense>
//   );
// }

// function AdvancedSearchContent() {
//   const [donors, setDonors] = useState<Donor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
//   // Search States
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [areaSearch, setAreaSearch] = useState("");
//   // --- NEW STATE FOR DEBOUNCE ---
//   const [debouncedAreaSearch, setDebouncedAreaSearch] = useState("");
  
//   const [radius, setRadius] = useState("10");
//   const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null);

//   // --- DEBOUNCE EFFECT ---
//   // This effect updates debouncedAreaSearch only after 1 second of inactivity
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedAreaSearch(areaSearch);
//     }, 1000);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [areaSearch]);

//   const getBrowserLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser");
//       return;
//     }
//     toast.loading("Getting your location...", { id: "geo" });
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
//         toast.success("Location acquired", { id: "geo" });
//       },
//       () => {
//         toast.error("Location access denied.", { id: "geo" });
//       }
//     );
//   };

//   const fetchDonors = useCallback(async () => {
//     try {
//       setLoading(true);
//       // Use the DEBOUNCED value here instead of the raw input value
//       const params: any = { bloodGroup, area: debouncedAreaSearch };
      
//       if (userLocation) {
//         params.lng = userLocation.lng;
//         params.lat = userLocation.lat;
//         params.radius = radius;
//       }

//       const res = await axios.get(`/api/donors/search`, { params });
      
//       const sanitizedDonors = res.data.donors.map((d: any) => ({
//         ...d,
//         latitude: d.location?.coordinates[1],
//         longitude: d.location?.coordinates[0]
//       }));

//       setDonors(sanitizedDonors || []);
//     } catch (error: any) {
//       toast.error(`Search failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//     // Dependency changed from areaSearch to debouncedAreaSearch
//   }, [bloodGroup, debouncedAreaSearch, radius, userLocation]);

//   useEffect(() => {
//     fetchDonors();
//   }, [fetchDonors]);

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
//       <div className="p-4 border-b bg-white shadow-sm z-10">
//         <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
//           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div className="relative">
//               <Droplets className="absolute left-3 top-3 text-red-600" size={18} />
//               <select 
//                 value={bloodGroup}
//                 onChange={(e) => setBloodGroup(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none"
//               >
//                 <option value="">Any Blood Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>

//             <div className="relative">
//               <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="City or Area name..." 
//                 value={areaSearch}
//                 onChange={(e) => setAreaSearch(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
//               />
//             </div>

//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <Navigation className="absolute left-3 top-3 text-blue-500" size={18} />
//                 <select 
//                   value={radius}
//                   onChange={(e) => setRadius(e.target.value)}
//                   className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none"
//                 >
//                   <option value="5">Within 5 KM</option>
//                   <option value="10">Within 10 KM</option>
//                   <option value="20">Within 20 KM</option>
//                   <option value="50">Within 50 KM</option>
//                 </select>
//               </div>
//               <button 
//                 onClick={getBrowserLocation}
//                 className={`p-2.5 rounded-xl border transition-all ${userLocation ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
//               >
//                 <Navigation size={20} fill={userLocation ? "currentColor" : "none"} />
//               </button>
//             </div>
//           </div>

//           <button 
//             onClick={fetchDonors}
//             className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
//           >
//             <SearchIcon size={18} /> Search
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className={`w-full md:w-96 border-r overflow-y-auto bg-gray-50 p-4 space-y-4 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
//           <div className="flex items-center justify-between mb-4 px-2">
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//               {loading ? "Searching..." : `Donors Nearby (${donors.length})`}
//             </p>
//             <div className="flex bg-gray-200 rounded-lg p-1">
//                <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase ${viewMode === 'list' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>List</button>
//                <button onClick={() => setViewMode("map")} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase ${viewMode === 'map' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>Map</button>
//             </div>
//           </div>

//           {donors.map((donor) => (
//             <div key={donor._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-red-300 transition-all">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="bg-red-50 px-3 py-1 rounded-xl text-red-600 font-black text-lg">{donor.bloodGroup}</div>
//                 <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase">Verified</span>
//               </div>
//               <h4 className="font-black text-gray-800 text-lg leading-tight">{donor.username}</h4>
//               <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
//                 <MapPin size={12} className="text-red-400" /> {donor.area}, {donor.city}
//               </p>

//               <div className="mt-5 flex gap-2">
//                 <a href={`tel:${donor.phoneNumber}`} className="flex-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2">
//                   <Phone size={14} /> Call
//                 </a>
//                 <Link 
//                   href={`/donors/${donor._id}`}
//                   className="flex-1 bg-gray-100 text-center text-gray-700 text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-gray-200"
//                 >
//                   <User size={14} /> Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
//             <DonorMap donors={donors} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} />
//         </div>
//       </div>
//     </div>
//   );
// }






// "use client";
// import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
// import { 
//   MapPin, 
//   Droplets, 
//   Phone,
//   Loader2,
//   Search as SearchIcon,
//   Navigation,
//   User,
//   LayoutList,
//   Map as MapIcon
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import dynamic from "next/dynamic";
// import Link from "next/link";

// const DonorMap = dynamic(() => import("@/components/Map"), { 
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
//         Initializing Map Engine...
//     </div>
//   )
// });

// interface Donor {
//   _id: string;
//   username: string;
//   bloodGroup: string;
//   city: string;
//   area: string;
//   phoneNumber: string;
//   location: {
//     coordinates: [number, number];
//   };
//   latitude?: number;
//   longitude?: number;
// }

// export default function AdvancedSearchPage() {
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <Loader2 className="animate-spin text-red-600" size={32} />
//       </div>
//     }>
//       <AdvancedSearchContent />
//     </Suspense>
//   );
// }

// function AdvancedSearchContent() {
//   const [donors, setDonors] = useState<Donor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [areaSearch, setAreaSearch] = useState("");
//   const [debouncedAreaSearch, setDebouncedAreaSearch] = useState("");
//   const [radius, setRadius] = useState("10");
//   const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null);

//   // Debounce logic for city search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedAreaSearch(areaSearch);
//     }, 1000);
//     return () => clearTimeout(handler);
//   }, [areaSearch]);

//   const getBrowserLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported");
//       return;
//     }
//     toast.loading("Getting location...", { id: "geo" });
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
//         toast.success("Location acquired", { id: "geo" });
//       },
//       () => toast.error("Location denied.", { id: "geo" })
//     );
//   };

//   const fetchDonors = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params: any = { bloodGroup, area: debouncedAreaSearch };
      
//       if (userLocation) {
//         params.lng = userLocation.lng;
//         params.lat = userLocation.lat;
//         params.radius = radius;
//       }

//       const res = await axios.get(`/api/donors/search`, { params });
      
//       const sanitizedDonors = res.data.donors.map((d: any) => ({
//         ...d,
//         latitude: d.location?.coordinates[1],
//         longitude: d.location?.coordinates[0]
//       }));

//       setDonors(sanitizedDonors || []);
//     } catch (error: any) {
//       toast.error(`Search failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [bloodGroup, debouncedAreaSearch, radius, userLocation]);

//   useEffect(() => {
//     fetchDonors();
//   }, [fetchDonors]);

//   // Determine the map center dynamically
//   const dynamicCenter = useMemo((): [number, number] => {
//     if (donors.length > 0 && donors[0].latitude) {
//       return [donors[0].latitude, donors[0].longitude!];
//     }
//     if (userLocation) {
//       return [userLocation.lat, userLocation.lng];
//     }
//     return [31.5204, 74.3587]; // Lahore default
//   }, [donors, userLocation]);

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden">
//       {/* Top Search Bar */}
//       <div className="p-4 border-b bg-white shadow-sm z-20">
//         <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
//           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div className="relative">
//               <Droplets className="absolute left-3 top-3 text-red-600" size={18} />
//               <select 
//                 value={bloodGroup}
//                 onChange={(e) => setBloodGroup(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none"
//               >
//                 <option value="">Any Blood Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>

//             <div className="relative">
//               <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="City or Area..." 
//                 value={areaSearch}
//                 onChange={(e) => setAreaSearch(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
//               />
//             </div>

//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <Navigation className="absolute left-3 top-3 text-blue-500" size={18} />
//                 <select value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none">
//                   <option value="10">10 KM</option>
//                   <option value="20">20 KM</option>
//                   <option value="50">50 KM</option>
//                 </select>
//               </div>
//               <button onClick={getBrowserLocation} className={`p-2.5 rounded-xl border transition-all ${userLocation ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
//                 <Navigation size={20} fill={userLocation ? "currentColor" : "none"} />
//               </button>
//             </div>
//           </div>
//           <button onClick={fetchDonors} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700">
//             <SearchIcon size={18} /> Search
//           </button>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Sidebar */}
//         <div className={`w-full md:w-96 border-r overflow-y-auto bg-gray-50 p-4 space-y-4 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
//           <div className="flex items-center justify-between mb-4">
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//               {loading ? "Searching..." : `Donors (${donors.length})`}
//             </p>
//             <div className="flex bg-gray-200 rounded-lg p-1">
//                <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'list' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>List</button>
//                <button onClick={() => setViewMode("map")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'map' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>Map</button>
//             </div>
//           </div>

//           {donors.map((donor) => (
//             <div key={donor._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-red-300 transition-all">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="bg-red-50 px-3 py-1 rounded-xl text-red-600 font-black text-lg">{donor.bloodGroup}</div>
//                 <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase">Verified</span>
//               </div>
//               <h4 className="font-black text-gray-800 text-lg leading-tight">{donor.username}</h4>
//               <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
//                 <MapPin size={12} className="text-red-400" /> {donor.area}, {donor.city}
//               </p>
//               <div className="mt-5 flex gap-2">
//                 <a href={`tel:${donor.phoneNumber}`} className="flex-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2">
//                   <Phone size={14} /> Call
//                 </a>
//                 <Link href={`/donors/${donor._id}`} className="flex-1 bg-gray-100 text-gray-700 text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2">
//                   <User size={14} /> Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Map */}
//         <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
//             <DonorMap donors={donors} center={dynamicCenter} />
            
//             {/* Mobile View Toggle */}
//             <button 
//               onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
//               className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold uppercase text-xs"
//             >
//               {viewMode === 'list' ? <><MapIcon size={18}/> View Map</> : <><LayoutList size={18}/> View List</>}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// }








// "use client";
// import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
// import { 
//   MapPin, 
//   Droplets, 
//   Phone,
//   Loader2,
//   Search as SearchIcon,
//   Navigation,
//   User,
//   LayoutList,
//   Map as MapIcon
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import dynamic from "next/dynamic";
// import Link from "next/link";

// // Dynamic import is essential to prevent "window is not defined" errors with Leaflet
// const DonorMap = dynamic(() => import("@/components/Map"), { 
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
//         Initializing Map Engine...
//     </div>
//   )
// });

// interface Donor {
//   _id: string;
//   username: string;
//   bloodGroup: string;
//   city: string;
//   area: string;
//   phoneNumber: string;
//   location: {
//     coordinates: [number, number]; // [longitude, latitude] from MongoDB
//   };
//   latitude?: number;
//   longitude?: number;
// }

// export default function AdvancedSearchPage() {
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <Loader2 className="animate-spin text-red-600" size={32} />
//       </div>
//     }>
//       <AdvancedSearchContent />
//     </Suspense>
//   );
// }

// function AdvancedSearchContent() {
//   const [donors, setDonors] = useState<Donor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [areaSearch, setAreaSearch] = useState("");
//   const [debouncedAreaSearch, setDebouncedAreaSearch] = useState("");
//   const [radius, setRadius] = useState("10");
//   const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null);

//   // Debounce logic for city search to prevent too many API calls while typing
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedAreaSearch(areaSearch);
//     }, 800);
//     return () => clearTimeout(handler);
//   }, [areaSearch]);

//   const getBrowserLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported");
//       return;
//     }
//     toast.loading("Getting location...", { id: "geo" });
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
//         toast.success("Location acquired", { id: "geo" });
//       },
//       () => toast.error("Location access denied.", { id: "geo" })
//     );
//   };

//   const fetchDonors = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params: any = { bloodGroup, area: debouncedAreaSearch };
      
//       if (userLocation) {
//         params.lng = userLocation.lng;
//         params.lat = userLocation.lat;
//         params.radius = radius;
//       }

//       const res = await axios.get(`/api/donors/search`, { params });
      
//       // FIX: Explicitly extract and reverse coordinates for Leaflet
//       const sanitizedDonors = res.data.donors.map((d: any) => ({
//         ...d,
//         // MongoDB stores [lng, lat]. We map them to flat props for easy Map access
//         latitude: d.location?.coordinates[1],
//         longitude: d.location?.coordinates[0]
//       }));

//       setDonors(sanitizedDonors || []);
//     } catch (error: any) {
//       console.error("Search Error:", error);
//       toast.error(`Search failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [bloodGroup, debouncedAreaSearch, radius, userLocation]);

//   useEffect(() => {
//     fetchDonors();
//   }, [fetchDonors]);

//   // Determine the map center dynamically based on results
//   const dynamicCenter = useMemo((): [number, number] => {
//     if (donors.length > 0 && donors[0].latitude && donors[0].longitude) {
//       return [donors[0].latitude, donors[0].longitude];
//     }
//     if (userLocation) {
//       return [userLocation.lat, userLocation.lng];
//     }
//     return [31.5204, 74.3587]; // Fallback to Lahore
//   }, [donors, userLocation]);

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden">
//       {/* Search Header - Mobile Responsive */}
//       <div className="p-3 md:p-4 border-b bg-white shadow-sm z-20">
//         <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
//           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
//             <div className="relative">
//               <Droplets className="absolute left-3 top-3 text-red-600" size={18} />
//               <select 
//                 value={bloodGroup}
//                 onChange={(e) => setBloodGroup(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none text-sm"
//               >
//                 <option value="">Any Blood Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>

//             <div className="relative">
//               <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Search Sahiwal, Lahore..." 
//                 value={areaSearch}
//                 onChange={(e) => setAreaSearch(e.target.value)}
//                 className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-sm"
//               />
//             </div>

//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <Navigation className="absolute left-3 top-3 text-blue-500" size={18} />
//                 <select value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none text-sm">
//                   <option value="10">10 KM Radius</option>
//                   <option value="20">20 KM Radius</option>
//                   <option value="50">50 KM Radius</option>
//                 </select>
//               </div>
//               <button onClick={getBrowserLocation} className={`p-2.5 rounded-xl border transition-all ${userLocation ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
//                 <Navigation size={20} fill={userLocation ? "currentColor" : "none"} />
//               </button>
//             </div>
//           </div>
//           <button onClick={fetchDonors} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-transform">
//             <SearchIcon size={18} /> Search Donors
//           </button>
//         </div>
//       </div>

//       {/* Main Viewport */}
//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Sidebar - Hidden on mobile when map is active */}
//         <div className={`w-full md:w-96 border-r overflow-y-auto bg-gray-50 p-4 space-y-4 transition-all duration-300 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
//           <div className="flex items-center justify-between mb-2 px-1">
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//               {loading ? "Refreshing..." : `Results Found: ${donors.length}`}
//             </p>
//             <div className="hidden md:flex bg-gray-200 rounded-lg p-1">
//                <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'list' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>List</button>
//                <button onClick={() => setViewMode("map")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'map' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>Map</button>
//             </div>
//           </div>

//           {donors.length === 0 && !loading && (
//             <div className="text-center py-20 text-gray-400">
//               <MapPin size={40} className="mx-auto mb-2 opacity-20" />
//               <p className="font-bold">No donors found in this area</p>
//             </div>
//           )}

//           {donors.map((donor) => (
//             <div key={donor._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-red-200 transition-all cursor-default">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="bg-red-50 px-3 py-1 rounded-xl text-red-600 font-black text-lg">{donor.bloodGroup}</div>
//                 <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase">Active</span>
//               </div>
//               <h4 className="font-black text-gray-800 text-lg leading-tight">{donor.username}</h4>
//               <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
//                 <MapPin size={12} className="text-red-400" /> {donor.area}, {donor.city}
//               </p>
//               <div className="mt-5 flex gap-2">
//                 <a href={`tel:${donor.phoneNumber}`} className="flex-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black">
//                   <Phone size={14} /> Call
//                 </a>
//                 <Link href={`/donors/${donor._id}`} className="flex-1 bg-gray-100 text-gray-700 text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-gray-200">
//                   <User size={14} /> Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Map Container - Hidden on mobile when list is active */}
//         <div className={`flex-1 relative h-full ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
//             <DonorMap donors={donors} center={dynamicCenter} />
            
//             {/* Mobile View Toggle - Floating Button */}
//             <button 
//               onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
//               className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase text-xs tracking-widest active:scale-90 transition-transform"
//             >
//               {viewMode === 'list' ? <><MapIcon size={18}/> View Map</> : <><LayoutList size={18}/> View List</>}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { 
  MapPin, 
  Droplets, 
  Phone,
  Loader2,
  Search as SearchIcon,
  Navigation,
  User,
  LayoutList,
  Map as MapIcon
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Link from "next/link";

const DonorMap = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
        Initializing Map Engine...
    </div>
  )
});

interface Donor {
  _id: string;
  username: string;
  bloodGroup: string;
  city: string;
  area: string;
  phoneNumber: string;
  location: {
    coordinates: [number, number];
  };
  latitude?: number;
  longitude?: number;
}

export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    }>
      <AdvancedSearchContent />
    </Suspense>
  );
}

function AdvancedSearchContent() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  const [bloodGroup, setBloodGroup] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [debouncedAreaSearch, setDebouncedAreaSearch] = useState("");
  const [radius, setRadius] = useState("10");
  const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAreaSearch(areaSearch);
    }, 800);
    return () => clearTimeout(handler);
  }, [areaSearch]);

  const getBrowserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    toast.loading("Getting location...", { id: "geo" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        toast.success("Location acquired", { id: "geo" });
      },
      () => toast.error("Location access denied.", { id: "geo" })
    );
  };

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { bloodGroup, area: debouncedAreaSearch };
      
      if (userLocation) {
        params.lng = userLocation.lng;
        params.lat = userLocation.lat;
        params.radius = radius;
      }

      const res = await axios.get(`/api/donors/search`, { params });
      
      const sanitizedDonors = res.data.donors.map((d: any) => ({
        ...d,
        latitude: d.location?.coordinates[1],
        longitude: d.location?.coordinates[0]
      }));

      setDonors(sanitizedDonors || []);
    } catch (error: any) {
      console.error("Search Error:", error);
      toast.error(`Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, debouncedAreaSearch, radius, userLocation]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const dynamicCenter = useMemo((): [number, number] => {
    if (donors.length > 0 && donors[0].latitude && donors[0].longitude) {
      return [donors[0].latitude, donors[0].longitude];
    }
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    return [31.5204, 74.3587]; 
  }, [donors, userLocation]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden w-full max-w-[100vw]">
      {/* Search Header */}
      <div className="p-3 md:p-4 border-b bg-white shadow-sm z-30 w-full">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-2 md:gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            
            {/* Blood Group Select Container */}
            <div className="relative w-full group">
              <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none z-10" size={18} />
              <select 
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none text-[16px] sm:text-sm focus:border-red-300 transition-all truncate"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                <option value="">Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-200">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-400"></div>
              </div>
            </div>

            {/* Area Search Input */}
            <div className="relative w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
              <input 
                type="text" 
                placeholder="City or Area..." 
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-[16px] sm:text-sm focus:border-red-300 transition-all"
              />
            </div>

            {/* Radius & Location Row */}
            <div className="flex gap-2 w-full">
              <div className="relative flex-1 group">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none z-10" size={18} />
                <select 
                   value={radius} 
                   onChange={(e) => setRadius(e.target.value)} 
                   className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium appearance-none text-[16px] sm:text-sm focus:border-blue-300 transition-all truncate"
                   style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  <option value="10">10 KM</option>
                  <option value="20">20 KM</option>
                  <option value="50">50 KM</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-200">
                   <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-400"></div>
                </div>
              </div>
              <button 
                onClick={getBrowserLocation} 
                className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${userLocation ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-inner' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <Navigation size={20} fill={userLocation ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={fetchDonors} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all text-sm shadow-md shadow-red-100 flex-shrink-0"
          >
            <SearchIcon size={18} /> Search Donors
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        {/* Sidebar */}
        <div className={`w-full md:w-96 border-r overflow-y-auto bg-gray-50 p-4 space-y-4 transition-all duration-300 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {loading ? "Searching..." : `Results: ${donors.length}`}
            </p>
            <div className="hidden md:flex bg-gray-200 rounded-lg p-1">
               <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'list' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>List</button>
               <button onClick={() => setViewMode("map")} className={`px-3 py-1 rounded-md text-[10px] font-black ${viewMode === 'map' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>Map</button>
            </div>
          </div>

          {donors.map((donor) => (
            <div key={donor._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 mb-3 hover:border-red-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 px-3 py-1 rounded-xl text-red-600 font-black text-lg">{donor.bloodGroup}</div>
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase">Active</span>
              </div>
              <h4 className="font-black text-gray-800 text-lg leading-tight">{donor.username}</h4>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-red-400" /> {donor.area}, {donor.city}
              </p>
              <div className="mt-5 flex gap-2">
                <a href={`tel:${donor.phoneNumber}`} className="flex-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 active:bg-black">
                  <Phone size={14} /> Call
                </a>
                <Link href={`/donors/${donor._id}`} className="flex-1 bg-gray-100 text-gray-700 text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 active:bg-gray-200">
                  <User size={14} /> Profile
                </Link>
              </div>
            </div>
          ))}
          <div className="h-24 md:hidden" /> {/* Extra spacing for mobile toggle */}
        </div>

        {/* Map */}
        <div className={`flex-1 relative h-full w-full ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
            <DonorMap donors={donors} center={dynamicCenter} />
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-[9999] pointer-events-none px-6">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="pointer-events-auto bg-red-600 text-white w-full max-w-xs py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 font-black uppercase text-[12px] tracking-wider active:scale-95 transition-all border-4 border-white"
          >
            {viewMode === 'list' ? (
              <><MapIcon size={20}/> Show Map View</>
            ) : (
              <><LayoutList size={20}/> Show List View</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}