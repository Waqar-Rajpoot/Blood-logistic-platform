"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Droplets, Home, Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "About Us", href: "/about", icon: <Info size={18} /> },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 font-black text-2xl text-gray-800 shrink-0">
            <Droplets className="text-red-600" size={28} /> 
            <span>LifeFlow</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1 font-bold transition-colors ${
                  pathname === link.href ? "text-red-600" : "text-gray-600 hover:text-red-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-red-100"
            >
              Login
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-red-600 p-2 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t
        ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                pathname === link.href ? "bg-red-50 text-red-600" : "text-gray-600"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/login"
              className="flex justify-center bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}