"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ClipboardList, LogOut, 
  ShieldCheck, Menu, X, FileBarChart, UserCheck, 
  Database, PackagePlus, ChevronRight, User
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "User Management", href: "/admin/users", icon: <Users size={18} /> },
    { name: "Verifications", href: "/admin/verifications", icon: <UserCheck size={18} /> },
    { 
      name: "Process Donation", 
      href: "/admin/process-donation", 
      icon: <PackagePlus size={18} />,
    },
    { name: "Request Logs", href: "/admin/requests", icon: <ClipboardList size={18} /> },
    { name: "Inventory", href: "/admin/inventory", icon: <Database size={18} /> },
    { name: "Analytics", href: "/admin/reports", icon: <FileBarChart size={18} /> },
  ];

  return (
    <>
      {/* MOBILE TOP BAR - Tightened padding */}
      <div className="lg:hidden flex items-center justify-between bg-white px-5 py-3 border-b sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <ShieldCheck size={22} />
          <span className="tracking-tight">AdminHub</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* SIDEBAR - Removed p-6, used more precise spacing */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Logo - Reduced margin, added border-b */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-50 mb-4">
            <div className="bg-red-600 p-1.5 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-lg text-gray-800 tracking-tight">AdminHub</span>
          </div>

          {/* Navigation Items - Removed bg-gray-50 from inactive items */}
          <nav className="px-3 space-y-0.5 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
                    isActive 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* THREE-STEP NESTED LOGOUT SECTION */}
          <div className="p-4 border-t border-gray-50 bg-gray-50/30">
            {!showLogoutConfirm ? (
              // Step 1: Profile View
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-between w-full p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-gray-800">Root Admin</p>
                    <p className="text-[10px] text-gray-400">Manage Session</p>
                  </div>
                </div>
                <LogOut size={14} className="text-gray-300 group-hover:text-red-500" />
              </button>
            ) : (
              // Step 2 & 3: Confirmation View
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-wider">End current session?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2 text-[11px] font-bold text-gray-500 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex-1 py-2 text-[11px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}