import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Node Gateway Free Payment Gateway",
  description:
    "Read the Node Gateway privacy policy. We are committed to protecting your data while providing a free, secure payment gateway for online transactions.",
  alternates: {
    canonical: "https://nodegateway.vercel.app/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
