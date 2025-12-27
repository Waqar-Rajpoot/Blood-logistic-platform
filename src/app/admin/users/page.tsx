// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { 
//   Search, Trash2, ShieldCheck, UserCog,
//   Mail, CheckCircle, XCircle, Loader2, ChevronDown, RotateCw
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// // Shadcn UI Components
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   role: "donor" | "receiver" | "admin";
//   bloodGroup: string;
//   isVerified: boolean;
//   createdAt: string;
// }

// type FilterRole = "all" | "donor" | "receiver" | "admin";

// export default function UserManagement() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<FilterRole>("all");
//   const [actionLoading, setActionLoading] = useState<string | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/admin/users");
//       setUsers(res.data.users);
//     } catch (error) {
//       toast.error(`Failed to load users: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleVerification = async (id: string, currentStatus: boolean) => {
//     try {
//       setActionLoading(id);
//       await axios.patch(`/api/admin/users/${id}`, { isVerified: !currentStatus });
//       toast.success("Verification status updated");
//       setUsers(users.map(u => u._id === id ? { ...u, isVerified: !currentStatus } : u));
//     } catch (error) {
//       toast.error(`Update failed: ${error}`);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const updateRole = async (id: string, newRole: "donor" | "receiver" | "admin") => {
//     try {
//       setActionLoading(id);
//       await axios.patch(`/api/admin/users/${id}`, { role: newRole });
//       toast.success(`User is now an ${newRole.toUpperCase()}`);
//       setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
//     } catch (error) {
//       toast.error(`Role update failed: ${error}`);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const deleteUser = async (id: string) => {
//     try {
//       setActionLoading(id);
//       await axios.delete(`/api/admin/users/${id}`);
//       setUsers(users.filter(u => u._id !== id));
//       toast.success("User removed from system");
//     } catch (error) {
//       toast.error(`Deletion failed: ${error}`);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   // Filter Logic
//   const filteredUsers = useMemo(() => {
//     return users.filter(user => {
//       const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesTab = activeTab === "all" || user.role === activeTab;
//       return matchesSearch && matchesTab;
//     });
//   }, [users, searchTerm, activeTab]);

//   // Counts for Tabs
//   const counts = {
//     all: users.length,
//     donor: users.filter(u => u.role === 'donor').length,
//     receiver: users.filter(u => u.role === 'receiver').length,
//     admin: users.filter(u => u.role === 'admin').length,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
//               <UserCog className="text-red-600" /> User Management
//             </h1>
//             <p className="text-gray-500 mt-1 font-medium">Manage and verify community members.</p>
//           </div>

//           <div className="flex gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input 
//                 type="text"
//                 placeholder="Search database..."
//                 className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 w-64 text-sm font-medium shadow-sm text-black"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button 
//               onClick={fetchUsers} 
//               className="bg-white p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm group active:scale-95"
//             >
//               <RotateCw className={`${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`} size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Custom Navigation Tabs */}
//         <div className="flex flex-wrap items-center gap-2 mb-6">
//           {(['all', 'donor', 'receiver', 'admin'] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm border ${
//                 activeTab === tab 
//                 ? "bg-red-600 text-white border-red-600" 
//                 : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
//               }`}
//             >
//               {tab}
//               <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>
//                 {counts[tab]}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Table Container */}
//         <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
//           {loading ? (
//              <div className="py-24 text-center">
//                <Loader2 className="animate-spin mx-auto text-red-600 mb-4" size={40} />
//                <p className="font-bold text-gray-400">Syncing with database...</p>
//              </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 border-b border-gray-100">
//                   <tr>
//                     <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
//                     <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
//                     <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Blood</th>
//                     <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
//                     <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className={`hover:bg-gray-50/50 transition-colors ${actionLoading === user._id ? "opacity-50 pointer-events-none" : ""}`}>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black shadow-inner">
//                             {user.username.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="font-black text-gray-800 tracking-tight">{user.username}</p>
//                             <p className="text-xs text-gray-400 font-medium flex items-center gap-1"><Mail size={12}/> {user.email}</p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
//                                 user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' : 
//                                 user.role === 'donor' ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100'
//                             }`}>
//                               {user.role}
//                               <ChevronDown size={12} />
//                             </button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent className="rounded-xl font-bold p-2 min-w-[120px]">
//                             <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => updateRole(user._id, "donor")}>Donor</DropdownMenuItem>
//                             <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => updateRole(user._id, "receiver")}>Receiver</DropdownMenuItem>
//                             <DropdownMenuItem className="rounded-lg cursor-pointer text-purple-600" onClick={() => updateRole(user._id, "admin")}>Admin</DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <span className="font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg">{user.bloodGroup || "N/A"}</span>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className={`flex items-center gap-1.5 text-sm font-bold ${user.isVerified ? "text-green-600" : "text-gray-300"}`}>
//                           {user.isVerified ? <CheckCircle size={18} /> : <XCircle size={18} />}
//                           <span className="text-xs uppercase">{user.isVerified ? "Verified" : "Pending"}</span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex justify-end gap-2">
//                           <button 
//                             onClick={() => toggleVerification(user._id, user.isVerified)}
//                             className={`p-3 rounded-xl transition-all shadow-sm ${user.isVerified ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400 hover:text-green-600"}`}
//                             title="Toggle Verification"
//                           >
//                             <ShieldCheck size={20} />
//                           </button>

