import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Node Gateway Free Payment Gateway",
  description:
    "Terms of service for Node Gateway, a free payment gateway for developers and businesses. Review our usage terms for accepting UPI, cards & bank transfers.",
  alternates: {
    canonical: "https://nodegateway.vercel.app/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
