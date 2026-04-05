import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Node Gateway - Free Payment Gateway Support",
  description:
    "Get in touch with the Node Gateway team. We help developers and businesses integrate our free payment gateway for UPI, cards, and bank transfers.",
  alternates: {
    canonical: "https://nodegateway.vercel.app/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
