import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://optiimg.karthikponnam.dev";
const siteOrigin = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: "Free Image Compressor & Resizer | OptiImage Local",
  description:
    "Compress images, resize photos, and convert formats (JPG, PNG, WebP, AVIF, JXL, SVG, ICO) securely in your browser. No uploads, unlimited files, 100% free image optimizer.",
  keywords: [
    "image compressor",
    "resize image",
    "photo optimizer",
    "reduce image size kb",
    "convert to webp",
    "convert to avif",
    "convert to jxl",
    "png compressor",
    "jpg reducer",
    "bulk image resize",
    "ico converter",
    "offline image tool",
  ],
  authors: [{ name: "Karthik Ponnam" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Free Image Compressor & Resizer - Secure & Unlimited",
    description:
      "Reduce image file size, resize dimensions, and convert formats locally. No server uploads, 100% private.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OptiImage Local — Free Image Compressor & Resizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Compressor & Resizer - Secure & Unlimited",
    description:
      "Reduce image file size, resize dimensions, and convert formats locally. No server uploads, 100% private.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: "OptiImage Local",
    url: `${siteUrl}/`,
    description:
      "A secure, 100% browser-based image compressor, resizer, and converter.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    inLanguage: "en",
    browserRequirements: "Requires JavaScript.",
    featureList:
      "Lossless compression, Image Resizing, Format Conversion (JPG, PNG, WebP, AVIF, JXL, ICO), Privacy-first local processing",
  };

  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Script
          id="ldjson"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </body>
    </html>
  );
}
