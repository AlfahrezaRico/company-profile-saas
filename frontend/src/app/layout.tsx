import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { API_BASE_URL } from "@/config/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/company-profile`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      const companyName = data.companyName || "PT Alkarim Jaya Abadi";
      const title = data.tagline ? `${companyName} - ${data.tagline}` : companyName;
      const description = data.about || data.tagline || `Website resmi ${companyName}`;
      const iconUrl = data.logoUrl || undefined;

      return {
        title,
        description,
        icons: iconUrl
          ? {
              icon: iconUrl,
              shortcut: iconUrl,
              apple: iconUrl,
            }
          : undefined,
      };
    }
  } catch (err) {
    console.error("Gagal memuat metadata profile:", err);
  }

  return {
    title: "PT Alkarim Jaya Abadi",
    description: "Website Resmi Profil Perusahaan",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

