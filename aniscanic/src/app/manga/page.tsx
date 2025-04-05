'use client'
import React from 'react';
import { Search, Filter, Link } from 'lucide-react';

function Manga() {
  const mangas = [
    {
      title: "One Piece",
      image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=800&q=80",
      genre: "Shonen",
      rating: "4.9",
      chapters: "1089"
    },
    {
      title: "Attack on Titan",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      genre: "Seinen",
      rating: "4.8",
      chapters: "139"
    },
    {
      title: "Demon Slayer",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      genre: "Shonen",
      rating: "4.7",
      chapters: "205"
    },
    {
      title: "Jujutsu Kaisen",
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80",
      genre: "Shonen",
      rating: "4.8",
      chapters: "237"
    },
    {
      title: "Berserk",
      image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=800&q=80",
      genre: "Seinen",
      rating: "4.9",
      chapters: "364"
    },
    {
      title: "My Hero Academia",
      image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&w=800&q=80",
      genre: "Shonen",
      rating: "4.6",
      chapters: "402"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Bibliothèque Manga</h1>
          <p className="text-xl text-white/90 mb-8">Explorez notre collection de mangas et trouvez votre prochaine lecture</p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un manga..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white rounded-full hover:bg-[#FFD369] transition-colors">
              <Filter size={20} />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manga Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mangas.map((manga, index) => (
            <Link href={`/manga/${manga.title.toLowerCase().replace(/\s+/g, '-')}`} key={index} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-[300px]">
                <img 
                  src={manga.image} 
                  alt={manga.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <span className="text-[#FFD369]">★</span>
                    <span>{manga.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{manga.title}</h3>
                  <span className="bg-[#FF4655] text-white px-3 py-1 rounded-full text-sm">{manga.genre}</span>
                </div>
                <p className="text-gray-600">{manga.chapters} chapitres</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Manga;