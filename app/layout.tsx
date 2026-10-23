import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QRCE Skill Repository — Quantitative Rating & Conversion Engine',
  description:
    'Official GitHub repository package, multi-LLM prompt studio, and CQS simulator for the Quantitative Rating & Conversion Engine (QRCE v3.0.0) skill by Sparsh Keshwani.',
  openGraph: {
    title: 'QRCE Skill Repository — Quantitative Rating & Conversion Engine',
    description:
      'Official GitHub repository package, multi-LLM prompt studio, and CQS simulator for the Quantitative Rating & Conversion Engine (QRCE v3.0.0) skill by Sparsh Keshwani.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRCE Skill Repository — Quantitative Rating & Conversion Engine',
    description:
      'Official GitHub repository package, multi-LLM prompt studio, and CQS simulator for the Quantitative Rating & Conversion Engine (QRCE v3.0.0) skill by Sparsh Keshwani.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${publicSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="bg-white font-[family-name:var(--font-sans)] text-slate-900 antialiased selection:bg-blue-700 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
