'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className='w-full relative py-24 overflow-hidden" '>
        
        <div className="absolute inset-0">
          {/* <Image
            src="https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=1920&q=80" 
            alt="Background" 
            className="w-full h-full object-cover"
            width={16}
            height={16}
          /> */}
          <div className="absolute inset-0 bg-black bg-opacity-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Restez connecté</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Recevez en avant-première les dernières sorties manga et les actualités de la communauté
          </p>
          <div className="flex max-w-md mx-auto">
            {/* <input 
              type="email" 
              placeholder="Votre email" 
              className="flex-1 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#FF4655]"
            /> */}
            {/* <button className="bg-[#FF4655] text-white px-8 rounded-r-full hover:bg-[#FFD369] hover:text-gray-900 transition-colors">
              S'inscrire
            </button> */}
          </div>
        </div>
     
     
    </footer>
  )
}