'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import { BookOpen, Brain, Link, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      
      <Header />
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          {/* <Video 

            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://player.vimeo.com/external/454507822.sd.mp4?s=c602c13e9d42b9d7666dd42c62b4cbc6b6f9e69d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </Video> */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Plongez dans l'univers 
              <span className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] bg-clip-text text-transparent"> manga</span>
            </h1>
            <p className="text-2xl text-gray-200 mb-12">
              Découvrez, lisez et vivez vos histoires préférées dans un monde où l'imagination n'a pas de limites
            </p>
            <Link href="/manga" className="inline-block bg-[#FF4655] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#FFD369] hover:text-gray-900 transform hover:scale-105 transition-all duration-300">
              Explorer maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Manga Section */}
      <section id="manga" className={`py-24 ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Mangas Tendance</h2>
              <p className="text-gray-500">Les séries qui font vibrer la communauté</p>
            </div>
            <Link href="/manga" className="text-[#FF4655] hover:text-[#FFD369] transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
              }
            ].map((manga, index) => (
              <Link href={`/manga/${manga.title.toLowerCase().replace(/\s+/g, '-')}`} key={index} className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="relative h-[450px]">
                  <img 
                    src={manga.image} 
                    alt={manga.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-[#FF4655] text-white px-4 py-2 rounded-full text-sm font-semibold">{manga.genre}</span>
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

      {/* Features Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Une expérience unique</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités qui font d'Aniscanic votre destination manga préférée
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <BookOpen size={32} className="text-[#FF4655]" />,
                title: "Bibliothèque Extensive",
                description: "Des milliers de mangas à portée de main, mis à jour quotidiennement",
                link: "/manga"
              },
              {
                icon: <Video size={32} className="text-[#FF4655]" />,
                title: "Contenu Vidéo",
                description: "Trailers, analyses et extraits exclusifs de vos séries préférées",
                link: "/videos"
              },
              {
                icon: <Brain size={32} className="text-[#FF4655]" />,
                title: "Quiz Interactifs",
                description: "Testez vos connaissances et défiez la communauté",
                link: "/quiz"
              }
            ].map((feature, index) => (
              <Link to={feature.link} key={index} className={`p-8 rounded-2xl ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'} shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
       






      
{/*     
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
        
       
      </footer> */}
      
    </div>
  );
}


