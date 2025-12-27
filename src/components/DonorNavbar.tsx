"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Bell, 
  History, 
  User, 
  Menu, 
  X, 
  Droplets,
  LogOut
} from "lucide-react";

export default function DonorNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Logout Handler
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { name: "Dashboard", href: "/donor", icon: <LayoutDashboard size={18} /> },
    { name: "Alerts", href: "/donor/alerts", icon: <Bell size={18} /> },
    { name: "History", href: "/donor/history", icon: <History size={18} /> },
    { name: "Profile", href: "/donor/profile", icon: <User size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/donor" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
                <Droplets className="text-white" size={20} />
              </div>
              <span className="font-black text-xl text-gray-800 tracking-tight">LifeFlow</span>
            </Link>
            <span className="text-sm font-bold pt-3 text-red-400 ml-1">Donor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-red-50 text-red-600" 
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
              <span className="md:hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                  isActive 
                    ? "bg-red-600 text-white" 
                    : "text-gray-600 hover:bg-gray-50"
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
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-bold border-t border-gray-100 mt-2 active:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}