import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Node Gateway | Effortless Payment Solutions",
    template: "%s | Node Gateway"
  },
  description: "A developer-friendly Node.js payment gateway for modern businesses. Effortlessly accept payments, manage subscriptions, set up payment links, and access powerful APIs.",
  keywords: ["payment gateways", "payment solutions", "node gateway", "Node.js payment gateway", "UPI payments", "online payments", "developer friendly gateway"],
  authors: [{ name: "Node Gateway" }],
  creator: "Node Gateway",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nodegateway.vercel.app",
    title: "Node Gateway | Powerful Payment Solutions",
    description: "Accept payments natively with the best developer-friendly Node.js payment gateway for modern businesses.",
    siteName: "Node Gateway",
  },
  twitter: {
    card: "summary_large_image",
    title: "Node Gateway | Effortless Payment Solutions",
    description: "Accept payments natively with the best developer-friendly Node.js payment gateway for modern businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "MejlcRBvijcBMiO7869oVqaet74aCWhdKjVlQpJ-73o",
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
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
