'use client'

import { LogoShowcase } from "@/components/ui/logo"

export default function LogoShowcasePage() {
  return (
    <main className="min-h-screen bg-[#141414] p-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">
        Aniscanic Logo Concepts
      </h1>
      <p className="text-gray-400 mb-8">
        Compare all 3 concepts across sizes and color modes. Pick your favorite.
      </p>
      <LogoShowcase />
    </main>
  )
}
