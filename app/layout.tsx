import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SiteVisitTracker } from '../components/visit-tracker';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'India: The Record',
  description: 'Switch the government. Explore the record — a source-backed interactive archive of Indian central governments.',
  openGraph: {
    title: 'India: The Record',
    description: 'Switch the government. Explore the record.',
    images: [`${siteUrl}/og.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India: The Record',
    description: 'Switch the government. Explore the record.',
    images: [`${siteUrl}/og.png`],
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
        <SiteVisitTracker />
        {children}
      </body>
    </html>
  );
}
