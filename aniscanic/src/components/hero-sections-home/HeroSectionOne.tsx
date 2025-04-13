
'use client';

import React from 'react';
import Link from 'next/link';

interface Manga {
  title: string;
  image: string;
  genre: string;
  rating: string;
  chapters: string;
}

interface HeroSectionTwoProps {
  isDarkMode: boolean;
}

const mangas: Manga[] = [
  {
    title: "One Piece",
    image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=800&q=80",
    genre: "Shonen",
    rating: "4.9",
    chapters: "1089",
  },
  {
    title: "Attack on Titan",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    genre: "Seinen",
    rating: "4.8",
    chapters: "139",
  },
  {
    title: "Demon Slayer",
    image: "https://unsplash.com/photos/people-enjoying-a-meal-at-a-restaurant-tuSWVzA4kEg",
    genre: "Shonen",
    rating: "4.7",
    chapters: "205",
  },
];

const HeroSectionOne: React.FC<HeroSectionTwoProps> = ({ isDarkMode }) => {
  return (
    <section id="manga" className={`py-24 ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Mangas Tendance</h2>
            <p className="text-gray-500">Les séries qui font vibrer la communauté</p>
          </div>
          <Link href="/manga" className="text-[#FF4655] hover:text-[#FFD369] transition-colors">
            Voir tout →
          </Link>
        </div>

        {/* Manga Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mangas.map((manga, index) => (
            <Link
              key={index}
              href={`/manga/${manga.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-[450px]">
                <img
                  src={manga.image}
                  alt={manga.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-[#FF4655] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {manga.genre}
                    </span>
                    <div className="flex items-center space-x-1 text-[#FFD369]">
                      <span>★</span>
                      <span className="text-white">{manga.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">{manga.title}</h3>
                  <p className="text-gray-300">{manga.chapters} chapitres</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSectionOne;

