import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-blue text-cream selection:bg-amber-400 selection:text-black relative">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
