import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TawkToChat } from "@/components/shared/TawkToChat";
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'H2H Healthcare' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    description:
      "Book sports rehab, physiotherapy, pain care, and yoga in India—clinic, online, or home visits where available.",
    images: ['/og-image.png'],
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
    icon: [{ url: "/h2h-short-logo.png", type: "image/png", sizes: "any" }],
    shortcut: "/h2h-short-logo.png",
    apple: "/h2h-short-logo.png",
  },
  other: {
    'theme-color': '#0284c7',
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
        <link rel="preconnect" href="https://images.unsplash.com" />
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
              logo: 'https://healtohealth.in/h2hLogo-caps.png',
              description: 'Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India.',
              telephone: '+91-1800-123-4567',
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
          {children}
          <Toaster position="top-right" richColors />
          <TawkToChat />
        </PostHogProvider>
      </body>
    </html>
  );
}
