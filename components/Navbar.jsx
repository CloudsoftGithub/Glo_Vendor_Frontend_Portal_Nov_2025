'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="font-bold text-xl text-blue-600">GloVendor</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
              <Link href="/admin_login" className="text-gray-700 hover:text-blue-600">
              Admin Login
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link href="/customer_login" className="text-gray-700 hover:text-green-600">
              Customer Login
            </Link>
            <Link href="/customer_signup" className="text-gray-700 hover:text-yellow-500">
              Customer Signup
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white">
          <Link
            href="/login"
            className="block px-3 py-2 rounded text-gray-700 hover:bg-blue-50"
            onClick={() => setIsOpen(false)}
          >
            Aggregator Login
          </Link>
          <Link
            href="/customer_login"
            className="block px-3 py-2 rounded text-gray-700 hover:bg-green-50"
            onClick={() => setIsOpen(false)}
          >
            Customer Login
          </Link>
          <Link
            href="/customer_signup"
            className="block px-3 py-2 rounded text-gray-700 hover:bg-yellow-50"
            onClick={() => setIsOpen(false)}
          >
            Customer Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
