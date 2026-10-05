'use client'

import { LogoShowcase } from "@/components/ui/logo"

export default function LogoShowcasePage() {
  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-16 pt-28 md:px-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">
        Aniscanic Logo — Panel A
      </h1>
      <p className="text-gray-400 mb-8">
        Every lockup and colour mode, plus the mark from 96px down to the 16px favicon cut.
      </p>
      <LogoShowcase />
    </main>
  )
}
