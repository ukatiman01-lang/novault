import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://novault.io'),
  title: "noVault — Private-by-Default Infrastructure for the Next Internet",
  description:
    "noVault provides private-by-default infrastructure for the next internet. Zero-knowledge proofs, encrypted computation, and privacy-first protocols.",
  keywords: [
    "noVault",
    "Web3",
    "privacy",
    "zero-knowledge",
    "blockchain infrastructure",
    "encrypted computation",
    "decentralized",
    "ZK proofs",
  ],
  authors: [{ name: "noVault", url: "https://x.com/novaultech" }],
  icons: {
    icon: "/novault-logo.png",
  },
  openGraph: {
    title: "noVault — Private-by-Default Infrastructure",
    description:
      "Private-by-default infrastructure for the next internet. Built for a world where privacy is not optional.",
    siteName: "noVault",
    type: "website",
    images: ['/og-image.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "noVault — Private-by-Default Infrastructure",
    description:
      "Private-by-default infrastructure for the next internet.",
    creator: "@novaultech",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground text-rendering`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
