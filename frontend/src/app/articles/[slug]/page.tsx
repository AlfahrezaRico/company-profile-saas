"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Calendar,
  User,
  Clock,
  Share2,
  Building2,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

// INDONESIA & UK SVG FLAGS (CRISP VECTOR ALA PRIVY.ID)
const IndonesiaFlag = () => (
  <svg
    className="w-4 h-2.5 rounded-[2px] overflow-hidden shadow-xs shrink-0 border border-black/15"
    viewBox="0 0 640 480"
    aria-hidden="true"
  >
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#e70011" d="M0 0h640v240H0z" />
      <path fill="#ffffff" d="M0 240h640v240H0z" />
    </g>
  </svg>
);

const UkFlag = () => (
  <svg
    className="w-4 h-2.5 rounded-[2px] overflow-hidden shadow-xs shrink-0 border border-black/15"
    viewBox="0 0 640 480"
    aria-hidden="true"
  >
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path
      fill="#ffffff"
      d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
    />
    <path
      fill="#c8102e"
      d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
    />
    <path fill="#ffffff" d="M241 0v480h160V0zM0 160v160h640V160z" />
    <path fill="#c8102e" d="M0 193v96h640v-96zM273 0v480h96V0z" />
  </svg>
);

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  category?: { id: string; name: string } | null;
  author?: { id: string; name: string; email: string } | null;
}

const translations = {
  id: {
    home: "Beranda",
    articles: "Artikel & Wawasan",
    allArticles: "Semua Artikel",
    consult: "Konsultasi Solusi",
    taglineDefault: "Solusi Teknologi Enterprise",
    loading: "Memuat isi artikel...",
    notFoundTitle: "Artikel Tidak Ditemukan",
    notFoundDesc: "Artikel yang Anda cari mungkin telah dihapus atau URL yang dituju salah.",
    backToCatalog: "Kembali ke Katalog Artikel",
    defaultCategory: "Wawasan Bisnis",
    readingTime: "5 Menit Waktu Baca",
    defaultAuthor: "Administrator Utama",
    publishedOn: "Dipublikasikan pada",
    shareWhatsapp: "Bagikan ke WhatsApp",
    shareLinkedin: "Bagikan ke LinkedIn",
    copyLink: "Salin Link",
    copied: "Tersalin!",
    topics: "Topik:",
    topicDefault2: "Transformasi Bisnis",
    shareThisArticle: "Bagikan Artikel Ini",
    writtenBy: "Ditulis oleh",
    authorRole: "Spesialis rekayasa perangkat lunak dan konsultan transformasi digital di",
    ctaHeadline: "Ingin Mengimplementasikan Solusi Serupa untuk Perusahaan Anda?",
    ctaDesc: "Konsultasikan tantangan teknologi dan arsitektur sistem bisnis Anda bersama tim konsultan ahli",
    ctaSchedule: "Jadwalkan Konsultasi Gratis",
    ctaMoreArticles: "Lihat Artikel Lainnya",
    footerAbout: "Mitra transformasi teknologi terpercaya yang menghadirkan rekayasa perangkat lunak enterprise dengan arsitektur modern berstandar keamanan tinggi.",
    solutionsTitle: "Solusi & Layanan",
    solutionsList: [
      { label: "Enterprise Web & Cloud Solutions", href: "/#services" },
      { label: "Cyber Security & Security Auditing", href: "/#services" },
      { label: "AI Integration & Big Data Analytics", href: "/#services" },
      { label: "Digital Business Transformation", href: "/#services" },
      { label: "Microservices & API Architecture", href: "/#services" },
    ],
    companyTitle: "Perusahaan",
    companyList: [
      { label: "Tentang Kami", href: "/#about" },
      { label: "Mitra & Klien", href: "/#clients" },
      { label: "Wawasan & Artikel", href: "/articles" },
      { label: "Hubungi Tim Ahli", href: "/#contact" },
    ],
    contactTitle: "Kantor & Kontak Resmi",
    chatWhatsapp: "Chat WhatsApp Resmi",
    allRights: "Hak Cipta Dilindungi Undang-Undang.",
    slaActive: "SLA Keandalan Sistem 99.9% Aktif & Terlindungi",
    backToTop: "Kembali ke atas",
  },
  en: {
    home: "Home",
    articles: "Articles & Insights",
    allArticles: "All Articles",
    consult: "Consult Solution",
    taglineDefault: "Enterprise Digital Solutions",
    loading: "Loading article content...",
    notFoundTitle: "Article Not Found",
    notFoundDesc: "The article you are looking for may have been moved, removed, or the link is incorrect.",
    backToCatalog: "Back to Articles Catalog",
    defaultCategory: "Business Insights",
    readingTime: "5 min read",
    defaultAuthor: "Senior Technical Lead",
    publishedOn: "Published on",
    shareWhatsapp: "Share via WhatsApp",
    shareLinkedin: "Share via LinkedIn",
    copyLink: "Copy Link",
    copied: "Copied!",
    topics: "Topics:",
    topicDefault2: "Business Transformation",
    shareThisArticle: "Share This Article",
    writtenBy: "Written by",
    authorRole: "Software engineering specialist and enterprise digital transformation consultant at",
    ctaHeadline: "Looking to Implement Similar High-Impact Solutions for Your Enterprise?",
    ctaDesc: "Discuss your technology challenges, scalability requirements, and system architecture with our specialist engineering team at",
    ctaSchedule: "Schedule Free Consultation",
    ctaMoreArticles: "Explore More Articles",
    footerAbout: "Trusted enterprise technology and software engineering partner delivering scalable cloud infrastructure and certified cybersecurity.",
    solutionsTitle: "Solutions & Services",
    solutionsList: [
      { label: "Enterprise Web & Cloud Solutions", href: "/#services" },
      { label: "Cybersecurity & Security Auditing", href: "/#services" },
      { label: "AI Integration & Predictive Analytics", href: "/#services" },
      { label: "Digital Business Transformation", href: "/#services" },
      { label: "Microservices & API Architecture", href: "/#services" },
    ],
    companyTitle: "Company",
    companyList: [
      { label: "About Us", href: "/#about" },
      { label: "Partners & Portfolio", href: "/#clients" },
      { label: "Articles & Insights", href: "/articles" },
      { label: "Contact Expert Team", href: "/#contact" },
    ],
    contactTitle: "Official Office & Contact",
    chatWhatsapp: "Official WhatsApp Chat",
    allRights: "All Rights Reserved.",
    slaActive: "System Reliability SLA 99.9% Active & Protected",
    backToTop: "Back to top",
  },
};

function ArticleDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [lang, setLang] = useState<"id" | "en">("id");
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [profile, setProfile] = useState<any>({
    companyName: "",
    logoUrl: "",
    tagline: "",
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    try {
      const savedLang = localStorage.getItem("company_profile_lang");
      if (savedLang === "id" || savedLang === "en") {
        setLang(savedLang);
      }
    } catch (e) {}
  }, []);

  const handleLanguageChange = (newLang: "id" | "en") => {
    setLang(newLang);
    try {
      localStorage.setItem("company_profile_lang", newLang);
    } catch (e) {}
  };

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch profile
    fetch(`${API_BASE_URL}/api/company-profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.companyName) setProfile(d);
      })
      .catch(() => {});

    // Fetch article by slug
    if (slug) {
      fetch(`${API_BASE_URL}/api/articles/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Artikel tidak ditemukan");
          return res.json();
        })
        .then((data) => {
          if (data && data.title) {
            setArticle(data);
            document.title = `${data.title} - ${profile.companyName || "Artikel"}`;
          }
        })
        .catch((err) => {
          console.error("Gagal memuat artikel:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-rose-800 border-t-transparent rounded-full mb-4" />
          <p className="text-slate-600 font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">{t.notFoundTitle}</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            {t.notFoundDesc}
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-800 text-white font-semibold text-sm hover:bg-rose-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToCatalog}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format paragraphs and headers from content
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight border-l-4 border-rose-800 pl-4"
          >
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="ml-6 list-disc text-slate-700 text-base sm:text-lg leading-relaxed mb-2">
            {trimmed.replace(/^[-*]\s+/, "")}
          </li>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <div key={idx} className="flex gap-3 text-slate-700 text-base sm:text-lg leading-relaxed mb-3">
            <span className="font-bold text-rose-800 shrink-0">{trimmed.match(/^\d+\./)?.[0]}</span>
            <span>{trimmed.replace(/^\d+\.\s+/, "")}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
      {/* FLOATING PILL GLASSMORPHISM NAVBAR (CLEAN CRYSTAL FROSTED GLASS ALA PRIVY.ID) */}
      <div className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 lg:px-8 transition-all">
        <header className="max-w-7xl mx-auto rounded-full bg-white/75 backdrop-blur-2xl [backdrop-filter:blur(24px)_saturate(180%)] border border-slate-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-slate-900/5 px-4 sm:px-6 py-2.5 transition-all">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.companyName || "Logo"}
                  className="h-9 w-auto max-w-[120px] object-contain rounded-lg border border-slate-200 p-0.5 bg-white shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 to-rose-900 flex items-center justify-center text-white shadow-md shadow-rose-900/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col min-w-0 max-w-[180px] sm:max-w-[240px]">
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-rose-800 transition-colors leading-tight truncate">
                  {profile.companyName}
                </span>
                <span className="text-[9px] tracking-wider text-rose-800 uppercase font-bold hidden sm:block truncate">
                  {profile.tagline || t.taglineDefault}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* PRIVY.ID-STYLE DUAL-FLAG LANGUAGE SWITCHER */}
              <div
                role="group"
                aria-label="Change Language"
                className="bg-slate-100 border border-slate-200/90 rounded-full p-0.5 flex items-center h-7 shadow-inner"
              >
                <button
                  type="button"
                  onClick={() => handleLanguageChange("id")}
                  className={`flex items-center gap-1 px-2 h-6 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    lang === "id"
                      ? "bg-white text-rose-950 border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Bahasa Indonesia"
                >
                  <IndonesiaFlag />
                  <span>ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  className={`flex items-center gap-1 px-2 h-6 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    lang === "en"
                      ? "bg-white text-rose-950 border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="English"
                >
                  <UkFlag />
                  <span>EN</span>
                </button>
              </div>

              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-rose-800 hover:bg-rose-50/70 border border-slate-200/80 transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.allArticles}</span>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-700 via-rose-800 to-[#700020] hover:brightness-110 transition-all shadow-md shadow-rose-950/20 active:scale-95"
              >
                <span>{t.consult}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* ARTICLE HEADER & BREADCRUMB */}
      <div className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-rose-800 transition-colors">
              {t.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/articles" className="hover:text-rose-800 transition-colors">
              {t.articles}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 truncate max-w-[200px] sm:max-w-xs font-semibold">
              {article.title}
            </span>
          </nav>

          {/* Category & Read Time */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/60 uppercase tracking-wide">
              {article.category?.name || t.defaultCategory}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {t.readingTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              {article.excerpt}
            </p>
          )}

          {/* Author and Date Meta Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-800 to-[#700020] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {(article.author?.name || "Admin")[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {article.author?.name || t.defaultAuthor}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {t.publishedOn}{" "}
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      article.title + " - " + (typeof window !== "undefined" ? window.location.href : "")
                    )}`,
                    "_blank"
                  )
                }
                className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title={t.shareWhatsapp}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`,
                    "_blank"
                  )
                }
                className="p-2.5 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                title={t.shareLinkedin}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74v-8.37H5.06v8.37z" />
                </svg>
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                title={t.copyLink}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE BODY & FEATURED IMAGE */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {article.thumbnailUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full max-h-[460px] object-cover"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="prose prose-slate max-w-none">
            {renderFormattedContent(article.content)}
          </div>

          {/* Bottom Tags & Share */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.topics}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-100">
                {article.category?.name || (lang === "en" ? "Digital Technology" : "Teknologi Digital")}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {t.topicDefault2}
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 hover:text-rose-900"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareThisArticle}</span>
            </button>
          </div>
        </div>

        {/* AUTHOR BIO CARD */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-800 to-[#700020] text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
            {(article.author?.name || "A")[0]}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base">
              {t.writtenBy} {article.author?.name || (lang === "en" ? "Enterprise Specialist" : "Tim Ahli Teknologi")}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {t.authorRole} {profile.companyName || "Nusantara Tech"}.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0b0f17] via-rose-950 to-[#0b0f17] text-white relative overflow-hidden shadow-xl border border-rose-900/40">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.ctaHeadline}
          </h3>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t.ctaDesc} {profile.companyName || "Nusantara Tech"}.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/#contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-800 to-[#700020] hover:from-rose-700 hover:to-rose-900 text-white font-semibold text-sm transition-all shadow-md shadow-rose-900/30"
            >
              {t.ctaSchedule}
            </Link>
            <Link
              href="/articles"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
            >
              {t.ctaMoreArticles}
            </Link>
          </div>
        </div>
      </main>

      {/* MEGA FOOTER RESMI (ALA PRIVY.ID ENTERPRISE) */}
      <footer className="bg-[#0b0f17] text-slate-400 pt-16 pb-12 border-t border-slate-800/80 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
            {/* Kolom 1: Profil Perusahaan (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.companyName || "Logo"}
                    className="h-10 w-auto max-w-[140px] object-contain rounded-lg border border-slate-700 p-1 bg-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-rose-900 flex items-center justify-center text-white font-bold text-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className="text-base font-bold text-white tracking-tight block">
                    {profile.companyName}
                  </span>
                  <span className="text-[10px] tracking-wider text-rose-400 uppercase font-bold">
                    {profile.tagline || t.taglineDefault}
                  </span>
                </div>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed pr-4">
                {lang === "en" ? t.footerAbout : (profile.about || t.footerAbout)}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ISO 27001 Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  Enterprise Grade
                </span>
              </div>
            </div>

            {/* Kolom 2: Solusi & Produk (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.solutionsTitle}
              </h4>
              <ul className="space-y-2 text-xs">
                {t.solutionsList.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="hover:text-rose-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 3: Navigasi Perusahaan (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.companyTitle}
              </h4>
              <ul className="space-y-2 text-xs">
                {t.companyList.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="hover:text-rose-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4: Kantor & Kontak Resmi (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.contactTitle}
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {profile.address || "Jakarta, Indonesia"}
                  </span>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                    <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.whatsapp && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>{t.chatWhatsapp}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Clean Corporate Copyright & Quick Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {currentYear} {profile.companyName || "Nusantara Tech"}. {t.allRights}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-300 transition-colors">{t.home}</Link>
              <span className="text-slate-700">•</span>
              <Link href="/articles" className="hover:text-slate-300 transition-colors">{t.allArticles}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t.backToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-800 to-[#700020] hover:from-rose-700 hover:to-rose-900 text-white flex items-center justify-center shadow-xl hover:shadow-2xl border border-white/25 active:scale-90 transition-all duration-300 group cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default function ArticleDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center font-sans text-slate-500">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 border-2 border-rose-800 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Memuat artikel...</span>
          </div>
        </div>
      }
    >
      <ArticleDetailContent />
    </React.Suspense>
  );
}
