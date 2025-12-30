"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ClipboardList, LogOut, 
  ShieldCheck, Menu, X, FileBarChart, UserCheck, 
  Database
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "User Management", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Verifications", href: "/admin/verifications", icon: <UserCheck size={20} /> },
    { name: "Request Logs", href: "/admin/requests", icon: <ClipboardList size={20} /> },
    { name: "Inventory", href: "/admin/inventory", icon: <Database size={20} /> },
    { name: "Analytics Reports", href: "/admin/reports", icon: <FileBarChart size={20} /> },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 border-b sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <ShieldCheck size={24} />
          <span>AdminHub</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Sidebar Logo */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-md">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-xl text-gray-800">AdminHub</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}

            {/* Logout Button - Now inside the nav list */}
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 font-bold hover:text-red-600 hover:bg-red-50 rounded-xl transition-all mt-2 hover:cursor-pointer"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}