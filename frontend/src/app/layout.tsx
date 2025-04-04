"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>NoteDown 📚 - Organize Your Thoughts</title>
        <meta name="description" content="A powerful notes-taking app to create, edit, and organize your notes efficiently."/>
        <meta name="keywords" content="notes, notes app, online notepad, note-taking"/>
        <meta name="author" content="Vijay M"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
