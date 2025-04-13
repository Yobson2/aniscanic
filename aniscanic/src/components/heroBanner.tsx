'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=1920&q=80"
          alt="Manga Background"
          className="object-cover w-full h-full"
          fill
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Plongez dans l'univers{' '}
            <span className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] bg-clip-text text-transparent">
              manga
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-10">
            Découvrez, lisez et vivez vos histoires préférées dans un monde où l'imagination n'a pas de limites.
          </p>
          <Button className="flex items-center gap-2 bg-[#FF4655] text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-[#FFD369] hover:text-black transition-all duration-300 transform hover:scale-105">
            Explorer maintenant
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
