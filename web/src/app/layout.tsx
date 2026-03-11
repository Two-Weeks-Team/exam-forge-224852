import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exam Forge",
  description: "Turn your syllabus into a paper\u2011like revision notebook that auto\u2011creates sprint cards, spaced\u2011review timelines, and deadline tabs\u2014no login, no clutter, just instant study cadence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
