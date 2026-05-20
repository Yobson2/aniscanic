'use client'
import React from 'react';
import Image from 'next/image';
import { Brain, Star, Clock, Trophy } from 'lucide-react';
import PageHeader from '@/components/page-header';

function Quiz() {
  const quizzes = [
    {
      title: "One Piece Ultimate Challenge",
      difficulty: "Expert",
      questions: 20,
      time: "15 min",
      image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Demon Slayer: Connaissez-vous les Hashiras?",
      difficulty: "Intermédiaire",
      questions: 15,
      time: "10 min",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Attack on Titan: Les Mystères Révélés",
      difficulty: "Difficile",
      questions: 25,
      time: "20 min",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Quiz Spécial Shonen Jump",
      difficulty: "Facile",
      questions: 10,
      time: "8 min",
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Quiz Manga"
        subtitle="Testez vos connaissances et défiez d'autres fans"
      />

      {/* Quiz Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {quizzes.map((quiz, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-[200px]">
                <Image
                  src={quiz.image}
                  alt={quiz.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <Star size={16} />
                      <span>{quiz.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain size={16} />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{quiz.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button className="w-full bg-brand-red text-white py-3 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-colors">
                  Commencer le Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Meilleurs Scores</h2>
            <Trophy className="text-brand-gold" size={32} />
          </div>
          <div className="space-y-4">
            {[
              { name: "Luffy_Fan", score: 980, rank: 1 },
              { name: "MangaKing", score: 850, rank: 2 },
              { name: "OtakuPro", score: 720, rank: 3 }
            ].map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{player.rank}</span>
                  <span>{player.name}</span>
                </div>
                <span className="font-bold text-brand-red">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;