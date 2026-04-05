import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Node Gateway - Free Payment Gateway Built with Node.js",
  description:
    "Learn about Node Gateway, a free and open payment gateway system built with Node.js for developers and businesses in India. Accept UPI, cards & more.",
  alternates: {
    canonical: "https://nodegateway.vercel.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
