'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { BookOpen, Brain, Menu, Moon, Search, Trophy, Video } from 'lucide-react';
import { routes } from '@/constants';



const Header : React.FC =({}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <header className={` ${isDarkMode ? 'bg-[#1F1F1F] text-[#F5F5F5]' : 'bg-gray-50 text-gray-900'}`}>
         <nav className="fixed w-full z-50 bg-transparent backdrop-blur-md bg-opacity-80 text-white ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href={routes.home}className="text-3xl font-bold bg-gradient-to-r from-[#FF4655] to-[#FFD369] bg-clip-text text-transparent">
                ANISCANIC
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href={routes.manga} className="flex items-center space-x-1 hover:text-[#FFD369] transition-colors">
                <BookOpen size={20} />
                <span>Manga</span>
              </Link>
              <Link href={routes.movie} className="flex items-center space-x-1 hover:text-[#FFD369] transition-colors">
                <Video size={20} />
                <span>Vidéos</span>
              </Link>
              <Link href={routes.quiz} className="flex items-center space-x-1 hover:text-[#FFD369] transition-colors">
                <Brain size={20} />
                <span>Quiz</span>
              </Link>
              <Link href={routes.ranking} className="flex items-center space-x-1 hover:text-[#FFD369] transition-colors">
                <Trophy size={20} />
                <span>Classement</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
            {/* onClick={() => setIsDarkMode(!isDarkMode)}  */}
              <button className="p-2 hover:bg-[#FFD369] rounded-full transition-colors">
                <Moon size={20} />
              </button>
              <button className="p-2 hover:bg-[#FFD369] rounded-full transition-colors">
                <Search size={20} />
              </button>
              <button className="md:hidden p-2 hover:bg-[#FFD369] rounded-full transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      
    </header>
  )
}


export default Header;