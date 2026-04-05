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
  metadataBase: new URL("https://nodegateway.vercel.app"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  title: {
    default: "Node Gateway - Free Payment Gateway | Accept Online Payments",
    template: "%s | Node Gateway",
  },
  description:
    "Node Gateway is a free payment gateway built with Node.js. Accept UPI, cards & bank transfers instantly. Developer-friendly API, payment links, QR codes, invoices & real-time analytics — 100% free.",
  keywords: [
    "free payment gateway",
    "free payment gateway India",
    "best free payment gateway",
    "payment gateway free",
    "free online payment gateway",
    "Node.js payment gateway",
    "nodejs payment gateway",
    "payment gateway API free",
    "accept payments online free",
    "UPI payment gateway",
    "UPI payment gateway free",
    "payment links",
    "free payment links",
    "payment gateway for developers",
    "open source payment gateway",
    "online payment gateway",
    "payment gateway India",
    "payment gateway system",
    "QR code payments",
    "invoice payment gateway",
    "payment button",
    "payment page builder",
    "Node Gateway",
    "nodegateway",
  ],
  authors: [{ name: "Suryansh Sharma" }],
  creator: "Suryansh Sharma",
  publisher: "Node Gateway",
  applicationName: "Node Gateway",
  alternates: {
    canonical: "https://nodegateway.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nodegateway.vercel.app",
    title: "Node Gateway - Free Payment Gateway | Accept Online Payments",
    description:
      "Free payment gateway built with Node.js. Accept UPI, cards & bank transfers. Payment links, QR codes, invoices & real-time analytics for developers and businesses.",
    siteName: "Node Gateway",
  },
  twitter: {
    card: "summary_large_image",
    title: "Node Gateway - Free Payment Gateway",
    description:
      "Free payment gateway for developers & businesses. Accept UPI, cards & bank transfers with payment links, QR codes, invoices & real-time analytics.",
    creator: "@nodegateway",
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Node Gateway",
  url: "https://nodegateway.vercel.app",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Node Gateway",
  url: "https://nodegateway.vercel.app",
  description:
    "A free payment gateway built with Node.js. Accept UPI, cards & bank transfers with payment links, QR codes, invoices & real-time analytics.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  author: {
    "@type": "Person",
    name: "Suryansh Sharma",
  },
  keywords:
    "free payment gateway, payment gateway India, UPI payment, nodejs payment gateway, online payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
