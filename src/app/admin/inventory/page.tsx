// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Plus, Trash2, Package, Search, Loader2 } from "lucide-react";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// export default function HospitalInventory() {
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [formData, setFormData] = useState({
//     bloodGroup: "O+",
//     units: 1,
//     source: "",
//     expiryDate: "",
//   });

//   const fetchInventory = async () => {
//     try {
//       const res = await axios.get("/api/admin/inventory");
//       setInventory(res.data.data);
//     } catch (err) {
//       toast.error(`Failed to sync with vault: ${err}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   const getStats = (group: string) => {
//     return inventory
//       .filter((item: any) => item.bloodGroup === group)
//       .reduce((acc, curr: any) => acc + (curr.units || 0), 0);
//   };

//   const handleAddStock = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       await axios.post("/api/admin/inventory", formData);
//       toast.success("Units Registered to Vault");
//       setFormData({ ...formData, source: "", units: 1, expiryDate: "" });
//       fetchInventory();
//     } catch (err) {
//       toast.error(`Database write error: ${err}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const deleteStock = async (id: string) => {
//     try {
//       await axios.delete(`/api/admin/inventory/${id}`);
//       setInventory((prev) => prev.filter((item: any) => item._id !== id));
//       toast.success("Unit Purged from Storage");
//     } catch (err) {
//       toast.error(`Deletion failed: ${err}`);
//     }
//   };

//   const filteredInventory = inventory.filter((item: any) => {
//     const matchesTab = activeTab === "All" || item.bloodGroup === activeTab;
//     const matchesSearch = item.source
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesTab && matchesSearch;
//   });

//   if (loading)
//     return (
//       <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
//         <Loader2 className="animate-spin text-red-600" size={40} />
//         <p className="text-xs font-black uppercase tracking-widest text-slate-400">
//           Accessing Secure Vault...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
//             Hospital <span className="text-red-600">Inventory</span>
//           </h1>
//           <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
//             Central Blood Bank Management System
//           </p>
//         </div>

//         {/* STATS - Responsive Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
//           {BLOOD_GROUPS.map((group) => {
//             const count = getStats(group);
//             return (
//               <div
//                 key={group}
//                 className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center transition-all hover:border-red-100"
//               >
//                 <span className="text-[25px] font-black text-slate-400 uppercase">
//                   {group}
//                 </span>
//                 <span
//                   className={`text-lg md:text-xl font-black ${
//                     count < 5 ? "text-red-600" : "text-slate-800"
//                   }`}
//                 >
//                   {count} <span className="text-[12px]">u</span>
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
//           {/* LEFT: INTAKE FORM - Full width on mobile */}
//           <div className="lg:col-span-4 order-2 lg:order-1">
//             <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 lg:sticky lg:top-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="h-10 w-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
//                   <Plus size={20} />
//                 </div>
//                 <h2 className="text-lg font-black uppercase italic tracking-tight">
//                   Add New Stock
//                 </h2>
//               </div>

//               <form onSubmit={handleAddStock} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                       Group
//                     </label>
//                     <select
//                       value={formData.bloodGroup}
//                       onChange={(e) =>
//                         setFormData({ ...formData, bloodGroup: e.target.value })
//                       }
//                       className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold focus:ring-2 focus:ring-red-500 text-sm"
//                     >
//                       {BLOOD_GROUPS.map((g) => (
//                         <option key={g}>{g}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                       Units
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={formData.units}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           units: parseInt(e.target.value),
//                         })
//                       }
//                       className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                     Source / Batch ID
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Origin info..."
//                     required
//                     value={formData.source}
//                     onChange={(e) =>
//                       setFormData({ ...formData, source: e.target.value })
//                     }
//                     className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                     Expiry Date
//                   </label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.expiryDate}
//                     onChange={(e) =>
//                       setFormData({ ...formData, expiryDate: e.target.value })
//                     }
//                     className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
//                   />
//                 </div>
//                 <button
//                   disabled={isSubmitting}
//                   className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase text-[11px] hover:bg-red-600 transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-200 mt-2"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="animate-spin" size={16} />
//                   ) : (
//                     "Authorize Entry"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* RIGHT: INVENTORY LIST */}
//           <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
//             {/* TABS - Horizontal Scrollable */}
//             <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1 overflow-x-auto no-scrollbar">
//               {["All", ...BLOOD_GROUPS].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase transition-all whitespace-nowrap ${
//                     activeTab === tab
//                       ? "bg-slate-900 text-white shadow-md"
//                       : "text-slate-600 hover:bg-slate-50"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[600px]">
//               {/* Search Bar */}
//               <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center gap-4 bg-white sticky top-0 z-10">
//                 <div className="relative flex-1">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
//                     size={14}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search source..."
//                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold focus:ring-0"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <div className="hidden sm:flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">
//                     Live Vault
//                   </span>
//                 </div>
//               </div>

//               {/* Responsive Table / Card View */}
//               <div className="overflow-y-auto no-scrollbar">
//                 {/* Desktop Header - Hidden on Mobile */}
//                 <table className="w-full text-left border-collapse">
//                   <thead className="hidden md:table-header-group bg-slate-50/80 sticky top-0 z-10">
//                     <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
//                       <th className="p-5">Type</th>
//                       <th className="p-5">Origin</th>
//                       <th className="p-5 text-center">Qty</th>
//                       <th className="p-5">Expiry</th>
//                       <th className="p-5 text-right">Action</th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-50">
//                     {filteredInventory.length > 0 ? (
//                       filteredInventory.map((item: any) => {
//                         const isExpired =
//                           new Date(item.expiryDate) < new Date();
//                         return (
//                           <React.Fragment key={item._id}>
//                             {/* Desktop Row */}
//                             <tr className="hidden md:table-row hover:bg-slate-50/80 transition-all group">
//                               <td className="p-5">
//                                 <div className="h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl font-black text-sm">
//                                   {item.bloodGroup}
//                                 </div>
//                               </td>
//                               <td className="p-5">
//                                 <p className="font-black text-slate-800 text-sm truncate max-w-[150px]">
//                                   {item.source}
//                                 </p>
//                                 <p className="text-[9px] font-bold text-slate-400 uppercase">
//                                   ID: {item._id.substring(0, 6)}
//                                 </p>
//                               </td>
//                               <td className="p-5 text-center font-black text-slate-700 text-sm">
//                                 {item.units}u
//                               </td>
//                               <td className="p-5">
//                                 <div
//                                   className={`flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full w-fit ${
//                                     isExpired
//                                       ? "bg-red-50 text-red-600"
//                                       : "bg-emerald-50 text-emerald-600"
//                                   }`}
//                                 >
//                                   {new Date(
//                                     item.expiryDate
//                                   ).toLocaleDateString()}
//                                 </div>
//                               </td>
//                               <td className="p-5 text-right">
//                                 <AlertDialog>
//                                   <AlertDialogTrigger asChild>
//                                     <button className="p-2 text-slate-600 hover:text-red-600 transition-all">
//                                       <Trash2 size={16} />
//                                     </button>
//                                   </AlertDialogTrigger>
//                                   <AlertDialogContent className="rounded-3xl max-w-[90vw] md:max-w-md">
//                                     <AlertDialogHeader>
//                                       <AlertDialogTitle className="font-black italic uppercase">
//                                         Confirm Purge
//                                       </AlertDialogTitle>
//                                       <AlertDialogDescription className="text-xs">
//                                         Removing {item.units}u of{" "}
//                                         {item.bloodGroup}. This cannot be
//                                         undone.
//                                       </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                       <AlertDialogCancel className="rounded-xl text-[10px] font-black uppercase">
//                                         Abort
//                                       </AlertDialogCancel>
//                                       <AlertDialogAction
//                                         onClick={() => deleteStock(item._id)}
//                                         className="rounded-xl text-[10px] font-black uppercase bg-red-600"
//                                       >
//                                         Purge
//                                       </AlertDialogAction>
//                                     </AlertDialogFooter>
//                                   </AlertDialogContent>
//                                 </AlertDialog>
//                               </td>
//                             </tr>

//                             {/* Mobile Card View - Hidden on Desktop */}
//                             <div className="md:hidden p-4 flex items-center justify-between hover:bg-slate-50">
//                               <div className="flex items-center gap-3">
//                                 <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-slate-900 text-white rounded-xl font-black text-lg">
//                                   {item.bloodGroup}
//                                 </div>
//                                 <div className="space-y-0.5">
//                                   <p className="font-black text-slate-800 text-sm">
//                                     {item.source}
//                                   </p>
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded uppercase">
//                                       {item.units} Units
//                                     </span>
//                                     <span
//                                       className={`text-[9px] font-bold ${
//                                         isExpired
//                                           ? "text-red-500"
//                                           : "text-emerald-600"
//                                       }`}
//                                     >
//                                       Exp:{" "}
//                                       {new Date(
//                                         item.expiryDate
//                                       ).toLocaleDateString()}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <button className="p-3 text-slate-300">
//                                     <Trash2 size={18} />
//                                   </button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent className="rounded-3xl w-[90%]">
//                                   <AlertDialogHeader>
//                                     <AlertDialogTitle className="font-black italic uppercase">
//                                       Purge?
//                                     </AlertDialogTitle>
//                                   </AlertDialogHeader>
//                                   <AlertDialogFooter className="flex-row gap-2">
//                                     <AlertDialogCancel className="flex-1 rounded-xl text-[10px] font-black">
//                                       NO
//                                     </AlertDialogCancel>
//                                     <AlertDialogAction
//                                       onClick={() => deleteStock(item._id)}
//                                       className="flex-1 rounded-xl text-[10px] font-black bg-red-600"
//                                     >
//                                       YES
//                                     </AlertDialogAction>
//                                   </AlertDialogFooter>
//                                 </AlertDialogContent>
//                               </AlertDialog>
//                             </div>
//                           </React.Fragment>
//                         );
//                       })
//                     ) : (
//                       <div className="p-16 text-center">
//                         <Package
//                           className="mx-auto text-slate-200 mb-2"
//                           size={32}
//                         />
//                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
//                           No stock found
//                         </p>
//                       </div>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Package, Search, Loader2, Edit3, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function HospitalInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bloodGroup: "O+",
    units: 1,
    source: "",
    expiryDate: "",
  });

  const fetchInventory = async () => {
    try {
      const res = await axios.get("/api/admin/inventory");
      setInventory(res.data.data);
    } catch (err) {
      toast.error(`Failed to sync with vault: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStats = (group: string) => {
    return inventory
      .filter((item: any) => item.bloodGroup === group)
      .reduce((acc, curr: any) => acc + (curr.units || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.patch(`/api/admin/inventory/${editingId}`, formData);
        toast.success("Unit Record Updated");
      } else {
        await axios.post("/api/admin/inventory", formData);
        toast.success("Units Registered to Vault");
      }
      
      setEditingId(null);
      setFormData({ bloodGroup: "O+", source: "", units: 1, expiryDate: "" });
      fetchInventory();
    } catch (err) {
      toast.error(`Database write error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setFormData({
      bloodGroup: item.bloodGroup,
      units: item.units,
      source: item.source,
      expiryDate: new Date(item.expiryDate).toISOString().split('T')[0],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteStock = async (id: string) => {
    try {
      await axios.delete(`/api/admin/inventory/${id}`);
      setInventory((prev) => prev.filter((item: any) => item._id !== id));
      toast.success("Unit Purged from Storage");
      if(editingId === id) setEditingId(null);
    } catch (err) {
      toast.error(`Deletion failed: ${err}`);
    }
  };

  const filteredInventory = inventory.filter((item: any) => {
    const matchesTab = activeTab === "All" || item.bloodGroup === activeTab;
    const matchesSearch = item.source
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Accessing Secure Vault...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
            Hospital <span className="text-red-600">Inventory</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
            Central Blood Bank Management System
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
          {BLOOD_GROUPS.map((group) => {
            const count = getStats(group);
            return (
              <div
                key={group}
                className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center transition-all hover:border-red-100"
              >
                <span className="text-[25px] font-black text-slate-400 uppercase">
                  {group}
                </span>
                <span
                  className={`text-lg md:text-xl font-black ${
                    count < 5 ? "text-red-600" : "text-green-500"
                  }`}
                >
                  {count} <span className="text-[12px]">u</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* LEFT: FORM */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border transition-all ${editingId ? 'border-blue-500' : 'border-slate-100'} lg:sticky lg:top-8`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 ${editingId ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center`}>
                    {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
                  </div>
                  <h2 className="text-lg font-black uppercase italic tracking-tight">
                    {editingId ? "Modify Record" : "Add New Stock"}
                  </h2>
                </div>
                {editingId && (
                  <button 
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ bloodGroup: "O+", source: "", units: 1, expiryDate: "" });
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Units</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) })}
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Source / Batch ID</label>
                  <input
                    type="text"
                    placeholder="Origin info..."
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl p-3.5 font-bold text-sm"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-red-600'} text-white p-4 rounded-xl font-black uppercase text-[11px] transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-200 mt-2`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? "Update Record" : "Authorize Entry")}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: LIST */}
          <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1 overflow-x-auto no-scrollbar">
              {["All", ...BLOOD_GROUPS].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase transition-all whitespace-nowrap ${
                    activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center gap-4 bg-white sticky top-0 z-10">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="text"
                    placeholder="Search source..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold focus:ring-0"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">Live Vault</span>
                </div>
              </div>

              <div className="overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="hidden md:table-header-group bg-slate-50/80 sticky top-0 z-10">
                    <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                      <th className="p-5">Type</th>
                      <th className="p-5">Origin</th>
                      <th className="p-5 text-center">Qty</th>
                      <th className="p-5">Expiry</th>
                      <th className="p-5 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item: any) => {
                        const isExpired = new Date(item.expiryDate) < new Date();
                        return (
                          <React.Fragment key={item._id}>
                            {/* Desktop Row */}
                            <tr className={`hidden md:table-row hover:bg-slate-50/80 transition-all group ${editingId === item._id ? 'bg-blue-50/50' : ''}`}>
                              <td className="p-5">
                                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl font-black text-sm">
                                  {item.bloodGroup}
                                </div>
                              </td>
                              <td className="p-5">
                                <p className="font-black text-slate-800 text-sm truncate max-w-[150px]">{item.source}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {item._id.substring(0, 6)}</p>
                              </td>
                              <td className="p-5 text-center font-black text-slate-700 text-sm">{item.units}u</td>
                              <td className="p-5">
                                <div className={`flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full w-fit ${isExpired ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                  {new Date(item.expiryDate).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-5 text-right">
                                <div className="flex justify-end gap-1">
                                  <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className="p-2 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-3xl max-w-[90vw] md:max-w-md">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="font-black italic uppercase">Confirm Purge</AlertDialogTitle>
                                        <AlertDialogDescription className="text-xs">Removing {item.units}u of {item.bloodGroup}. This cannot be undone.</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl text-[10px] font-black uppercase">Abort</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteStock(item._id)} className="rounded-xl text-[10px] font-black uppercase bg-red-600">Purge</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>

                            {/* Corrected Mobile Card View */}
                            <tr className="md:hidden">
                              <td colSpan={5} className="p-0">
                                <div className={`p-4 flex items-center justify-between hover:bg-slate-50 ${editingId === item._id ? 'bg-blue-50' : ''}`}>
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-slate-900 text-white rounded-xl font-black text-lg">{item.bloodGroup}</div>
                                    <div className="space-y-0.5">
                                      <p className="font-black text-slate-800 text-sm">{item.source}</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded uppercase">{item.units} Units</span>
                                        <span className={`text-[9px] font-bold ${isExpired ? "text-red-500" : "text-emerald-600"}`}>
                                          Exp: {new Date(item.expiryDate).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <button onClick={() => handleEditClick(item)} className="p-3 text-slate-300 hover:text-blue-600"><Edit3 size={18} /></button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button className="p-3 text-slate-300 hover:text-red-600"><Trash2 size={18} /></button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="rounded-3xl w-[90%]">
                                        <AlertDialogHeader><AlertDialogTitle className="font-black italic uppercase">Purge?</AlertDialogTitle></AlertDialogHeader>
                                        <AlertDialogFooter className="flex-row gap-2">
                                          <AlertDialogCancel className="flex-1 rounded-xl text-[10px] font-black">NO</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteStock(item._id)} className="flex-1 rounded-xl text-[10px] font-black bg-red-600">YES</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      /* Corrected Empty State */
                      <tr>
                        <td colSpan={5} className="p-16 text-center">
                          <Package className="mx-auto text-slate-200 mb-2" size={32} />
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No stock found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}