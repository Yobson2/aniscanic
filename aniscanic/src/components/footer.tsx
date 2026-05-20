'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Footer() {
  return (
    <footer className="w-full relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="object-cover"
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-dark/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Restez connecté</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Recevez en avant-première les dernières sorties manga et les actualités de la communauté
          </p>
          <form
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter"
          >
            <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Votre email"
              required
              className="flex-1 px-6 py-4 sm:rounded-l-full sm:rounded-r-none rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            <Button variant="brand" className="px-8 sm:rounded-r-full sm:rounded-l-none rounded-full">
              S&apos;inscrire
            </Button>
          </form>
        </div>
    </footer>
  )
}