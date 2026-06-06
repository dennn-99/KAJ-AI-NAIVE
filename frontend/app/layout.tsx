import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAJ AI",
  description: "Multimodal misinformation detection platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
