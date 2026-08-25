import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// AdBanner import removed while ads are disabled — see ADS_ENABLED in components/AdBanner.tsx

const geistSans = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NepalHub — Nepal's #1 Utility & Calculator Platform",
    template: "%s | NepalHub",
  },
  description:
    "Free Nepal-specific calculators and utilities: Income Tax (FY 2083/84), Loan EMI, NEA Electricity Bill, Stock P&L, and more. 100% client-side, no data leaves your browser.",
  keywords: [
    "nepal calculator", "nepali utility", "income tax nepal",
    "nepse calculator", "remittance nepal", "nepali date converter",
    "electricity bill nepal",
    "passport photo nepal", "invoice generator nepal",
    "nepali unit converter", "nepalhub",
  ],
  authors: [{ name: "NepalHub" }],
  creator: "NepalHub",
  publisher: "NepalHub",
  metadataBase: new URL("https://nepalihub-omega.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NepalHub",
    title: "NepalHub — Nepal's #1 Utility & Calculator Platform",
    description:
      "Free Nepal-specific calculators and utilities: Income Tax, Loan EMI, Electricity Bill, Stock P&L, and more.",
    url: "https://nepalihub-omega.vercel.app/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NepalHub — Nepal Utilities & Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NepalHub — Nepal's #1 Utility & Calculator Platform",
    description:
      "Free Nepal-specific calculators and utilities: Income Tax, Loan EMI, Electricity Bill, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with actual code
  },
  other: {
    "google-adsense-account": "ca-pub-9613933136929298",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ne"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://open.er-api.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
        <link rel="preconnect" href="https://ohmanda.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ohmanda.com" />
        
        {/* Google AdSense Script — disabled while ads are off (see ADS_ENABLED in components/AdBanner.tsx)
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-9613933136929298'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        */}
        
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NepalHub",
              url: "https://nepalihub-omega.vercel.app/",
              logo: "https://nepalihub-omega.vercel.app/favicon.ico",
              description:
                "Free Nepal-specific calculators and digital utilities platform.",
              areaServed: "NP",
            }),
          }}
        />
        {/* Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NepalHub",
              url: "https://nepalihub-omega.vercel.app/",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://nepalihub-omega.vercel.app/?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink transition-colors duration-200">
        <Navbar />

        {/*
          Ad slots — disabled for now (see ADS_ENABLED in components/AdBanner.tsx).
          Restore these wrappers when re-enabling:

          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-6">
            <div className="max-w-7xl mx-auto">
              <AdBanner slot="top-horizontal-slot" format="horizontal" />
            </div>
          </div>
        */}

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>

        {/*
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-8">
            <div className="max-w-7xl mx-auto">
              <AdBanner slot="bottom-horizontal-slot" format="horizontal" />
            </div>
          </div>
        */}

        <Footer />
      </body>
    </html>
  );
}
