'use client'
import React from 'react';
import { BookOpen, Video, Brain } from 'lucide-react';
import Link from 'next/link';


interface HeroSectionOneProps {
  isDarkMode: boolean;
}

const HeroSectionTwo: React.FC<HeroSectionOneProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: <BookOpen size={32} className="text-[#FF4655]" />,
      title: "Bibliothèque Extensive",
      description: "Des milliers de mangas à portée de main, mis à jour quotidiennement",
      link: "/manga",
    },
    {
      icon: <Video size={32} className="text-[#FF4655]" />,
      title: "Contenu Vidéo",
      description: "Trailers, analyses et extraits exclusifs de vos séries préférées",
      link: "/videos",
    },
    {
      icon: <Brain size={32} className="text-[#FF4655]" />,
      title: "Quiz Interactifs",
      description: "Testez vos connaissances et défiez la communauté",
      link: "/quiz",
    },
  ];

  return (
    <section className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Une expérience unique</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités qui font d'Aniscanic votre destination manga préférée
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Link
              href={feature.link}
              key={index}
              className={`p-8 rounded-2xl ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'} shadow-xl hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTwo;