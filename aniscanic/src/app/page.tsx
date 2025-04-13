'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSectionOne from "@/components/hero-sections-home/HeroSectionOne";
import HeroSectionTwo from "@/components/hero-sections-home/HeroSectionTwo";
import HeroBanner from "@/components/heroBanner";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Link, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      
      <Header />
      <HeroBanner />

      {/* Featured Manga Section */}
      <HeroSectionOne isDarkMode={false} />

      {/* Features Section */}
      <HeroSectionTwo isDarkMode={false} />
      
      <Footer />
       
      
    </div>
  );
}


