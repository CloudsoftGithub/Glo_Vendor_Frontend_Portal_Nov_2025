// pages/index.jsx
'use client';
import Navbar from '@/components/Navbar';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const fadeDown = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Reduced delay for faster animation
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow flex flex-col items-center px-3 pt-24 text-center">

        {/* HERO TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight max-w-3xl"
        >
          GloVendor Reseller Portal
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-700 text-sm sm:text-base md:text-lg max-w-lg sm:max-w-xl mt-3 leading-relaxed"
        >
          A modern platform for{' '}
          <span className="font-semibold text-blue-700">Aggregators, Subvendors & Retailers</span>{' '}
          to manage airtime and data distribution powered by{' '}
          <strong>Glo ERS Integration</strong>.
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="mt-4"
        >
          <ArrowDown className="w-6 h-6 text-blue-600 opacity-70" />
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 w-full flex justify-center"
        >
          <img
            src="/Hero.png"
            alt="GloVendor Hero"
            className="w-full max-w-[250px] sm:max-w-sm md:max-w-lg lg:max-w-xl object-contain rounded-3xl shadow-lg"
          />
        </motion.div>

        {/* Hierarchy Section */}
        <motion.section
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 bg-white shadow-lg rounded-3xl p-5 sm:p-7 md:p-10 w-full max-w-xl sm:max-w-2xl"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-3">
            Glo ERS Hierarchy Structure
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6">
            How digital recharge flows through reseller levels from Glo HQ to end users.
          </p>

          <div className="flex flex-col items-center space-y-4">
            {[
              { color: 'bg-green-600', label: 'Glo Nigeria (Root ERS)' },
              { color: 'bg-blue-600', label: 'Aggregator / Distributor' },
              { color: 'bg-yellow-500', label: 'Subvendor' },
              { color: 'bg-orange-500', label: 'Retailer / Agent' },
              { color: 'bg-gray-900', label: 'Customer (End User)' },
            ].map((level, index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeDown}
                  className={`${
                    level.color
                  } text-white px-4 py-2 rounded-xl font-semibold shadow-md w-44 sm:w-52 md:w-64 text-xs sm:text-sm md:text-base text-center`}
                >
                  {level.label}
                </motion.div>

                {index < 4 && (
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                    className="mt-1"
                  >
                    <ArrowDown className="w-4 h-4 text-gray-600" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 mb-8 text-gray-600 text-xs sm:text-sm text-center"
        >
          <p>© {new Date().getFullYear()} GloVendor • Powered by Glo ERS Integration</p>
          <p className="mt-1">
            Developed by <span className="font-semibold">Cloudsoft Consulting Ltd</span>
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
