import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
      
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '**',
        },
        {
            // AniList covers & banners
            protocol: 'https',
            hostname: 's4.anilist.co',
            pathname: '/file/anilistcdn/**',
        },
        // MangaDex images are NOT listed here: they go through /api/mangadex/image
    ],
},

};

export default nextConfig;
