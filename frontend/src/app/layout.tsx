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
    default: "PT Al Karim Jaya Abadi - Konsultan IT, Manpower Outsourcing, dan BPO",
    template: "%s | PT Al Karim Jaya Abadi",
  },
  description:
    "PT Al Karim Jaya Abadi adalah perusahaan yang bergerak di bidang konsultasi IT, penyediaan tenaga kerja (manpower outsourcing), dan Business Process Outsourcing (BPO).",
  keywords: [
    "PT Al Karim Jaya Abadi",
    "Konsultan IT Indonesia",
    "Penyediaan Tenaga Kerja",
    "Manpower Outsourcing",
    "Business Process Outsourcing",
    "BPO Indonesia",
    "Transformasi Digital",
  ],
  authors: [{ name: "PT Al Karim Jaya Abadi", url: "https://www.ptalkarimjayaabadi.com" }],
  creator: "PT Al Karim Jaya Abadi",
  publisher: "PT Al Karim Jaya Abadi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PT Al Karim Jaya Abadi - Konsultan IT, Manpower Outsourcing, dan BPO",
    description:
      "PT Al Karim Jaya Abadi adalah perusahaan yang bergerak di bidang konsultasi IT, penyediaan tenaga kerja (manpower outsourcing), dan Business Process Outsourcing (BPO).",
    url: "https://www.ptalkarimjayaabadi.com",
    siteName: "PT Al Karim Jaya Abadi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Al Karim Jaya Abadi - Konsultan IT, Manpower Outsourcing, dan BPO",
    description:
      "PT Al Karim Jaya Abadi adalah perusahaan yang bergerak di bidang konsultasi IT, penyediaan tenaga kerja (manpower outsourcing), dan Business Process Outsourcing (BPO).",
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
    name: "PT Al Karim Jaya Abadi",
    url: "https://www.ptalkarimjayaabadi.com",
    description:
      "PT Al Karim Jaya Abadi adalah perusahaan yang bergerak di bidang konsultasi IT, penyediaan tenaga kerja (manpower outsourcing), dan Business Process Outsourcing (BPO).",
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
