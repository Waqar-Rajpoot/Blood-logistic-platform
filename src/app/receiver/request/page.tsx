// "use client";
// import React, { useState } from "react";
// import { 
//   PlusCircle, 
//   MapPin, 
//   Droplet, 
//   User, 
//   Phone, 
//   AlertCircle, 
//   Hospital,
//   Send
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function RequestBloodPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     patientName: "",
//     bloodGroup: "",
//     unitsRequired: 1,
//     hospitalName: "",
//     city: "",
//     area: "",
//     contactNumber: "",
//     isUrgent: false,
//     additionalNotes: ""
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       // Logic to save the request to MongoDB and trigger notifications
//       await axios.post("/api/requests/create", formData);
//       toast.success("Blood request posted successfully! Alerts sent to donors.");
//       router.push("/receiver/my-requests");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-3xl mx-auto">
        
//         {/* Header Section */}
//         <div className="bg-white p-8 rounded-t-3xl border-b border-gray-100 flex items-center gap-4">
//           <div className="bg-red-100 p-3 rounded-2xl text-red-600">
//             <PlusCircle size={32} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Create Blood Request</h1>
//             <p className="text-gray-500 text-sm">Fill in the details to notify matching donors immediately.</p>
//           </div>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-3xl shadow-sm space-y-6">
          
//           {/* Urgency Toggle */}
//           <div className={`p-4 rounded-2xl border-2 transition-all ${formData.isUrgent ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className={formData.isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-400'} />
//                 <div>
//                   <h3 className={`font-bold ${formData.isUrgent ? 'text-red-700' : 'text-gray-700'}`}>Urgent Emergency Flag</h3>
//                   <p className="text-xs text-gray-500">Enable this to prioritize your request in donor feeds.</p>
//                 </div>
//               </div>
//               <input 
//                 type="checkbox" 
//                 className="w-6 h-6 accent-red-600 cursor-pointer"
//                 checked={formData.isUrgent}
//                 onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Patient Name */}
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//                 <User size={16} /> Patient Name
//               </label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
//                 placeholder="Enter patient name"
//                 value={formData.patientName}
//                 onChange={(e) => setFormData({...formData, patientName: e.target.value})}
//               />
//             </div>

//             {/* Blood Group */}
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//                 <Droplet size={16} className="text-red-600" /> Required Blood Group
//               </label>
//               <select 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
//                 value={formData.bloodGroup}
//                 onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
//               >
//                 <option value="">Select Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>

//             {/* Units & Contact */}
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600">Units Required (Bags)</label>
//               <input 
//                 type="number" min="1" required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.unitsRequired}
//                 onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//                 <Phone size={16} /> Contact Number
//               </label>
//               <input 
//                 type="tel" required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 placeholder="+92 XXX XXXXXXX"
//                 value={formData.contactNumber}
//                 onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
//               />
//             </div>
//           </div>

//           {/* Hospital & Location */}
//           <div className="space-y-1 pt-2">
//             <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//               <Hospital size={16} /> Hospital Name & Address
//             </label>
//             <input 
//               required
//               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//               placeholder="e.g. Mayo Hospital, Hall Road"
//               value={formData.hospitalName}
//               onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//                 <MapPin size={16} /> City
//               </label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.city}
//                 onChange={(e) => setFormData({...formData, city: e.target.value})}
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
//                 <MapPin size={16} /> Area
//               </label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.area}
//                 onChange={(e) => setFormData({...formData, area: e.target.value})}
//               />
//             </div>
//           </div>

//           <button 
//             type="submit"
//             disabled={loading}
//             className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
//               loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
//             }`}
//           >
//             {loading ? "Sending Alerts..." : <><Send size={20} /> Post Blood Request</>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }






// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   PlusCircle, 
//   MapPin, 
//   Droplet, 
//   User, 
//   Phone, 
//   AlertCircle, 
//   Hospital,
//   Send,
//   Navigation
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function RequestBloodPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     patientName: "",
//     bloodGroup: "",
//     unitsRequired: 1,
//     hospitalName: "",
//     city: "",
//     area: "",
//     contactNumber: "",
//     isUrgent: false,
//     additionalNotes: "",
//     // Added for Smart Match logic
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   // Automatically get hospital location on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData(prev => ({
//             ...prev,
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           }));
//         },
//         () => {
//           toast.error("Could not get precise location. Smart Match might be less accurate.");
//         }
//       );
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation: Ensure we have coordinates for the "10km search"
//     if (!formData.latitude || !formData.longitude) {
//       toast("GPS not detected. Using City/Area for matching instead.", { icon: '⚠️' });
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         latitude: formData.latitude || 0,
//         longitude: formData.longitude || 0
//       };
      
//       // We hit the specific Smart Match endpoint we created
//       const response = await axios.post("/api/urgent-request", payload);
      
//       if (response.data.success) {
//         toast.success(`Request broadcasted successfully!`);
//         router.push("/receiver/my-requests");
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to broadcast request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-3xl mx-auto">
        
