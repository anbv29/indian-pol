import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://india-the-record.anbv29.chatgpt.site'),
  title: 'India: The Record',
  description: 'Switch the government. Explore the record — a source-backed interactive archive of Indian central governments.',
  openGraph: {
    title: 'India: The Record',
    description: 'Switch the government. Explore the record.',
    images: ['https://india-the-record.anbv29.chatgpt.site/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India: The Record',
    description: 'Switch the government. Explore the record.',
    images: ['https://india-the-record.anbv29.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
