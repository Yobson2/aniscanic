'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Clock, ThumbsUp } from 'lucide-react';
import PageHeader from '@/components/page-header';

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
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Vidéothèque Anime"
        subtitle="Découvrez les meilleures analyses, critiques et moments forts de vos séries préférées"
      />

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-[300px]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-4 right-4 bg-brand-dark/80 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{video.duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{video.title}</h3>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{video.views} vues</span>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} className="text-brand-red" />
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