//         {/* Header Section */}
//         <div className="bg-white p-8 rounded-t-3xl border-b border-gray-100 flex items-center gap-4">
//           <div className="bg-red-100 p-3 rounded-2xl text-red-600">
//             <PlusCircle size={32} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Create Blood Request</h1>
//             <p className="text-gray-500 text-sm">Targeting donors within 10km of your location.</p>
//           </div>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-3xl shadow-sm space-y-6">
          
//           {/* Location Status Badge */}
//           <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${formData.latitude ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
//             <Navigation size={14} />
//             {formData.latitude 
//               ? "GPS Coordinates Captured: Ready for Smart Match" 
//               : "Detecting location... please allow GPS access"}
//           </div>

//           {/* Urgency Toggle */}
//           <div className={`p-4 rounded-2xl border-2 transition-all ${formData.isUrgent ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className={formData.isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-400'} />
//                 <div>
//                   <h3 className={`font-bold ${formData.isUrgent ? 'text-red-700' : 'text-gray-700'}`}>Urgent Emergency</h3>
//                   <p className="text-xs text-gray-500">Triggers instant browser alerts for nearby donors.</p>
//                 </div>
//               </div>
//               <input 
//                 type="checkbox" 
//                 className="w-6 h-6 accent-red-600 cursor-pointer"
//                 checked={formData.isUrgent}
//                 onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><User size={16} /> Patient Name</label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
//                 placeholder="Enter patient name"
//                 value={formData.patientName}
//                 onChange={(e) => setFormData({...formData, patientName: e.target.value})}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Droplet size={16} className="text-red-600" /> Required Blood Group</label>
//               <select 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
//                 value={formData.bloodGroup}
//                 onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
//               >
//                 <option value="">Select Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
//               </select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600">Units Required (Bags)</label>
//               <input 
//                 type="number" min="1" required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.unitsRequired}
//                 onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Phone size={16} /> Contact Number</label>
//               <input 
//                 type="tel" required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 placeholder="+92 XXX XXXXXXX"
//                 value={formData.contactNumber}
//                 onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
//               />
//             </div>
//           </div>

//           <div className="space-y-1 pt-2">
//             <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Hospital size={16} /> Hospital Name</label>
//             <input 
//               required
//               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//               placeholder="e.g. Mayo Hospital"
//               value={formData.hospitalName}
//               onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><MapPin size={16} /> City</label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.city}
//                 onChange={(e) => setFormData({...formData, city: e.target.value})}
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><MapPin size={16} /> Area</label>
//               <input 
//                 required
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
//                 value={formData.area}
//                 onChange={(e) => setFormData({...formData, area: e.target.value})}
//               />
//             </div>
//           </div>

//           <button 
//             type="submit"
//             disabled={loading}
//             className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
//               loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
//             }`}
//           >
//             {loading ? "Broadcasting Alert..." : <><Send size={20} /> Post & Notify Donors</>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }






"use client";
import React, { useState, } from "react";
import { 
  PlusCircle, Droplet, User, Phone, 
  AlertCircle, Hospital, Send, Map as MapIcon 
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to prevent SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Initialising Map...</div>
});

export default function RequestBloodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsRequired: 1,
    hospitalName: "",
    city: "",
    area: "",
    contactNumber: "",
    isUrgent: true, // Default to true for smart match
    latitude: 30.66, // Default fallback (Sahiwal)
    longitude: 73.10,
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [formData.longitude, formData.latitude] // GeoJSON format
        }
      };
      
      const response = await axios.post("/api/urgent-request", payload);
      
      if (response.data.success) {
        toast.success(`Priority alert broadcasted to nearby donors!`);
        router.push("/receiver/my-requests");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to broadcast request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-t-[2.5rem] border-b border-gray-100 flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600">
            <PlusCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create Emergency Request</h1>
            <p className="text-gray-500 text-sm font-medium italic">Targeting donors within 10km radius</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-[2.5rem] shadow-xl shadow-gray-200/50 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left side: Form Inputs */}
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Patient Name
                </label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Ali Khan" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Droplet size={14} className="text-red-600" /> Group
                  </label>
                  <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none appearance-none" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">Units</label>
                  <input type="number" min="1" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={formData.unitsRequired} onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Hospital size={14} /> Hospital Name
                </label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="e.g. DHQ Hospital" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> Contact
                </label>
                <input type="tel" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="+92..." value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} />
              </div>
            </div>

            {/* Right side: Map Picker */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <MapIcon size={14} className="text-red-600" /> Pin Exact Location
              </label>
              
              <div className="rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner">
                 <MapPicker 
                   onLocationSelect={handleLocationSelect} 
                   defaultLocation={{lat: formData.latitude, lng: formData.longitude}} 
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input required placeholder="Area" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] text-red-600 font-bold leading-tight uppercase tracking-tighter flex items-center gap-2">
                  <AlertCircle size={14} /> Your request will be broadcasted to donors within 10km of this specific pin.
                </p>
              </div>
            </div>

          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[2rem] font-black text-white flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-2xl ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200 active:scale-[0.98]'
            }`}
          >
            {loading ? "Notifying Nearby Donors..." : <><Send size={20} /> Launch Emergency Alert</>}
          </button>
        </form>
      </div>
    </div>
  );
}