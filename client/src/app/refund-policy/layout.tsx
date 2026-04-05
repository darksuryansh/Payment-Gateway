import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Node Gateway Free Payment Gateway",
  description:
    "Refund and cancellation policy for Node Gateway. Transparent policies for our free payment gateway service for developers and businesses.",
  alternates: {
    canonical: "https://nodegateway.vercel.app/refund-policy",
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
