import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.joesmealmap.com'),

  title: {
    default: "Joe's MealMap | Free Meal Planner & Macro Tracker",
    template: "%s | Joe's MealMap",
  },

  description:
    "Plan your meals, hit your macros, and build your grocery list automatically with Joe's MealMap.",

  openGraph: {
    title: "Joe's MealMap",
    description:
      'Plan meals, track macros, and generate grocery lists automatically.',
    url: 'https://www.joesmealmap.com',
    siteName: "Joe's MealMap",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Joe's MealMap",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "Joe's MealMap",
    description:
      'Plan meals, track macros, and generate grocery lists automatically.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <meta name="impact-site-verification" {...{'value': '5483f2ab-0f90-487e-8b6f-41ed79c7de80'}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
