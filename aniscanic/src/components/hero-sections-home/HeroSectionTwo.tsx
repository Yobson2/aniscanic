'use client'
import React from 'react';
import { BookOpen, Video, Brain } from 'lucide-react';
import Link from 'next/link';
import { MotionDiv, staggerContainer, fadeInUp } from '@/components/motion';


interface HeroSectionTwoProps {
  isDarkMode: boolean;
}

const HeroSectionTwo: React.FC<HeroSectionTwoProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: <BookOpen size={32} className="text-brand-red" />,
      title: "Bibliothèque Extensive",
      description: "Des milliers de mangas à portée de main, mis à jour quotidiennement",
      link: "/manga",
    },
    {
      icon: <Video size={32} className="text-brand-red" />,
      title: "Contenu Vidéo",
      description: "Trailers, analyses et extraits exclusifs de vos séries préférées",
      link: "/movie",
    },
    {
      icon: <Brain size={32} className="text-brand-red" />,
      title: "Quiz Interactifs",
      description: "Testez vos connaissances et défiez la communauté",
      link: "/quiz",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Une expérience unique</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités qui font d'Aniscanic votre destination manga préférée
          </p>
        </div>
        <MotionDiv
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((feature, index) => (
            <MotionDiv key={index} variants={fadeInUp}>
              <Link
                href={feature.link}
                className="block p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

export default HeroSectionTwo;