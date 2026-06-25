import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NepalHub - The Ultimate Nepal Utility & Calculator Platform",
  description: "Find the definitive collection of Nepal-specific calculators: Income Tax, Loan EMI, Land Converter, SEE/NEB GPA, Gold Estimator, and Citizen Utilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
