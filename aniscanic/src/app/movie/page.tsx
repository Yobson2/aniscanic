import React from 'react';
import { Play, Clock, ThumbsUp } from 'lucide-react';

function Videos() {
  const videos = [
    {
      title: "Top 10 Combats Épiques dans One Piece",
      thumbnail: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=800&q=80",
      duration: "15:24",
      views: "120K",
      likes: "8.5K"
    },
    {
      title: "L'Évolution de Demon Slayer - De Manga à Anime",
      thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      duration: "12:18",
      views: "95K",
      likes: "6.2K"
    },
    {
      title: "Attack on Titan - Analyse du Final",
      thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      duration: "20:45",
      views: "200K",
      likes: "15K"
    },
    {
      title: "Les Secrets de Jujutsu Kaisen",
      thumbnail: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80",
      duration: "18:30",
      views: "150K",
      likes: "12K"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Vidéothèque Anime</h1>
          <p className="text-xl text-white/90">
            Découvrez les meilleures analyses, critiques et moments forts de vos séries préférées
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-4 right-4 bg-black text-white px-2 py-1 rounded-md flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{video.duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{video.title}</h3>
                <div className="flex items-center justify-between text-gray-600">
                  <span>{video.views} vues</span>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} className="text-[#FF4655]" />
                    <span>{video.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Videos;