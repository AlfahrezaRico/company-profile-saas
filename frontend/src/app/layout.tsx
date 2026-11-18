import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ptalkarimjayaabadi.com"),
  title: {
    default: "PT Alkarim Jaya Abadi - Solusi Teknologi Enterprise",
    template: "%s | PT Alkarim Jaya Abadi",
  },
  description:
    "Website Resmi PT Alkarim Jaya Abadi - Platform Solusi Rekayasa Software Berkinerja Tinggi, Keamanan Siber, Penyediaan Tenaga Kerja (Outsourcing) & Transformasi Digital Enterprise Terintegrasi di Indonesia.",
  keywords: [
    "PT Alkarim Jaya Abadi",
    "Konsultan IT Indonesia",
    "Penyediaan Tenaga Kerja",
    "Manpower Outsourcing",
    "Business Process Outsourcing",
    "BPO Indonesia",
    "Keamanan Siber",
    "Cyber Security Auditing",
    "Transformasi Digital",
    "Enterprise Cloud Solutions",
    "Software Engineering Indonesia",
  ],
  authors: [{ name: "PT Alkarim Jaya Abadi", url: "https://www.ptalkarimjayaabadi.com" }],
  creator: "PT Alkarim Jaya Abadi",
  publisher: "PT Alkarim Jaya Abadi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PT Alkarim Jaya Abadi - Solusi Teknologi Enterprise",
    description:
      "Platform Solusi Rekayasa Software Berkinerja Tinggi, Keamanan Siber, Outsourcing Tenaga Kerja & Transformasi Digital Enterprise Terintegrasi.",
    url: "https://www.ptalkarimjayaabadi.com",
    siteName: "PT Alkarim Jaya Abadi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Alkarim Jaya Abadi - Solusi Teknologi Enterprise",
    description:
      "Platform Solusi Rekayasa Software Berkinerja Tinggi, Keamanan Siber, Outsourcing & Transformasi Digital Enterprise.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: "PT Alkarim Jaya Abadi",
    url: "https://www.ptalkarimjayaabadi.com",
    description:
      "Platform Solusi Rekayasa Software Berkinerja Tinggi, Keamanan Siber, Penyediaan Tenaga Kerja (Outsourcing) & Transformasi Digital Enterprise Terintegrasi di Indonesia.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Indonesian", "English"],
    },
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
