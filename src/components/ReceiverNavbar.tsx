"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // 1. Import signOut
import { 
  Home,
  PlusSquare, 
  ClipboardList, 
  Search, 
  Menu, 
  X, 
  Droplets,
  LogOut
} from "lucide-react";

export default function ReceiverNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Logout Handler
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Dashboard", href: "/receiver", icon: <Home size={18} /> },
    { name: "Request Blood", href: "/receiver/request", icon: <PlusSquare size={18} /> },
    { name: "My Requests", href: "/receiver/my-requests", icon: <ClipboardList size={18} /> },
    { name: "Find Donors", href: "/receiver/search", icon: <Search size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/receiver" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded-lg transition-transform group-hover:scale-105">
                <Droplets className="text-white" size={20} />
              </div>
              <span className="font-black text-xl text-gray-800 tracking-tight">
                LifeFlow <span className="text-red-600 font-medium text-sm">HOSPITAL</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-red-600 text-white shadow-md shadow-red-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            
            {/* Desktop Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 font-bold text-sm" 
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                  isActive ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
          
          {/* Mobile Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-bold border-t border-gray-50 mt-2 active:bg-red-50"
          >
            <LogOut size={18} />
            Logout Account
          </button>
        </div>
      )}
    </nav>
  );
}