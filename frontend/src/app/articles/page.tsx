"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search,
  Calendar,
  User,
  Clock,
  Sparkles,
  Building2,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
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

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  category?: { id: string; name: string } | null;
  author?: { id: string; name: string } | null;
}

const translations = {
  id: {
    pageTitle: "Artikel & Wawasan",
    taglineDefault: "Solusi Teknologi Enterprise",
    home: "Beranda",
    consult: "Konsultasi Solusi",
    badge: "PUSAT WAWASAN & ARTIKEL RESMI",
    heading: "Wawasan, Berita & Panduan Industri",
    subtitle: "Temukan analisis mendalam, tren arsitektur perangkat lunak, serta praktik terbaik transformasi teknologi untuk bisnis Anda.",
    searchPlaceholder: "Cari artikel berdasarkan judul atau topik wawasan...",
    allCategories: "Semua",
    loading: "Memuat artikel dari database...",
    noArticlesTitle: "Tidak ada artikel yang ditemukan",
    noArticlesDesc: 'Coba kata kunci pencarian yang lain atau pilih kategori "Semua".',
    defaultCategory: "Wawasan Bisnis",
    minRead: "5 min baca",
    readMore: "Baca Selengkapnya",
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
    pageTitle: "Articles & Insights",
    taglineDefault: "Enterprise Digital Solutions",
    home: "Home",
    consult: "Consult Solution",
    badge: "OFFICIAL ARTICLES & INSIGHTS",
    heading: "Perspectives, Industry News & Guides",
    subtitle: "Explore in-depth analyses, modern software engineering trends, and digital transformation best practices for enterprises.",
    searchPlaceholder: "Search articles by title, topic, or keyword...",
    allCategories: "All",
    loading: "Loading articles from database...",
    noArticlesTitle: "No articles found",
    noArticlesDesc: 'Try adjusting your search keywords or select the "All" category.',
    defaultCategory: "Business Insights",
    minRead: "5 min read",
    readMore: "Read Full Article",
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

export default function ArticlesPage() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [profile, setProfile] = useState<any>({
    companyName: "",
    logoUrl: "",
    tagline: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
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
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const t = translations[lang];

  useEffect(() => {
    // Fetch profile
    fetch(`${API_BASE_URL}/api/company-profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.companyName) {
          setProfile(d);
          document.title = `${t.pageTitle} - ${d.companyName}`;
        }
      })
      .catch(() => {});

    // Fetch published articles
    fetch(`${API_BASE_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data.filter((a: any) => a.status === "PUBLISHED" || !a.status));
        }
      })
      .catch((err) => console.error("Gagal memuat artikel:", err))
      .finally(() => setLoading(false));
  }, [t.pageTitle]);

  const categories = [
    { key: "ALL", label: t.allCategories },
    ...Array.from(new Set(articles.map((a) => a.category?.name || (lang === "en" ? "Technology" : "Teknologi")))).map((name) => ({
      key: name,
      label: name,
    })),
  ];

  // Filter articles by search query and category
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    const catName = art.category?.name || (lang === "en" ? "Technology" : "Teknologi");
    const matchesCategory =
      selectedCategory === "ALL" ||
      selectedCategory === t.allCategories ||
      catName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
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
                  {profile.tagline || "Enterprise Digital Solutions"}
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
                href="/"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-rose-800 hover:bg-rose-50/70 border border-slate-200/80 transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.home}</span>
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

      {/* HERO BANNER */}
      <section className="bg-gradient-to-b from-rose-50/50 via-white to-slate-100 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-4">
            <BookOpen className="w-4 h-4 text-rose-700" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.heading}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-800 text-sm"
            />
          </div>

          {/* CATEGORIES FILTER */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat.key
                    ? "bg-rose-800 text-white shadow-md shadow-rose-900/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-rose-800 border-t-transparent rounded-full mb-4" />
            <p>{t.loading}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">{t.noArticlesTitle}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {t.noArticlesDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {art.thumbnailUrl ? (
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={art.thumbnailUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gradient-to-tr from-slate-900 to-rose-950 flex items-center justify-center text-white/40">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md">
                        {art.category?.name || t.defaultCategory}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {t.minRead}
                      </span>
                    </div>

                    <Link href={`/articles/${art.slug}`}>
                      <h2 className="font-bold text-slate-900 text-lg group-hover:text-rose-800 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {art.excerpt || (art.content ? art.content.slice(0, 140) + "..." : "")}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(art.publishedAt || art.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <Link
                    href={`/articles/${art.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-rose-800 hover:text-rose-950 transition-colors group/btn"
                  >
                    <span>{t.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* MEGA FOOTER RESMI (ALA PRIVY.ID ENTERPRISE) */}
      <footer className="bg-[#0b0f17] text-slate-400 pt-16 pb-12 border-t border-slate-800/80 mt-auto">
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
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
              <Link href="/articles" className="hover:text-slate-300 transition-colors">{t.pageTitle}</Link>
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
