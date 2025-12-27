"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShieldCheck,
  UserCheck,
  Search,
  MapPin,
  Loader2,
  Trash2,
  Users,
  Mail,
  Droplets,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Shadcn UI Imports
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

type Role = "donor" | "receiver" | "admin";
type TabRole = Role | "all";

export default function AdminVerifications() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabRole>("all");

  const fetchUnverified = async (tab: TabRole) => {
    setLoading(true);
    try {
      const roleParam = tab === "all" ? "" : tab;
      const res = await axios.get(`/api/admin/verify?role=${roleParam}`);
      setUsers(res.data);
    } catch (error: any) {
      toast.error(`Failed to load records ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified(activeTab);
  }, [activeTab]);

  const handleVerify = async (userId: string) => {
    try {
      await axios.patch("/api/admin/verify", { userId, status: true });
      toast.success("User Verified Successfully");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error: any) {
      toast.error(`Verification failed: ${error.response?.data?.error}`);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/verify?userId=${userId}`);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.response?.data?.error}`);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "donor":
        return "bg-red-100 text-red-700 border-red-200";
      case "receiver":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header & Search - Stacked on mobile, row on desktop */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="w-full lg:w-auto">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
              <ShieldCheck className="text-red-600 shrink-0" size={32} />
              Platform Moderation
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Manage pending registration requests.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Role Tabs - Horizontal scrollable on mobile */}
        <div className="flex p-1.5 bg-gray-200/50 rounded-2xl mb-8 w-full md:w-fit gap-1 overflow-x-auto no-scrollbar">
          {(["all", "donor", "receiver", "admin"] as TabRole[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap min-w-[100px] flex-1 md:flex-none ${
                activeTab === tab
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? "All Users" : `${tab}s`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
            <p className="text-gray-400 font-bold tracking-tight uppercase text-xs">
              Fetching data...
            </p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">
                      User Details
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">
                      Role
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase text-gray-400">
                      Info
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-black shrink-0 ${
                              user.role === "admin"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-700">
                            {user.role !== "admin" && user.role !== "receiver"
                              ? user.bloodGroup
                              : "N/A"}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                            <MapPin size={10} />
                            {user.city || "Global"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleVerify(user._id)}
                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                          >
                            <UserCheck size={18} />
                          </button>
                          <DeleteDialog
                            user={user}
                            onDelete={() => handleDelete(user._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Card List */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-500">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {user.username}
                        </h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={10} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-50 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-black">
                        Blood Type
                      </span>
                      <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                        <Droplets size={14} /> {user.bloodGroup || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-black">
                        Location
                      </span>
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <MapPin size={14} /> {user.city || "Global"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(user._id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <UserCheck size={18} /> Approve
                    </button>
                    <div className="flex-1">
                      <DeleteDialog
                        user={user}
                        onDelete={() => handleDelete(user._id)}
                        isMobile
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200">
            <Users className="text-gray-200 mx-auto mb-4" size={64} />
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
              Queue Empty
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              No pending accounts found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for Delete Logic to keep code clean
function DeleteDialog({
  user,
  onDelete,
  isMobile = false,
}: {
  user: any;
  onDelete: () => void;
  isMobile?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={`${
            isMobile
              ? "w-full py-3 bg-red-50 text-red-600"
              : "p-2.5 bg-red-50 text-red-600"
          } rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all`}
        >
          <Trash2 size={18} /> {isMobile && "Reject"}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem] w-[90%] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black text-xl">
            Confirm Rejection
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 font-medium">
            Permanently delete{" "}
            <span className="text-red-600 font-bold">{user.username}</span>.
            This request will be removed from the system forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col md:flex-row gap-2 mt-4">
          <AlertDialogCancel className="rounded-xl font-bold md:mt-0">
            Wait, Go Back
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
