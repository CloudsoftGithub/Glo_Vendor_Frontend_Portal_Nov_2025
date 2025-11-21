'use client'; // Added this directive to resolve the build error

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Shield, Users, User, UserPlus, ChevronRight, Zap, TrendingUp, DollarSign, RefreshCw, Smartphone, Package } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Start: Navbar Component and Helpers (Reusing the previous modern update) ---

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

// Mock Link component for the single-file environment
const Link = ({ href, className, children, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);


function Navbar() {
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

  const closeMenu = useCallback(() => setIsOpen(false), []);

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
            onClick={closeMenu} 
          />
          <MobileLink 
            href="/login" 
            icon={<Users size={18} />} 
            label="Aggregator Portal" 
            onClick={closeMenu} 
          />
          
          <div className="my-2 border-t border-gray-100"></div>
          
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Customer
          </p>
          
          <MobileLink 
            href="/customer_login" 
            icon={<User size={18} />} 
            label="Customer Login" 
            onClick={closeMenu} 
          />
          
          <Link
            href="/customer_signup"
            onClick={closeMenu}
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
// --- End: Navbar Component ---


// Animation variants for staggered load
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Main App Component (replacing Home)
export default function App() {

  const features = [
    { 
      title: "Aggregator / Distributor", 
      icon: <Users className="text-blue-500" size={24} />, 
      description: "Manage sub-vendors, distribute stock, and oversee large-scale operations with powerful analytics." 
    },
    { 
      title: "Subvendor & Retailer", 
      icon: <TrendingUp className="text-yellow-500" size={24} />, 
      description: "Fast-track airtime and data sales. Get real-time stock balances and transaction history." 
    },
    { 
      title: "Instant Glo ERS Integration", 
      icon: <Zap className="text-green-500" size={24} />, 
      description: "Direct, high-speed connection to Glo ERS for immediate fulfillment of all digital transactions." 
    },
    { 
      title: "Customer Management", 
      icon: <Smartphone className="text-indigo-500" size={24} />, 
      description: "Seamlessly manage customer data, track purchases, and offer personalized packages efficiently." 
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navbar - defined above */}
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* HERO SECTION */}
          <section className="py-12 md:py-20">
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter max-w-5xl mx-auto"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-500 block">
                GloVendor
              </span> 
              <span className="text-gray-900 block mt-2 md:mt-4">
                The <span className="text-blue-600">ERS Reseller Portal</span>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mt-6"
            >
              A powerful, modern platform for <span className="font-semibold text-green-700">Aggregators, Subvendors & Retailers</span> to manage airtime and data distribution, seamlessly powered by Glo ERS Integration.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href="/customer_signup"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/30 active:scale-[.98] flex items-center justify-center gap-2 text-lg"
                >
                  Get Started for Free
                  <ChevronRight size={20} />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors active:scale-[.98] flex items-center justify-center gap-2 text-lg"
                >
                  Aggregator Login
                  <Users size={20} />
                </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              variants={itemVariants}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
              className="mt-16"
            >
              <DollarSign className="w-8 h-8 text-green-600 mx-auto" />
            </motion.div>
          </section>

          {/* FEATURE GRID / VALUE PROPOSITION */}
          <section className="mt-12 md:mt-24">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Key Platform Features
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
              Built for speed, reliability, and modern distribution challenges.
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white border border-gray-100 p-6 rounded-3xl text-left shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-3 bg-gray-100 rounded-xl inline-flex mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* HIERARCHY STRUCTURE (The original content, modernized) */}
          <section className="mt-16 md:mt-24 bg-gray-50 rounded-3xl p-6 sm:p-10 md:p-16 border border-gray-100 shadow-inner">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
              ERS Distribution Flow
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 text-md mb-10 max-w-xl mx-auto">
              Visualizing the digital recharge path from the source to the end consumer.
            </motion.p>

            <div className="flex flex-col items-center space-y-4">
              {[
                { color: 'bg-green-600', label: 'Glo Nigeria (Root ERS)', icon: <Package size={20}/> },
                { color: 'bg-blue-600', label: 'Aggregator / Distributor', icon: <Users size={20}/> },
                { color: 'bg-yellow-500', label: 'Subvendor', icon: <TrendingUp size={20}/> },
                { color: 'bg-orange-500', label: 'Retailer / Agent', icon: <DollarSign size={20}/> },
                { color: 'bg-gray-900', label: 'Customer (End User)', icon: <Smartphone size={20}/> },
              ].map((level, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    custom={index}
                    variants={itemVariants}
                    className={`${
                      level.color
                    } text-white px-6 py-3 rounded-full font-bold shadow-lg w-full max-w-xs text-sm sm:text-base text-center flex items-center justify-center gap-3`}
                  >
                    {level.icon} {level.label}
                  </motion.div>

                  {index < 4 && (
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: index * 0.2 }}
                      className="mt-1 mb-1 p-1"
                    >
                      <ArrowDownAnimated />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <motion.footer
            variants={itemVariants}
            className="mt-20 py-8 border-t border-gray-100 text-gray-500 text-xs sm:text-sm text-center"
          >
            <p>© {new Date().getFullYear()} GloVendor • Secure Digital Reseller Platform</p>
            <p className="mt-1">
              Developed by <span className="font-semibold text-gray-700">Cloudsoft Consulting Ltd</span>
            </p>
          </motion.footer>

        </motion.div>
      </main>
    </div>
  );
}

// Helper component for the animated arrow
const ArrowDownAnimated = () => (
  <RefreshCw className="w-5 h-5 text-gray-400 rotate-90" />
);