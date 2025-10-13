import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - Heart Disease Monitor",
  description: "Comprehensive analytics and insights from your health data",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
