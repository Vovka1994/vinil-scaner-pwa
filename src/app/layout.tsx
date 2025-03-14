'use client';

import { Geist, Geist_Mono } from "next/font/google";
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/'; // 🔹 Перевірка, чи це сторінка логіну

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Navbar />} {/* 🔹 Показуємо Navbar, тільки якщо НЕ логін */}
        <main className="mx-auto">{children}</main>
      </body>
    </html>
  );
}
