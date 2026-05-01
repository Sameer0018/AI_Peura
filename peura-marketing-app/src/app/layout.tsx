import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peura AI | Smart Marketing Dashboard",
  description: "Automated competitor analysis and content generation for Peura Opticals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
