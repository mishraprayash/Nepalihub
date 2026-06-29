import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NepalHub — Nepal's #1 Utility & Calculator Platform",
    template: "%s | NepalHub",
  },
  description:
    "Free Nepal-specific calculators and utilities: Income Tax (FY 2083/84), Loan EMI, Land Unit Converter, SEE/NEB GPA, NEA Electricity Bill, Gold Price, Stock P&L, Rashifal, and more. 100% client-side, no data leaves your browser.",
  keywords: [
    "nepal calculator", "nepali utility", "income tax nepal", "nepal land converter",
    "nepse calculator", "remittance nepal", "nepali rashifal", "nepali date converter",
    "electricity bill nepal", "gold price nepal", "see gpa calculator", "neb gpa",
    "passport photo nepal", "invoice generator nepal", "vehicle tax nepal",
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
      "Free Nepal-specific calculators and utilities: Income Tax, Loan EMI, Land Converter, GPA, Electricity Bill, Gold Price, Stock P&L, and more.",
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
      "Free Nepal-specific calculators and utilities: Income Tax, Loan EMI, Land Converter, GPA, Electricity Bill, Gold Price, and more.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://open.er-api.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
        <link rel="preconnect" href="https://ohmanda.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ohmanda.com" />
        
        {/* Google AdSense Script — uncomment and add your publisher ID after approval */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}
        
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NepalHub",
              url: "https://nepalihub-omega.vercel.app/",
              logo: "https://nepalihub-omega.vercel.app//favicon.ico",
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
                  urlTemplate: "https://nepalihub-omega.vercel.app//?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
