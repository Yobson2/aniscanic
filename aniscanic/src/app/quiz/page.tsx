'use client'
import React from 'react';
import { Brain, Star, Clock, Trophy } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Quiz Manga</h1>
          <p className="text-xl text-white/90">
            Testez vos connaissances et défiez d'autres fans
          </p>
        </div>
      </div>

      {/* Quiz Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {quizzes.map((quiz, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-[200px]">
                <img 
                  src={quiz.image} 
                  alt={quiz.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
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
                <button className="w-full bg-[#FF4655] text-white py-3 rounded-full hover:bg-[#FFD369] hover:text-gray-900 transition-colors">
                  Commencer le Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Meilleurs Scores</h2>
            <Trophy className="text-[#FFD369]" size={32} />
          </div>
          <div className="space-y-4">
            {[
              { name: "Luffy_Fan", score: 980, rank: 1 },
              { name: "MangaKing", score: 850, rank: 2 },
              { name: "OtakuPro", score: 720, rank: 3 }
            ].map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{player.rank}</span>
                  <span>{player.name}</span>
                </div>
                <span className="font-bold text-[#FF4655]">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;