'use client'
import HeroSectionOne from "@/components/hero-sections-home/HeroSectionOne";
import HeroSectionTwo from "@/components/hero-sections-home/HeroSectionTwo";
import HeroBanner from "@/components/heroBanner";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <HeroSectionOne isDarkMode={false} />
      <HeroSectionTwo isDarkMode={false} />
    </>
  );
}