//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm">
//                                 <Trash2 size={20} />
//                               </button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="rounded-[2.5rem] border-none">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-2xl font-black">Confirm Deletion</AlertDialogTitle>
//                                 <AlertDialogDescription className="font-medium text-gray-500">
//                                   You are about to remove <span className="text-red-600 font-bold">{user.username}</span>. This action is irreversible.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter className="mt-4">
//                                 <AlertDialogCancel className="rounded-xl font-bold border-none bg-gray-100">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction 
//                                   onClick={() => deleteUser(user._id)}
//                                   className="rounded-xl font-bold bg-red-600 hover:bg-red-700"
//                                 >
//                                   Delete Permanently
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {filteredUsers.length === 0 && (
//                 <div className="p-24 text-center">
//                    <div className="inline-block p-6 rounded-full bg-gray-50 mb-4 text-gray-300">
//                       <UserCog size={48} />
//                    </div>
//                    <p className="text-gray-400 font-bold text-lg">No users found in this category.</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Trash2, ShieldCheck, UserCog,
  CheckCircle, XCircle, Loader2, ChevronDown, RotateCw,
  ChevronLeft, ChevronRight, User
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface User {
  _id: string;
  username: string;
  email: string;
  role: "donor" | "receiver" | "admin";
  bloodGroup: string;
  isVerified: boolean;
  createdAt: string;
}

type FilterRole = "all" | "donor" | "receiver" | "admin";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FilterRole>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      toast.error(`Failed to load users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || user.role === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [users, searchTerm, activeTab]);

  const getPageLimits = (page: number) => {
    if (page === 1) return { start: 0, end: 10 };
    const start = 10 + (page - 2) * 20;
    const end = start + 20;
    return { start, end };
  };

  const { start, end } = getPageLimits(currentPage);
  const paginatedUsers = filteredUsers.slice(start, end);
  const totalPages = Math.ceil((filteredUsers.length - 10) / 20) + 1;

  const counts = {
    all: users.length,
    donor: users.filter(u => u.role === 'donor').length,
    receiver: users.filter(u => u.role === 'receiver').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  // Handlers for verification, role, and delete (same as original code)
  const toggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await axios.patch(`/api/admin/users/${id}`, { isVerified: !currentStatus });
      toast.success("Status updated");
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: !currentStatus } : u));
    } catch (error) { toast.error(`Failed to update status: ${error}`); } 
    finally { setActionLoading(null); }
  };

  const updateRole = async (id: string, newRole: "donor" | "receiver" | "admin") => {
    try {
      setActionLoading(id);
      await axios.patch(`/api/admin/users/${id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) { toast.error(`Failed to update role: ${error}`); } 
    finally { setActionLoading(null); }
  };

  const deleteUser = async (id: string) => {
    try {
      setActionLoading(id);
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch (error) { toast.error(`Failed to delete user: ${error}`); } 
    finally { setActionLoading(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Stacks on mobile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
              <UserCog className="text-red-600" /> User Management
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm md:text-base">Manage and verify community members.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <button onClick={fetchUsers} className="bg-white p-2 border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all active:scale-95">
              <RotateCw className={`${loading ? "animate-spin" : ""} text-gray-600`} size={20} />
            </button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap items-center gap-2 mb-6 no-scrollbar">
          {(['all', 'donor', 'receiver', 'admin'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm ${
                activeTab === tab ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="animate-spin mx-auto text-red-600 mb-4" size={40} />
              <p className="font-bold text-gray-400">Syncing with database...</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Blood</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedUsers.map((user) => (
                      <TableRow key={user._id} user={user} actionLoading={actionLoading} toggleVerification={toggleVerification} updateRole={updateRole} deleteUser={deleteUser} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <MobileCard key={user._id} user={user} actionLoading={actionLoading} toggleVerification={toggleVerification} updateRole={updateRole} deleteUser={deleteUser} />
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-16 text-center text-gray-300">
                  <User size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="font-bold">No users found.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <p className="text-sm font-medium text-gray-500">
            Showing <span className="text-gray-900 font-bold">{start + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(end, filteredUsers.length)}</span> of {filteredUsers.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-white text-gray-500 border border-gray-200 hover:border-red-300"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || filteredUsers.length <= end}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracting TableRow for cleaner code
function TableRow({ user, actionLoading, toggleVerification, updateRole, deleteUser }: any) {
  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${actionLoading === user._id ? "opacity-50 pointer-events-none" : ""}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm">{user.username.charAt(0).toUpperCase()}</div>
          <div className="min-w-0">
            <p className="font-black text-gray-800 text-sm truncate">{user.username}</p>
            <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleDropdown user={user} updateRole={updateRole} />
      </td>
      <td className="px-6 py-4 text-center font-black text-red-600 text-sm">{user.bloodGroup || "-"}</td>
      <td className="px-6 py-4">
        <StatusBadge isVerified={user.isVerified} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1.5">
          <button onClick={() => toggleVerification(user._id, user.isVerified)} className={`p-2 rounded-lg transition-all ${user.isVerified ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}><ShieldCheck size={18} /></button>
          <DeleteAction user={user} deleteUser={deleteUser} />
        </div>
      </td>
    </tr>
  );
}

// Extracting MobileCard for Mobile Responsiveness

function MobileCard({ user, actionLoading, toggleVerification, updateRole, deleteUser }: any) {
  return (
    <div className={`p-5 space-y-4 ${actionLoading === user._id ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <p className="font-black text-gray-800 text-sm">{user.username}</p>
            <StatusBadge isVerified={user.isVerified} />
          </div>
        </div>
        <span className="font-black text-red-600 bg-red-50 px-2 py-1 rounded text-xs">{user.bloodGroup || "-"}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <RoleDropdown user={user} updateRole={updateRole} />
        <div className="flex gap-2">
          <button onClick={() => toggleVerification(user._id, user.isVerified)} className={`p-2.5 rounded-xl border ${user.isVerified ? "border-green-200 text-green-600" : "border-gray-200 text-gray-400"}`}><ShieldCheck size={20} /></button>
          <DeleteAction user={user} deleteUser={deleteUser} />
        </div>
      </div>
    </div>
  );
}

// Shared Sub-components
function StatusBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-[10px] font-bold ${isVerified ? "text-green-600" : "text-gray-300"}`}>
      {isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span className="uppercase">{isVerified ? "Verified" : "Pending"}</span>
    </div>
  );
}

function RoleDropdown({ user, updateRole }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
            user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
            user.role === 'donor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'
        }`}>
          {user.role} <ChevronDown size={10} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl font-bold">
        <DropdownMenuItem onClick={() => updateRole(user._id, "donor")}>Donor</DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateRole(user._id, "receiver")}>Receiver</DropdownMenuItem>
        <DropdownMenuItem className="text-purple-600" onClick={() => updateRole(user._id, "admin")}>Admin</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteAction({ user, deleteUser }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl max-w-[90%] md:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black text-xl">Delete User?</AlertDialogTitle>
          <AlertDialogDescription className="font-medium">Remove <span className="text-red-600">{user.username}</span> permanently?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col md:flex-row gap-2">
          <AlertDialogCancel className="rounded-xl font-bold border-none bg-gray-100">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteUser(user._id)} className="rounded-xl font-bold bg-red-600">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}