'use client'
import React from 'react';
import Image from 'next/image';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/page-header';

function Ranking() {
  const topPlayers = [
    {
      rank: 1,
      name: "Luffy_Fan",
      score: 15780,
      quizCompleted: 145,
      accuracy: "98%",
      avatar: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=200&q=80"
    },
    {
      rank: 2,
      name: "MangaKing",
      score: 14920,
      quizCompleted: 132,
      accuracy: "95%",
      avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80"
    },
    {
      rank: 3,
      name: "OtakuPro",
      score: 13850,
      quizCompleted: 128,
      accuracy: "93%",
      avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const recentAchievements = [
    {
      player: "Luffy_Fan",
      achievement: "Expert One Piece",
      points: 500,
      date: "Il y a 2h"
    },
    {
      player: "MangaKing",
      achievement: "Maître des Shonen",
      points: 1000,
      date: "Il y a 5h"
    },
    {
      player: "OtakuPro",
      achievement: "Quiz Perfect",
      points: 300,
      date: "Il y a 8h"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Classement Global"
        subtitle="Les meilleurs connaisseurs de manga de la communauté"
      />

      {/* Top 3 Podium */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topPlayers.map((player, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card p-6 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-4 border-brand-gold"
                  />
                  <div className="absolute -top-2 -right-2 bg-brand-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    #{player.rank}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{player.name}</h3>
                <div className="text-3xl font-bold text-brand-red mb-4">{player.score} pts</div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Quiz complétés</span>
                    <span>{player.quizCompleted}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Précision</span>
                    <span>{player.accuracy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Derniers Exploits</h2>
            <Medal className="text-brand-gold" size={32} />
          </div>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-bold">{achievement.player}</div>
                  <div className="text-muted-foreground">{achievement.achievement}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-red">+{achievement.points} pts</div>
                  <div className="text-muted-foreground">{achievement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Trophy className="text-brand-gold" size={32} />,
              title: "Quiz Complétés",
              value: "1,234",
              trend: "+12% cette semaine"
            },
            {
              icon: <Star className="text-brand-gold" size={32} />,
              title: "Moyenne de Score",
              value: "856 pts",
              trend: "+5% ce mois"
            },
            {
              icon: <TrendingUp className="text-brand-gold" size={32} />,
              title: "Participants Actifs",
              value: "458",
              trend: "+25% ce mois"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <span className="text-green-500 text-sm">{stat.trend}</span>
              </div>
              <h3 className="text-muted-foreground mb-2">{stat.title}</h3>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ranking;