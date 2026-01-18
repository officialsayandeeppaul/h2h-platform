import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TawkToChat } from "@/components/shared/TawkToChat";
import { PostHogProvider } from "@/components/shared/PostHogProvider";
import { SmoothScrollProvider } from "@/components/shared/SmoothScroll";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    template: "%s | H2H Healthcare",
  },
  description: "Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India. Book your appointment today!",
  keywords: ["physiotherapy", "sports rehab", "pain management", "yoga", "wellness", "healthcare", "India"],
  authors: [{ name: "H2H Healthcare" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://healtohealth.in",
    siteName: "H2H Healthcare",
    title: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    description: "Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "H2H Healthcare - Sports Rehab, Physiotherapy & Wellness",
    description: "Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <PostHogProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <Toaster position="top-right" richColors />
          <TawkToChat />
        </PostHogProvider>
      </body>
    </html>
  );
}
