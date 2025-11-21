// components/Navbar.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, Users, User, UserPlus, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow/background effect only when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled || isOpen
          ? 'bg-white/90 backdrop-blur-md border-gray-200 shadow-sm'
          : 'bg-white/50 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                GloVendor
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Login Links Group */}
            <div className="flex items-center gap-5 text-sm font-medium text-gray-600">
              <Link href="/admin_login" className="hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Aggregator
              </Link>
              <div className="h-4 w-px bg-gray-300"></div> {/* Divider */}
              <Link href="/customer_login" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <User size={16} />
                Login
              </Link>
            </div>

            {/* Primary Action Button */}
            <Link
              href="/customer_signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Sign Up</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Mobile Toggler */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[400px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Portals
          </p>
          
          <MobileLink 
            href="/admin_login" 
            icon={<Shield size={18} />} 
            label="Admin Portal" 
            onClick={() => setIsOpen(false)} 
          />
          <MobileLink 
            href="/login" 
            icon={<Users size={18} />} 
            label="Aggregator Portal" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="my-2 border-t border-gray-100"></div>
          
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Customer
          </p>
          
          <MobileLink 
            href="/customer_login" 
            icon={<User size={18} />} 
            label="Customer Login" 
            onClick={() => setIsOpen(false)} 
          />
          
          <Link
            href="/customer_signup"
            onClick={() => setIsOpen(false)}
            className="mt-4 block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform flex justify-center items-center gap-2"
          >
            <UserPlus size={18} />
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Helper Component for Mobile Links to keep code clean
function MobileLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
    >
      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}