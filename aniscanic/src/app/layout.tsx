import type { Metadata } from "next";
import { Hanken_Grotesk, Unbounded } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Body and UI text
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

// Logo wordmark and display headlines
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aniscanic — Mangas en français, films d’animation et quiz",
  description:
    "Lis des mangas traduits en français par les groupes de fans, découvre les films d’animation les plus vus et teste ta culture anime.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = 'dark';
                try { theme = localStorage.getItem('aniscanic-theme') || 'dark'; } catch (e) {}
                if (theme === 'dark') document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      {/* suppressHydrationWarning: extensions (e.g. ColorZilla) add attributes to <body> before hydration */}
      <body className={`${hanken.variable} ${unbounded.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-brand-gold focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-dark"
          >
            Aller au contenu
          </a>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
