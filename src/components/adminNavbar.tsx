"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ClipboardList, LogOut, 
  ShieldCheck, Menu, X, FileBarChart, UserCheck, 
  Database, PackagePlus, ChevronRight, User, Droplets
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={19} /> },
    { name: "User Management", href: "/admin/users", icon: <Users size={19} /> },
    { name: "Verifications", href: "/admin/verifications", icon: <UserCheck size={19} /> },
    { name: "Process Donation", href: "/admin/process-donation", icon: <PackagePlus size={19} /> },
    { name: "Request Logs", href: "/admin/requests", icon: <ClipboardList size={19} /> },
    { name: "Inventory", href: "/admin/inventory", icon: <Database size={19} /> },
    { name: "Analytics", href: "/admin/reports", icon: <FileBarChart size={19} /> },
  ];

  return (
    <>
      {/* MOBILE TOP BAR - Fixed at top */}
      <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b fixed top-0 z-[60] w-full shadow-sm">
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <div className="relative">
             <Droplets size={24} className="animate-pulse" />
             <ShieldCheck size={12} className="absolute -bottom-1 -right-1 text-gray-900 bg-white rounded-full" />
          </div>
          <span className="tracking-tighter text-xl font-black uppercase italic">Pulse Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-100 active:scale-95 transition-transform"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-white border-r border-gray-100 shadow-2xl transition-all duration-500 ease-in-out lg:shadow-none
        lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          
          {/* Sidebar Logo Section */}
          <div className="px-8 pt-10 pb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200 text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="font-black text-xl text-gray-900 tracking-tight leading-none">Admin PULSE</h2>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Logistic Hub</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold transition-all duration-200 text-sm ${
                    isActive 
                      ? "bg-red-600 text-white shadow-lg shadow-red-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-red-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-red-500 transition-colors"}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                  {isActive && <ChevronRight size={16} className="opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* Admin Profile & Logout */}
          <div className="p-6 mt-auto">
            <div className={`p-4 rounded-[2rem] transition-all duration-300 ${showLogoutConfirm ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"}`}>
              {!showLogoutConfirm ? (
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-3 w-full group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-600 border border-gray-100">
                    <User size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-black text-gray-900">Root Admin</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">System Manager</p>
                  </div>
                  <LogOut size={16} className="text-gray-300 group-hover:text-red-600 transition-colors" />
                </button>
              ) : (
                <div className="space-y-3 py-1">
                  <p className="text-[11px] font-black text-center text-red-600 uppercase tracking-tighter">Sign out of AdminHub?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 py-2 text-[10px] font-black text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      STAY
                    </button>
                    <button 
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex-1 py-2 text-[10px] font-black text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-200"
                    >
                      EXIT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[80] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}