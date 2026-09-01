import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

import { reportMistakeUrl } from '@/lib/site-links';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FWISD GPA and Final Grade Calculator',
  description:
    'An unofficial student-built calculator for Fort Worth ISD weighted GPA, unweighted GPA, FOCUS CSV imports, semester grades, and required exam scores.',
  openGraph: {
    title: 'FWISD GPA and Final Grade Calculator',
    description:
      'Estimate FWISD GPA and semester grades with clear 2026-2027 policy assumptions.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FWISD GPA and Final Grade Calculator',
    description:
      'Estimate FWISD GPA and semester grades with clear 2026-2027 policy assumptions.',
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
        <header className="no-print border-b border-border bg-card">
          <div className="mx-auto flex min-h-12 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm sm:px-6 lg:px-8">
            <Link className="font-semibold text-foreground" href="/">
              FWISD GPA Calculator
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <Link className="hover:text-foreground" href="/about">
                About
              </Link>
              <Link className="hover:text-foreground" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-foreground" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground" href={reportMistakeUrl}>
                Report a mistake
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="no-print border-t border-border bg-card">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <p>Unofficial student-built FWISD GPA estimator.</p>
            <nav className="flex flex-wrap gap-4">
              <Link className="hover:text-foreground" href="/">
                Calculator
              </Link>
              <Link className="hover:text-foreground" href="/about">
                About
              </Link>
              <Link className="hover:text-foreground" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-foreground" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground" href={reportMistakeUrl}>
                Report a mistake
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
