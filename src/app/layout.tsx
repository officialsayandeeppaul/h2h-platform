import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TawkToChat } from "@/components/shared/TawkToChat";
import { DevConsoleGuard } from "@/components/shared/DevConsoleGuard";
import { PostHogProvider } from "@/components/shared/PostHogProvider";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://healtohealth.in'),
  title: {
    default: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    template: "%s | H2H Healthcare",
  },
  description:
    "H2H Healthcare (Heal to Health): book sports rehabilitation, physiotherapy, pain management, and yoga in India. Online booking, clinic visits, and home physio where available. Evidence-led care for athletes and everyday patients.",
  keywords: [
    "physiotherapy India",
    "sports rehabilitation",
    "home physiotherapy",
    "pain management clinic",
    "therapeutic yoga",
    "sports physio",
    "online physiotherapy booking",
    "H2H Healthcare",
    "Heal to Health",
  ],
  authors: [{ name: "H2H Healthcare" }],
  alternates: {
    canonical: 'https://healtohealth.in',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://healtohealth.in",
    siteName: "H2H Healthcare",
    title: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    description:
      "Book sports rehab, physiotherapy, pain care, and yoga in India—clinic, online, or home visits where available.",
    images: [{ url: '/images/hero/home-banner.webp', width: 1200, height: 630, alt: 'H2H Healthcare' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    description:
      "Book sports rehab, physiotherapy, pain care, and yoga in India—clinic, online, or home visits where available.",
    images: ['/images/hero/home-banner.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: [{ url: "/icons/icon-32.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#0284c7",
    "msapplication-TileColor": "#0284c7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              name: 'H2H Healthcare',
              url: 'https://healtohealth.in',
              logo: 'https://healtohealth.in/images/brand/logo-caps.webp',
              description: 'Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India.',
              telephone: '+91-62916-15560',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              sameAs: [
                'https://facebook.com/healtohealth',
                'https://instagram.com/healtohealth',
                'https://linkedin.com/company/healtohealth',
              ],
              priceRange: '$$',
              medicalSpecialty: ['Physiotherapy', 'Sports Medicine', 'Pain Management'],
            }),
          }}
        />
        <PostHogProvider>
          <DevConsoleGuard />
          {children}
          <Toaster position="top-right" richColors />
          <TawkToChat />
        </PostHogProvider>
      </body>
    </html>
  );
}
