"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Zap,
  Users,
  Award,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
  Building2,
  Lock,
  BookOpen,
  FileCheck,
  Check,
  Menu,
  X,
  ArrowUp,
  Clock,
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

const translations = {
  id: {
    announcementBadge: "PENGUMUMAN RESMI",
    announcements: [
      "🚀 Platform Solusi Rekayasa Software Berkinerja Tinggi, Keamanan Siber & Transformasi Digital Enterprise Terintegrasi.",
      "🔒 Standar Keamanan Enkripsi AES-256 GCM & Kepatuhan Tata Kelola Perlindungan Data ISO 27001.",
      "⚡ SLA Keandalan Infrastruktur Cloud & Jaringan Transaksi 99.9% Uptime 24/7.",
      "💼 Hubungi Tim Konsultan Ahli untuk Audit Sistem & Akselerasi Bisnis Anda.",
    ],
    nav: {
      about: "Tentang Kami",
      services: "Produk & Layanan",
      clients: "Mitra & Klien",
      articles: "Artikel & Berita",
      contact: "Kontak",
      catalog: "Katalog Artikel",
      consultationCta: "Konsultasi Proyek",
    },
    hero: {
      defaultBadge: "SOLUSI TEKNOLOGI ENTERPRISE TERPERCAYA",
      primaryCta: "Konsultasi Proyek Gratis",
      secondaryCta: "Jelajahi Layanan Kami",
      trust1: "Arsitektur Skalabel & Aman",
      trust2: "Kepatuhan Regulasi Industri",
      trust3: "Pendampingan Teknis Dedicated",
    },
    metrics: {
      isoLabel: "Keamanan Informasi Terstandar",
      encryptionLabel: "Enkripsi Data End-to-End",
      slaLabel: "SLA Keandalan Layanan",
      supportLabel: "Dukungan Tim Ahli Siaga",
    },
    about: {
      badge: "Tentang Kami",
      headline: "Mendedikasikan Keahlian Terbaik untuk Kesuksesan Mitra Kami",
      visionTitle: "Visi Perusahaan",
      missionTitle: "Misi Strategis",
      defaultVision: "Menjadi mitra rekayasa teknologi dan solusi digital enterprise terdepan di Asia Tenggara dengan keunggulan inovasi dan integritas prima.",
      defaultMission: "Menghadirkan infrastruktur digital yang aman, skalabel, serta memacu pertumbuhan bisnis mitra melalui transformasi teknologi berkelanjutan.",
      valuesIntro: "Prinsip yang membimbing setiap baris kode dan strategi yang kami kembangkan:",
      valuesList: [
        { label: "Orientasi Hasil Bisnis", desc: "Setiap fitur yang dirancang berfokus pada efisiensi operasional dan peningkatan profit mitra." },
        { label: "Keamanan Tanpa Kompromi", desc: "Penerapan arsitektur Zero-Trust, enkripsi standar militer, dan kepatuhan penuh regulasi." },
        { label: "Integritas & Transparansi", desc: "Komunikasi terbuka, timeline terukur, serta komitmen kualitas dalam setiap tahap pengerjaan." },
      ],
    },
    services: {
      badge: "LAYANAN & PRODUK UNGGULAN",
      headline: "Solusi Teknologi Komprehensif Berstandar Enterprise",
      subtitle: "Dirancang untuk menjawab kompleksitas kebutuhan bisnis dengan efisiensi tinggi, keamanan prima, dan skalabilitas jangka panjang.",
      consultService: "Konsultasi Solusi",
    },
    articles: {
      badge: "ARTIKEL & WAWASAN RESMI",
      headline: "Wawasan Terkini Seputar Inovasi Digital",
      viewAll: "Lihat Semua Artikel",
      readInsight: "Baca Wawasan",
      readMore: "Baca Lengkap",
      minRead: "min baca",
      provenTrust: "PROVEN TRUST",
      watermarks: {
        security: "KEAMANAN",
        efficiency: "EFISIENSI",
        automation: "OTOMASI",
        digitalIdentity: "IDENTITAS DIGITAL",
      },
    },
    clients: {
      badge: "JARINGAN MITRA STRATEGIS",
      headline: "Dipercaya oleh Korporasi & Lembaga Terkemuka",
      subtitle: "Membangun ekosistem bisnis digital yang kokoh melalui kolaborasi berkelanjutan dan kepatuhan standar industri tertinggi.",
    },
    contact: {
      badge: "Hubungi Kami",
      headline: "Mari Diskusikan Ide & Kebutuhan Proyek Anda",
      desc: "Tim konsultan kami siap memberikan penilaian teknis gratis dan rencana roadmap solusi terbaik untuk bisnis Anda.",
      officeAddress: "Alamat Kantor",
      officialEmail: "Email Resmi",
      phoneWhatsapp: "Telepon & WhatsApp",
      fullName: "Nama Lengkap",
      fullNamePlaceholder: "Contoh: Budi Pratama",
      email: "Email Bisnis",
      emailPlaceholder: "budi@perusahaan.com",
      phone: "Nomor WhatsApp",
      phonePlaceholder: "+62 812-3456-7890",
      serviceNeed: "Kebutuhan Solusi / Layanan",
      servicesOptions: [
        { value: "Custom Software Development", label: "Pengembangan Software Kustom" },
        { value: "Enterprise Cloud Infrastructure", label: "Infrastruktur Cloud Skala Enterprise" },
        { value: "Cyber Security & Auditing", label: "Keamanan Siber & Audit Penetrasi" },
        { value: "AI Integration & Data Analytics", label: "Integrasi AI & Analitik Prediktif" },
        { value: "Digital Business Transformation", label: "Transformasi Bisnis Digital" },
      ],
      message: "Pesan / Kebutuhan Solusi",
      messagePlaceholder: "Jelaskan ringkasan kebutuhan proyek, anggaran, atau tantangan bisnis Anda...",
      sendBtn: "Kirim Pesan Konsultasi",
      sending: "Mengirimkan Pesan...",
      successTitle: "Terima Kasih! Pesan Berhasil Terkirim.",
      successDesc: "Tim spesialis kami akan segera meninjau kebutuhan Anda dan menghubungi kembali dalam waktu 1x24 jam.",
      sendAnother: "Kirim Pesan Lainnya",
    },
    footer: {
      companyDesc: "Penyedia solusi rekayasa perangkat lunak enterprise, infrastruktur cloud skalabel, dan keamanan siber bersertifikasi untuk akselerasi pertumbuhan bisnis modern.",
      solutionsTitle: "Solusi & Layanan",
      solutionsList: [
        { label: "Arsitektur Web & Cloud", href: "#services" },
        { label: "Audit Keamanan Siber", href: "#services" },
        { label: "Integrasi AI & Analitik", href: "#services" },
        { label: "Digitalisasi Alur Kerja ERP", href: "#services" },
        { label: "Konsultasi Infrastruktur", href: "#contact" },
      ],
      quickLinksTitle: "Tautan Cepat",
      quickLinks: [
        { label: "Tentang Kami", href: "#about" },
        { label: "Visi & Misi Utama", href: "#about" },
        { label: "Mitra & Portofolio", href: "#clients" },
        { label: "Wawasan & Artikel", href: "/articles", isLink: true },
        { label: "Hubungi Tim Ahli", href: "#contact" },
        { label: "Portal Admin CMS", href: "http://localhost:5173", targetBlank: true },
      ],
      contactTitle: "Kantor & Kontak Resmi",
      chatWhatsapp: "Chat WhatsApp Resmi",
      slaActive: "SLA Keandalan Sistem 99.9% Aktif & Terlindungi",
      allRights: "Hak Cipta Dilindungi Undang-Undang.",
      backToTop: "Kembali ke atas",
    },
    heroSlidesFallback: [
      {
        title: "Membangun Fondasi Digital Tangguh untuk Pertumbuhan Bisnis",
        subtitle: "Kami memadukan standar rekayasa software berkinerja tinggi, arsitektur cloud aman, dan ekosistem digital terintegrasi untuk akselerasi pertumbuhan perusahaan Anda.",
        badge: "SOLUSI TEKNOLOGI ENTERPRISE TERPERCAYA",
        layout: "CENTER",
      },
      {
        title: "Infrastruktur Cloud Skalabel dengan Keamanan Siber Standar Global",
        subtitle: "Optimasi beban server, otomatisasi workflow DevOps, dan perlindungan data transaksi dengan enkripsi AES-256 serta sertifikasi ISO 27001.",
        badge: "INFRASTRUKTUR CLOUD & KEAMANAN TINGGI",
        layout: "SPLIT",
        splitTitle: "Solusi Khusus Korporasi & Lembaga",
        splitSubtitle: "Dukungan SLA 99.9%, integrasi API enterprise terisolasi, enkripsi kustom AES-256, dan audit kepatuhan regulasi berkala.",
        splitCtaText: "Konsultasi Enterprise",
      },
      {
        title: "Transformasi Digital Cerdas Berbasis AI & Analitik Prediktif",
        subtitle: "Tingkatkan efisiensi operasional hingga 40% dengan integrasi sistem kecerdasan buatan, visualisasi data real-time, dan otomasi proses bisnis.",
        badge: "AI & DATA ANALYTICS INTEGRATION",
        layout: "LEFT",
      },
    ],
  },
  en: {
    announcementBadge: "OFFICIAL ANNOUNCEMENT",
    announcements: [
      "🚀 High-Performance Enterprise Software Engineering, Cybersecurity & Digital Transformation Platform.",
      "🔒 AES-256 GCM Encryption Standards & ISO 27001 Data Protection Governance Compliance.",
      "⚡ 99.9% Uptime 24/7 Cloud Infrastructure & Transaction Network Reliability SLA.",
      "💼 Contact Our Expert Consultants for System Audits & Enterprise Acceleration.",
    ],
    nav: {
      about: "About Us",
      services: "Products & Services",
      clients: "Partners & Clients",
      articles: "Articles & News",
      contact: "Contact",
      catalog: "Article Catalog",
      consultationCta: "Project Consultation",
    },
    hero: {
      defaultBadge: "TRUSTED ENTERPRISE TECHNOLOGY SOLUTIONS",
      primaryCta: "Free Project Consultation",
      secondaryCta: "Explore Our Services",
      trust1: "Scalable & Secure Architecture",
      trust2: "Industry & Governance Compliance",
      trust3: "Dedicated Engineering Support",
    },
    metrics: {
      isoLabel: "Standardized Information Security",
      encryptionLabel: "End-to-End Data Encryption",
      slaLabel: "Service Reliability SLA",
      supportLabel: "24/7 Expert Standby Support",
    },
    about: {
      badge: "About Us",
      headline: "Dedicated to Engineering Excellence for Our Partners' Success",
      visionTitle: "Company Vision",
      missionTitle: "Strategic Mission",
      defaultVision: "To become the leading enterprise technology and digital solutions partner in Southeast Asia through superior innovation and exceptional integrity.",
      defaultMission: "Delivering secure, scalable digital infrastructure and driving partner business growth through sustainable technological transformation.",
      valuesIntro: "Guiding principles driving every line of code and digital strategy we engineer:",
      valuesList: [
        { label: "Business Outcome Focused", desc: "Every architecture and feature is engineered to accelerate operational efficiency and drive measurable ROI." },
        { label: "Uncompromising Security", desc: "Adherence to Zero-Trust architecture, military-grade encryption, and full international compliance." },
        { label: "Integrity & Transparency", desc: "Open communication, measurable milestones, and an uncompromising commitment to engineering quality." },
      ],
    },
    services: {
      badge: "FEATURED SERVICES & PRODUCTS",
      headline: "Comprehensive Enterprise-Grade Tech Solutions",
      subtitle: "Engineered to address complex business needs with high efficiency, robust security, and long-term scalability.",
      consultService: "Consult Solution",
    },
    articles: {
      badge: "OFFICIAL ARTICLES & INSIGHTS",
      headline: "Latest Perspectives on Digital Innovation",
      viewAll: "View All Articles",
      readInsight: "Read Insights",
      readMore: "Read Full Story",
      minRead: "min read",
      provenTrust: "PROVEN TRUST",
      watermarks: {
        security: "SECURITY",
        efficiency: "EFFICIENCY",
        automation: "AUTOMATION",
        digitalIdentity: "DIGITAL IDENTITY",
      },
    },
    clients: {
      badge: "STRATEGIC PARTNERS NETWORK",
      headline: "Trusted by Leading Enterprises & Institutions",
      subtitle: "Building resilient digital ecosystems through continuous collaboration and uncompromising industry standards.",
    },
    contact: {
      badge: "Contact Us",
      headline: "Let's Discuss Your Project Goals & Requirements",
      desc: "Our specialized consulting team is ready to provide a complimentary technical assessment and tailored solution roadmap for your business.",
      officeAddress: "Office Address",
      officialEmail: "Official Email",
      phoneWhatsapp: "Phone & WhatsApp",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., Alex Johnson",
      email: "Business Email",
      emailPlaceholder: "alex@company.com",
      phone: "WhatsApp Number",
      phonePlaceholder: "+62 812-3456-7890",
      serviceNeed: "Solution / Service Need",
      servicesOptions: [
        { value: "Custom Software Development", label: "Custom Software Development" },
        { value: "Enterprise Cloud Infrastructure", label: "Enterprise Cloud Infrastructure" },
        { value: "Cyber Security & Auditing", label: "Cybersecurity & Security Auditing" },
        { value: "AI Integration & Data Analytics", label: "AI Integration & Predictive Analytics" },
        { value: "Digital Business Transformation", label: "Digital Business Transformation" },
      ],
      message: "Message / Project Details",
      messagePlaceholder: "Describe your project scope, timeline, budget, or business challenges...",
      sendBtn: "Send Consultation Request",
      sending: "Sending Message...",
      successTitle: "Thank You! Message Successfully Sent.",
      successDesc: "Our enterprise specialists will review your requirements and reach out within 24 hours.",
      sendAnother: "Send Another Message",
    },
    footer: {
      companyDesc: "Integrated provider of enterprise software engineering, scalable cloud infrastructure, and certified cybersecurity for accelerating modern business growth.",
      solutionsTitle: "Solutions & Services",
      solutionsList: [
        { label: "Web & Cloud Architecture", href: "#services" },
        { label: "Cybersecurity Auditing", href: "#services" },
        { label: "AI Integration & Analytics", href: "#services" },
        { label: "ERP Workflow Automation", href: "#services" },
        { label: "Infrastructure Consulting", href: "#contact" },
      ],
      quickLinksTitle: "Quick Navigation",
      quickLinks: [
        { label: "About Us", href: "#about" },
        { label: "Vision & Strategic Mission", href: "#about" },
        { label: "Partners & Portfolio", href: "#clients" },
        { label: "Articles & Insights", href: "/articles", isLink: true },
        { label: "Contact Expert Team", href: "#contact" },
        { label: "Admin CMS Portal", href: "http://localhost:5173", targetBlank: true },
      ],
      contactTitle: "Official Office & Contact",
      chatWhatsapp: "Official WhatsApp Chat",
      slaActive: "System Reliability SLA 99.9% Active & Protected",
      allRights: "All Rights Reserved.",
      backToTop: "Back to top",
    },
    heroSlidesFallback: [
      {
        title: "Engineering Resilient Digital Foundations for Enterprise Growth",
        subtitle: "We combine high-performance software engineering, secure cloud architecture, and integrated digital ecosystems to accelerate your enterprise scalability.",
        badge: "TRUSTED ENTERPRISE TECHNOLOGY SOLUTIONS",
        layout: "CENTER",
      },
      {
        title: "Scalable Cloud Infrastructure with Global-Standard Cybersecurity",
        subtitle: "Server workload optimization, DevOps automated workflows, and data protection with AES-256 encryption and ISO 27001 compliance.",
        badge: "HIGH-SECURITY CLOUD INFRASTRUCTURE",
        layout: "SPLIT",
        splitTitle: "Dedicated Solutions for Enterprise & Institutions",
        splitSubtitle: "99.9% uptime SLA commitments, isolated VPC enterprise API integration, AES-256 encryption, and regular regulatory compliance audits.",
        splitCtaText: "Enterprise Consultation",
      },
      {
        title: "Intelligent Digital Transformation Powered by AI & Predictive Analytics",
        subtitle: "Boost operational efficiency by up to 40% with automated AI workflows, real-time data streaming, and predictive business intelligence.",
        badge: "AI & PREDICTIVE ANALYTICS INTEGRATION",
        layout: "LEFT",
      },
    ],
  },
};

export default function Home() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navTheme, setNavTheme] = useState<"dark" | "light">("dark");
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [articleBatchIndex, setArticleBatchIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [profile, setProfile] = useState<any>({
    companyName: "",
    tagline: "",
    logoUrl: "",
    about: "",
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    vision: "",
    mission: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Custom Software Development",
    message: "",
  });
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);

  useEffect(() => {
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
    setCurrentYear(new Date().getFullYear());
    fetch(`${API_BASE_URL}/api/company-profile`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.companyName) {
          setProfile(data);
          // Set dynamic browser tab title & favicon
          const dynamicTitle = data.tagline
            ? `${data.companyName} - ${data.tagline}`
            : data.companyName;
          document.title = dynamicTitle;

          if (data.logoUrl) {
            let link: HTMLLinkElement | null =
              document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement("link");
              link.rel = "icon";
              document.head.appendChild(link);
            }
            link.href = data.logoUrl;
          }
        }
      })
      .catch((err) => console.log("Fallback profile:", err));

    // Fetch dynamic clients & logos from PostgreSQL
    fetch(`${API_BASE_URL}/api/clients`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setClientsList(data.filter((c: any) => c.isActive !== false));
        }
      })
      .catch((err) => console.log("Fallback clients:", err));

    // Fetch dynamic articles from PostgreSQL
    fetch(`${API_BASE_URL}/api/articles`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArticlesList(data.filter((a: any) => a.status === "PUBLISHED" || !a.status));
        }
      })
      .catch((err) => console.log("Fallback articles:", err));

    // Fetch dynamic hero slides from PostgreSQL
    fetch(`${API_BASE_URL}/api/hero-slides`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHeroSlides(data.filter((s: any) => s.isActive !== false));
        }
      })
      .catch((err) => console.log("Fallback hero slides:", err));

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Rahasia Admin: Tekan Ctrl + Shift + A (atau Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        window.open("http://localhost:5173", "_blank");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const defaultHeroSlides = [
    {
      id: "slide-1",
      title: "Membangun Fondasi Digital Tangguh untuk Pertumbuhan Bisnis",
      subtitle:
        "Kami memadukan standar rekayasa software berkinerja tinggi, arsitektur cloud aman, dan ekosistem digital terintegrasi untuk akselerasi pertumbuhan perusahaan Anda.",
      badge: "SOLUSI TEKNOLOGI ENTERPRISE TERPERCAYA",
      layout: "CENTER",
      primaryCtaText: "Konsultasi Proyek Gratis",
      primaryCtaUrl: "#contact",
      secondaryCtaText: "Jelajahi Layanan Kami",
      secondaryCtaUrl: "#services",
      imageUrl: null,
    },
    {
      id: "slide-2",
      title: "Infrastruktur Cloud Skalabel dengan Keamanan Siber Standar Global",
      subtitle:
        "Optimasi beban server, otomatisasi workflow DevOps, dan perlindungan data transaksi dengan enkripsi AES-256 serta sertifikasi ISO 27001.",
      badge: "INFRASTRUKTUR CLOUD & KEAMANAN TINGGI",
      layout: "SPLIT",
      primaryCtaText: "Diskusikan Arsitektur Cloud",
      primaryCtaUrl: "#contact",
      secondaryCtaText: "Lihat Layanan Kami",
      secondaryCtaUrl: "#services",
      splitTitle: "Solusi Khusus Korporasi & Lembaga",
      splitSubtitle:
        "Dukungan SLA 99.9%, integrasi API enterprise terisolasi, enkripsi kustom AES-256, dan audit kepatuhan regulasi berkala.",
      splitCtaText: "Konsultasi Enterprise",
      splitCtaUrl: "#contact",
      imageUrl: null,
    },
    {
      id: "slide-3",
      title: "Transformasi Digital Cerdas Berbasis AI & Analitik Prediktif",
      subtitle:
        "Tingkatkan efisiensi operasional hingga 40% dengan integrasi sistem kecerdasan buatan, visualisasi data real-time, dan otomasi proses bisnis.",
      badge: "AI & DATA ANALYTICS INTEGRATION",
      layout: "LEFT",
      primaryCtaText: "Mulai Transformasi Digital",
      primaryCtaUrl: "#contact",
      secondaryCtaText: "Baca Wawasan Terbaru",
      secondaryCtaUrl: "/articles",
      imageUrl: null,
    },
  ];

  const activeHeroSlides = heroSlides.length > 0 ? heroSlides : defaultHeroSlides;
  const currentHeroSlide = activeHeroSlides[currentSlideIndex % activeHeroSlides.length];
  const fallbackHeroSlide = t.heroSlidesFallback[currentSlideIndex % t.heroSlidesFallback.length];
  const slideLayout = (currentHeroSlide as any)?.layout || (fallbackHeroSlide as any)?.layout || "CENTER";

  const slideBadge =
    lang === "en" && fallbackHeroSlide?.badge
      ? fallbackHeroSlide.badge
      : currentHeroSlide.badge || t.hero.defaultBadge;

  const slideTitle =
    lang === "en" && fallbackHeroSlide?.title
      ? fallbackHeroSlide.title
      : currentHeroSlide.title;

  const slideSubtitle =
    lang === "en" && fallbackHeroSlide?.subtitle
      ? fallbackHeroSlide.subtitle
      : currentHeroSlide.subtitle;

  const slideSplitTitle =
    lang === "en" && (fallbackHeroSlide as any)?.splitTitle
      ? (fallbackHeroSlide as any).splitTitle
      : (currentHeroSlide as any)?.splitTitle ||
        (lang === "en" ? "Dedicated Solutions for Enterprise & Institutions" : "Solusi Khusus Korporasi & Lembaga");

  const slideSplitSubtitle =
    lang === "en" && (fallbackHeroSlide as any)?.splitSubtitle
      ? (fallbackHeroSlide as any).splitSubtitle
      : (currentHeroSlide as any)?.splitSubtitle ||
        (lang === "en"
          ? "Custom enterprise security infrastructure, dedicated engineering team, SLA guarantees, and full regulatory compliance."
          : "Infrastruktur cloud berdedikasi tinggi, pemenuhan standar regulasi ISO 27001, audit keamanan rutin, serta dukungan teknis 24/7.");

  const slideSplitCta =
    lang === "en" && (fallbackHeroSlide as any)?.splitCtaText
      ? (fallbackHeroSlide as any).splitCtaText
      : (currentHeroSlide as any)?.splitCtaText ||
        (lang === "en" ? "Enterprise Consultation" : "Konsultasi Enterprise");

  const slideSplitCtaUrl = (currentHeroSlide as any)?.splitCtaUrl || "#contact";

  useEffect(() => {
    if (!isAutoPlaying || activeHeroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeHeroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeHeroSlides.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.log("Inquiry send fallback:", err);
    }

    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", service: "Custom Software Development", message: "" });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);

      const hero = document.getElementById("hero-section");
      const footer = document.getElementById("main-footer");

      let isOverDark = false;

      // Cek apakah navbar berada di atas section bernuansa gelap (Hero atau Mega Footer)
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        // Navbar berada di rentang 20px - 70px dari atas viewport
        if (heroRect.top <= 65 && heroRect.bottom >= 45) {
          isOverDark = true;
        }
      }

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= 65 && footerRect.bottom >= 45) {
          isOverDark = true;
        }
      }

      setNavTheme(isOverDark ? "dark" : "light");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const services = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Enterprise Web & Cloud Solutions",
      desc:
        lang === "id"
          ? "Pengembangan sistem web skala besar dengan arsitektur microservices, performa tinggi, dan skalabilitas tanpa batas."
          : "Large-scale enterprise web and cloud systems with microservices architecture, ultra-high performance, and infinite scalability.",
      tags: ["Next.js", "NestJS", "Kubernetes"],
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: lang === "id" ? "Cyber Security & Auditing" : "Cybersecurity & Security Auditing",
      desc:
        lang === "id"
          ? "Perlindungan aset digital perusahaan, pengujian penetrasi (pen-test), serta kepatuhan standar keamanan data ISO/IEC."
          : "Enterprise digital asset protection, penetration testing, and international ISO/IEC data governance compliance.",
      tags: ["ISO 27001", "Pen-testing", "Zero-Trust"],
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: lang === "id" ? "AI Integration & Data Analytics" : "AI Integration & Predictive Analytics",
      desc:
        lang === "id"
          ? "Implementasi kecerdasan buatan, pemrosesan data real-time, dan dashboard analitik prediktif untuk keputusan bisnis presisi."
          : "AI system implementation, real-time data streaming, and predictive analytics dashboards for precision business decisions.",
      tags: ["LLM", "Data Pipeline", "BI Dashboard"],
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: lang === "id" ? "Digital Business Transformation" : "Digital Business Transformation",
      desc:
        lang === "id"
          ? "Modernisasi operasional bisnis konvensional menjadi ekosistem digital otomatis yang hemat biaya dan efisien."
          : "Modernizing legacy business operations into automated, cost-effective, and streamlined digital ecosystems.",
      tags: ["Workflow ERP", "API Automation", "CRM"],
    },
  ];

  const defaultArticles = [
    {
      id: "art-1",
      title: "Tren Arsitektur Microservices Modern Menggunakan Go dan NestJS di 2026",
      slug: "tren-arsitektur-microservices-2026",
      category: { name: "Teknologi & Backend" },
      date: "18 Oktober 2026",
      readTime: "5 min baca",
      summary: "Pelajari bagaimana perusahaan teknologi terkemuka mengoptimalkan resource server hingga 40% dengan arsitektur terdistribusi.",
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "art-2",
      title: "Pentingnya Standar Keamanan Data Pelanggan untuk Platform Fintech & E-Commerce",
      slug: "standar-keamanan-fintech",
      category: { name: "Keamanan Cyber" },
      date: "14 Oktober 2026",
      readTime: "7 min baca",
      summary: "Langkah-langkah esensial mengamankan data transaksi digital dari ancaman serangan siber yang kian canggih.",
      thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "art-3",
      title: "Meningkatkan ROI Bisnis 2x Lipat Melalui Otomasi Workflow Perusahaan",
      slug: "meningkatkan-roi-otomasi-workflow",
      category: { name: "Strategi Bisnis" },
      date: "10 Oktober 2026",
      readTime: "4 min baca",
      summary: "Studi kasus implementasi digitalisasi proses internal pada manufaktur dan logistik nasional.",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const allArticles = articlesList.length > 0 ? articlesList : defaultArticles;
  const articlesPerPage = 4;
  const totalArticlePages = Math.max(1, Math.ceil(allArticles.length / articlesPerPage));
  const currentBatch = allArticles.slice(
    articleBatchIndex * articlesPerPage,
    articleBatchIndex * articlesPerPage + articlesPerPage
  );

  const card1 = currentBatch[0] || allArticles[0];
  const card2 = currentBatch[1] || allArticles[1 % allArticles.length];
  const card3 = currentBatch[2] || allArticles[2 % allArticles.length];
  const card4 = currentBatch[3] || allArticles[3 % allArticles.length];

  const handlePrevArticles = () => {
    setArticleBatchIndex((prev) => (prev > 0 ? prev - 1 : totalArticlePages - 1));
  };

  const handleNextArticles = () => {
    setArticleBatchIndex((prev) => (prev + 1) % totalArticlePages);
  };

  const defaultClients = [
    { companyName: "Bank Artha Prima", category: "Perbankan & Finansial", logoUrl: null, websiteUrl: null },
    { companyName: "Nusantara Logistik", category: "Supply Chain & Logistik", logoUrl: null, websiteUrl: null },
    { companyName: "Medika Sehat Mandiri", category: "Kesehatan & Farmasi", logoUrl: null, websiteUrl: null },
    { companyName: "Telko Global Indonesia", category: "Telekomunikasi", logoUrl: null, websiteUrl: null },
    { companyName: "Aero Mandiri Raya", category: "Transportasi Udara", logoUrl: null, websiteUrl: null },
    { companyName: "Karya Cipta Edukasi", category: "Pendidikan & EdTech", logoUrl: null, websiteUrl: null },
  ];

  const activeClients = clientsList.length > 0 ? clientsList : defaultClients;
  // Gandakan item untuk pergerakan infinite marquee yang halus dan seamless
  const marqueeClients = [...activeClients, ...activeClients, ...activeClients];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Chief Technology Officer",
      company: "PT Finansial Unggul",
      feedback:
        "Solusi teknologi yang dihadirkan sangat melebihi ekspektasi. Website dan sistem internal kami sekarang mampu menangani lonjakan transaksi jutaan pengguna tanpa downtime.",
      rating: 5,
    },
    {
      name: "Siti Rahmawati",
      role: "Head of Digital Marketing",
      company: "Global Retail Niaga",
      feedback:
        "Portal CMS yang dibangun sangat mudah digunakan oleh tim non-teknis kami. Pengelolaan produk dan artikel dapat kami lakukan secara mandiri dan cepat.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-800 selection:text-white">
      {/* RUNNING TICKER & DOCKED LANGUAGE SWITCHER TOP BAR */}
      <section
        aria-label="Corporate Announcements & Language Switcher"
        className="bg-[#0b0f17] text-slate-300 h-9 overflow-hidden text-xs flex items-center border-b border-slate-800/80 relative z-40"
      >
        <div className="w-full flex items-center justify-between h-full">
          {/* Running Text Marquee Area with edge fade */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center py-1">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0b0f17] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0b0f17] to-transparent z-10" />

            <div className="animate-marquee flex items-center whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
              {[...t.announcements, ...t.announcements].map((msg, idx) => (
                <span key={idx} className="inline-flex items-center">
                  <span className="mx-6 tracking-wide text-slate-300 font-medium">{msg}</span>
                  <span className="text-rose-500 font-semibold select-none opacity-70">/</span>
                </span>
              ))}
            </div>
          </div>

          {/* DOCKED DUAL-FLAG LANGUAGE SWITCHER CAPSULE (TRANSFERRED FROM NAVBAR) */}
          <div className="flex items-center pr-3 sm:pr-6 pl-3 sm:pl-4 bg-[#0b0f17] z-20 shrink-0 border-l border-slate-800/80 h-full">
            <div
              role="group"
              aria-label="Select Language"
              className="bg-slate-900/90 border border-slate-800 rounded-full p-0.5 flex items-center h-6.5 shadow-inner"
            >
              <button
                type="button"
                onClick={() => handleLanguageChange("id")}
                className={`flex items-center gap-1.5 px-2.5 h-5.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  lang === "id"
                    ? "bg-rose-950 text-rose-200 border border-rose-800 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Bahasa Indonesia"
              >
                <IndonesiaFlag />
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`flex items-center gap-1.5 px-2.5 h-5.5 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  lang === "en"
                    ? "bg-rose-950 text-rose-200 border border-rose-800 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="English"
              >
                <UkFlag />
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL FLOATING PILL NAVBAR (APPLE IPHONE LIQUID FROSTED GLASS CAPSULE) */}
      <div className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 lg:px-8 transition-all pointer-events-none">
        <header
          className={`max-w-6xl mx-auto rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 pointer-events-auto backdrop-blur-2xl [backdrop-filter:blur(24px)_saturate(190%)] ${
            navTheme === "light"
              ? "bg-white/80 border border-slate-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-slate-900/5 text-slate-800"
              : "bg-white/15 border border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.5)] ring-1 ring-white/15 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* BRAND PILL */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.companyName || "Logo"}
                  className={`h-9 w-auto max-w-[120px] object-contain rounded-lg p-0.5 shadow-xs group-hover:scale-105 transition-all ${
                    navTheme === "light"
                      ? "bg-white border border-slate-200"
                      : "bg-white/95 border border-white/50 backdrop-blur-md"
                  }`}
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-700 to-[#700020] flex items-center justify-center text-white shadow-md shadow-rose-900/30 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span
                  className={`text-sm sm:text-base font-bold tracking-tight transition-colors leading-tight ${
                    navTheme === "light"
                      ? "text-slate-900 group-hover:text-rose-800"
                      : "text-white group-hover:text-rose-200 drop-shadow-xs"
                  }`}
                >
                  {profile.companyName}
                </span>
                <span
                  className={`text-[9px] tracking-wider uppercase font-bold hidden sm:block ${
                    navTheme === "light" ? "text-rose-800" : "text-rose-200 drop-shadow-xs"
                  }`}
                >
                  {profile.tagline || "Enterprise Digital Solutions"}
                </span>
              </div>
            </Link>

            {/* CENTER CLEAN MENU LINKS */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: t.nav.about, href: "#about" },
                { label: t.nav.services, href: "#services" },
                { label: t.nav.clients, href: "#clients" },
                { label: t.nav.articles, href: "/articles", isLink: true },
                { label: t.nav.contact, href: "#contact" },
              ].map((item, idx) =>
                item.isLink ? (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      navTheme === "light"
                        ? "text-slate-700 hover:text-rose-800 hover:bg-rose-50/70"
                        : "text-white/90 hover:text-white hover:bg-white/15 drop-shadow-xs"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      navTheme === "light"
                        ? "text-slate-700 hover:text-rose-800 hover:bg-rose-50/70"
                        : "text-white/90 hover:text-white hover:bg-white/15 drop-shadow-xs"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>

            {/* RIGHT ACTION PILLS */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              <Link
                href="/articles"
                className={`hidden md:inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-xs ${
                  navTheme === "light"
                    ? "border border-slate-200 bg-white/80 hover:bg-rose-50 hover:border-rose-200 text-slate-700"
                    : "border border-white/25 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md"
                }`}
              >
                {t.nav.catalog}
              </Link>
              <a
                href="#contact"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 ${
                  navTheme === "light"
                    ? "text-white bg-gradient-to-r from-rose-700 via-rose-800 to-[#700020] hover:brightness-110 shadow-rose-950/20"
                    : "text-white bg-gradient-to-r from-rose-500 via-rose-600 to-[#700020] hover:brightness-115 ring-1 ring-white/30 shadow-rose-950/40"
                }`}
              >
                <span>{t.nav.consultationCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* MOBILE HAMBURGER TOGGLE */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-full transition-colors focus:outline-none ${
                  navTheme === "light"
                    ? "text-slate-700 hover:bg-rose-50 hover:text-rose-800"
                    : "text-white hover:bg-white/15"
                }`}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MOBILE DROPDOWN (APPLE FROSTED GLASS) */}
          {mobileMenuOpen && (
            <div
              className={`lg:hidden mt-3 pt-3 pb-2 border-t flex flex-col gap-1 rounded-2xl p-2 ${
                navTheme === "light"
                  ? "border-slate-100 bg-white/95 text-slate-800"
                  : "border-white/20 bg-slate-950/85 backdrop-blur-2xl text-white shadow-2xl"
              }`}
            >
              {[
                { label: t.nav.about, href: "#about" },
                { label: t.nav.services, href: "#services" },
                { label: t.nav.clients, href: "#clients" },
                { label: t.nav.articles, href: "/articles", isLink: true },
                { label: t.nav.contact, href: "#contact" },
              ].map((item, idx) =>
                item.isLink ? (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      navTheme === "light"
                        ? "text-slate-700 hover:bg-rose-50 hover:text-rose-800"
                        : "text-white/90 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      navTheme === "light"
                        ? "text-slate-700 hover:bg-rose-50 hover:text-rose-800"
                        : "text-white/90 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}

              {/* MOBILE LANGUAGE SWITCHER ROW */}
              <div className="pt-2 mt-1 border-t border-slate-200/30 flex items-center justify-between px-3">
                <span className="text-[11px] font-medium opacity-75">Bahasa / Language:</span>
                <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-full border border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("id")}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      lang === "id" ? "bg-rose-950 text-rose-200 border border-rose-800" : "text-slate-400"
                    }`}
                  >
                    <IndonesiaFlag /> ID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en")}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      lang === "en" ? "bg-rose-950 text-rose-200 border border-rose-800" : "text-slate-400"
                    }`}
                  >
                    <UkFlag /> EN
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* CRIMSON HERO CONTAINER: CAROUSEL SLIDES (ALA PRIVY.ID) */}
      <div
        id="hero-section"
        className="relative overflow-hidden text-white transition-colors duration-500 pt-28 -mt-[76px]"
        style={
          profile.heroBgUrl
            ? {
                backgroundImage: `linear-gradient(rgba(74, 4, 24, 0.90), rgba(15, 23, 42, 0.95)), url(${profile.heroBgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: "linear-gradient(180deg, #4c0519 0%, #700020 45%, #0b0f17 100%)",
              }
        }
      >
        {/* HERO CAROUSEL SLIDES (WITH PREV & NEXT + DOTS ALA PRIVY.ID) */}
        <section
          className="pt-8 pb-20 md:pt-12 md:pb-24 relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative min-h-[560px] sm:min-h-[500px] lg:min-h-[500px] flex items-center justify-between">
              {/* PREV BUTTON (PERMANENTLY ANCHORED AT FIXED TOP PIXEL OFFSET) */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="hidden sm:flex absolute -left-2 lg:-left-6 top-[250px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* SLIDE CONTENT - DYNAMIC LAYOUT: SPLIT | LEFT | CENTER */}
              {slideLayout === "SPLIT" ? (
                /* SPLIT 2-COLUMN LAYOUT (ALA PRIVY.ID) */
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 min-h-[560px] sm:min-h-[500px] lg:min-h-[500px] flex flex-col justify-center">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    {/* Left Column */}
                    <div className="flex flex-col items-start text-left">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border shadow-xs bg-white/10 border-white/20 text-rose-200 backdrop-blur-sm shrink-0">
                        <ShieldCheck className="w-4 h-4 text-rose-300" />
                        <span>{slideBadge}</span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.18] text-white">
                        {slideTitle}
                      </h1>

                      <p className="mt-4 text-sm sm:text-base text-rose-100/90 leading-relaxed font-normal">
                        {slideSubtitle}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-3 shrink-0">
                        <a
                          href={currentHeroSlide.primaryCtaUrl || "#contact"}
                          className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-rose-950 bg-white hover:bg-rose-100 transition-all shadow-xl flex items-center gap-2 group active:scale-95"
                        >
                          <span>{currentHeroSlide.primaryCtaText || t.hero.primaryCta}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        {currentHeroSlide.secondaryCtaText && (
                          <a
                            href={currentHeroSlide.secondaryCtaUrl || "#services"}
                            className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all border border-white/30 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 backdrop-blur-sm active:scale-95"
                          >
                            <span>{currentHeroSlide.secondaryCtaText || t.hero.secondaryCta}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Column (Divider ala Privy.id) */}
                    <div className="flex flex-col items-start text-left pt-6 lg:pt-0 border-t border-white/20 lg:border-t-0 lg:border-l lg:border-white/25 lg:pl-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-3 bg-rose-500/20 border border-rose-400/30 text-rose-200">
                        <Building2 className="w-3.5 h-3.5 text-rose-300" />
                        <span>{lang === "en" ? "ENTERPRISE & INSTITUTIONS" : "KORPORASI & ENTERPRISE"}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                        {slideSplitTitle}
                      </h2>

                      <p className="mt-3.5 text-sm sm:text-base text-rose-100/80 leading-relaxed font-normal">
                        {slideSplitSubtitle}
                      </p>

                      <div className="mt-7">
                        <a
                          href={slideSplitCtaUrl}
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-rose-700 to-[#700020] hover:brightness-110 border border-white/25 shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                        >
                          <span>{slideSplitCta}</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Quick Trust Checks */}
                  <div className="mt-10 pt-7 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-rose-100/90 shrink-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust3}</span>
                    </div>
                  </div>
                </div>
              ) : slideLayout === "LEFT" ? (
                /* LEFT-ALIGNED LAYOUT (CLEAN MINIMAL TYPOGRAPHY ALA APPLE / STRIPE) */
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 min-h-[560px] sm:min-h-[500px] lg:min-h-[500px] flex flex-col justify-center">
                  <div className={currentHeroSlide.imageUrl ? "grid lg:grid-cols-12 gap-8 lg:gap-12 items-center" : "max-w-4xl text-left"}>
                    {/* Left Column (Content) */}
                    <div className={currentHeroSlide.imageUrl ? "lg:col-span-7 flex flex-col items-start text-left" : "flex flex-col items-start text-left"}>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border shadow-xs bg-white/10 border-white/20 text-rose-200 backdrop-blur-sm shrink-0">
                        <ShieldCheck className="w-4 h-4 text-rose-300" />
                        <span>{slideBadge}</span>
                      </div>

                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                        {slideTitle}
                      </h1>

                      <p className="mt-5 text-base sm:text-xl text-rose-100/90 leading-relaxed font-normal max-w-3xl">
                        {slideSubtitle}
                      </p>

                      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
                        <a
                          href={currentHeroSlide.primaryCtaUrl || "#contact"}
                          className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-rose-950 bg-white hover:bg-rose-100 transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95"
                        >
                          <span>{currentHeroSlide.primaryCtaText || t.hero.primaryCta}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        {currentHeroSlide.secondaryCtaText && (
                          <a
                            href={currentHeroSlide.secondaryCtaUrl || "#services"}
                            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold transition-all border border-white/30 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 backdrop-blur-sm active:scale-95"
                          >
                            <span>{currentHeroSlide.secondaryCtaText || t.hero.secondaryCta}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Column (Only rendered when genuine image is uploaded) */}
                    {currentHeroSlide.imageUrl && (
                      <div className="lg:col-span-5 flex justify-center">
                        <div className="w-full max-w-md rounded-2xl overflow-hidden border border-white/25 shadow-2xl bg-white/10 backdrop-blur-md p-2">
                          <img
                            src={currentHeroSlide.imageUrl}
                            alt="Hero Visual"
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Trust Checks */}
                  <div className="mt-10 pt-7 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-rose-100/90 shrink-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust3}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* CENTERED LAYOUT (DEFAULT - STABILIZED TYPOGRAPHY) */
                <div className="w-full max-w-4xl mx-auto text-center px-4 flex flex-col justify-center items-center min-h-[560px] sm:min-h-[500px] lg:min-h-[500px]">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border shadow-xs bg-white/10 border-white/20 text-rose-200 backdrop-blur-sm shrink-0">
                    <ShieldCheck className="w-4 h-4 text-rose-300" />
                    <span>{slideBadge}</span>
                  </div>

                  {/* Headline with Fixed Minimum Height Container */}
                  <div className="w-full min-h-[170px] sm:min-h-[155px] lg:min-h-[165px] flex items-center justify-center">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                      {slideTitle}
                    </h1>
                  </div>

                  {/* Subtitle with Fixed Minimum Height Container */}
                  <div className="w-full min-h-[96px] sm:min-h-[80px] lg:min-h-[80px] flex items-center justify-center mt-3">
                    <p className="text-base sm:text-xl text-rose-100/90 leading-relaxed font-normal max-w-3xl mx-auto">
                      {slideSubtitle}
                    </p>
                  </div>

                  {/* DUAL PILL CTA BUTTONS */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 shrink-0">
                    <a
                      href={currentHeroSlide.primaryCtaUrl || "#contact"}
                      className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-rose-950 bg-white hover:bg-rose-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-center group active:scale-95"
                    >
                      <span>{currentHeroSlide.primaryCtaText || t.hero.primaryCta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    {currentHeroSlide.secondaryCtaText && (
                      <a
                        href={currentHeroSlide.secondaryCtaUrl || "#services"}
                        className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold transition-all border border-white/30 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 text-center backdrop-blur-sm active:scale-95"
                      >
                        <span>{currentHeroSlide.secondaryCtaText || t.hero.secondaryCta}</span>
                      </a>
                    )}
                  </div>

                  {/* Quick Trust Checks */}
                  <div className="mt-10 pt-7 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-rose-100/90 shrink-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.hero.trust3}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NEXT BUTTON (PERMANENTLY ANCHORED AT FIXED TOP PIXEL OFFSET) */}
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="hidden sm:flex absolute -right-2 lg:-right-6 top-[250px] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* SLIDE PAGINATION PILLS (CLEAN MINIMAL DOTS) */}
            <div className="mt-10 flex items-center justify-center gap-2.5">
              {activeHeroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                    idx === currentSlideIndex % activeHeroSlides.length
                      ? "w-8 bg-white shadow-md shadow-white/40"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* TRUST & ACCREDITATION STRIP (ALA PRIVY.ID) */}
      <section className="bg-white py-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-rose-900">ISO 27001</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{t.metrics.isoLabel}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-rose-900">256-Bit</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{t.metrics.encryptionLabel}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-rose-900">99.9%</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{t.metrics.slaLabel}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-rose-900">24/7</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{t.metrics.supportLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2">{t.about.badge}</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.about.headline}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
                {profile.about ||
                  (profile.companyName
                    ? (lang === "id"
                        ? `Didirikan dengan visi menjadi mitra terpercaya, ${profile.companyName} menggabungkan standar keunggulan profesional dengan pemahaman mendalam atas dinamika industri dan kebutuhan setiap mitra.`
                        : `Founded with a mission to be a trusted digital partner, ${profile.companyName} combines professional excellence with deep industry insights to accelerate client success.`)
                    : (lang === "id"
                        ? "Mendedikasikan keahlian terbaik untuk menghadirkan solusi teknologi mutakhir dan berkelanjutan bagi seluruh mitra bisnis."
                        : "Dedicated to delivering cutting-edge, sustainable enterprise technology solutions for all strategic partners."))}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: t.about.visionTitle,
                    desc:
                      profile.vision || t.about.defaultVision,
                  },
                  {
                    title: t.about.missionTitle,
                    desc:
                      profile.mission || t.about.defaultMission,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <CheckCircle2 className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-950 via-[#700020] to-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-2xl font-bold tracking-tight mb-4">
                  {lang === "en" ? "Core Values" : "Nilai Inti (Core Values)"}
                </h3>
                <p className="text-rose-100 text-sm mb-6 leading-relaxed">
                  {t.about.valuesIntro}
                </p>

                <div className="space-y-4">
                  {t.about.valuesList.map((val, idx) => (
                    <div key={idx} className="border-l-2 border-rose-500 pl-4 py-1">
                      <div className="font-semibold text-white text-base">{val.label}</div>
                      <div className="text-xs text-rose-200 mt-0.5">{val.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS & SERVICES (BENTO GRID WITH BURGUNDY THEME) */}
      <section id="services" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.services.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.services.headline}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-rose-50/90 border border-rose-200/60 flex items-center justify-center mb-6 text-rose-800 group-hover:bg-gradient-to-tr group-hover:from-rose-800 group-hover:to-[#700020] group-hover:text-white group-hover:scale-105 shadow-xs group-hover:shadow-lg transition-all duration-300">
                    {srv.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">{srv.desc}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {srv.tags.map((tg, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50/80 border border-rose-100 text-rose-900"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-rose-800 bg-rose-50/90 hover:bg-gradient-to-r hover:from-rose-800 hover:to-[#700020] hover:text-white border border-rose-200/80 transition-all shadow-xs group/btn shrink-0"
                  >
                    <span>{t.services.consultService}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS & INFINITE SMOOTH MARQUEE CAROUSEL */}
      <section id="clients" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-widest">
              {t.clients.headline}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              {t.clients.subtitle}
            </p>
          </div>

          {/* INFINITE SMOOTH MARQUEE CAROUSEL */}
          <div className="relative w-full overflow-hidden py-3">
            {/* Gradien Fade Halus Kiri dan Kanan */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="animate-marquee flex items-center gap-6 sm:gap-8">
              {marqueeClients.map((c, idx) => (
                <div
                  key={idx}
                  className="group shrink-0 flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-900/10 transition-all duration-300 cursor-pointer min-w-[210px]"
                  onClick={() => c.websiteUrl && window.open(c.websiteUrl, "_blank")}
                  title={c.websiteUrl ? `Kunjungi ${c.companyName}` : c.companyName}
                >
                  {c.logoUrl ? (
                    <div className="w-12 h-10 flex items-center justify-center shrink-0">
                      <img
                        src={c.logoUrl}
                        alt={c.companyName}
                        className="max-h-9 max-w-[120px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:bg-rose-800 group-hover:text-white transition-all">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-rose-800 transition-colors whitespace-nowrap">
                      {c.companyName}
                    </span>
                    {c.category && (
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {c.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES & INSIGHTS (EDITORIAL BENTO GRID ALA PRIVY.ID) */}
      <section id="articles" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER & NEXT/PREV CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                <span>{t.articles.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.articles.headline}
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={handlePrevArticles}
                  aria-label="Previous Articles"
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 hover:text-rose-800 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-600 px-1 select-none">
                  0{articleBatchIndex + 1} / 0{totalArticlePages}
                </span>
                <button
                  type="button"
                  onClick={handleNextArticles}
                  aria-label="Next Articles"
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 hover:text-rose-800 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                href="/articles"
                className="font-bold text-rose-800 hover:text-rose-900 inline-flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-rose-300 shadow-xs transition-all group"
              >
                <span>{t.articles.viewAll}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* PRIVY BENTO GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* CARD 1: FEATURED SPOTLIGHT (LARGE TALL LEFT CARD) */}
            <div className="lg:col-span-5 h-[480px] sm:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-8">
              {card1.thumbnailUrl ? (
                <img
                  src={card1.thumbnailUrl}
                  alt={card1.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-rose-950 to-slate-900 z-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 z-10" />

              {/* Top Bar: Icon & Category */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-700 to-[#700020] flex items-center justify-center text-white shadow-lg shadow-rose-950/40 border border-white/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  {card1.category?.name || (lang === "en" ? "FEATURED INSIGHT" : "WAWASAN UTAMA")}
                </span>
              </div>

              {/* Bottom Content with Stylized Watermark */}
              <div className="relative z-20">
                <div className="text-rose-500/85 font-black text-2xl sm:text-4xl tracking-tighter uppercase select-none -mb-1 opacity-90">
                  {card1.category?.name || (lang === "en" ? "DIGITAL TRANSFORMATION" : "TRANSFORMASI DIGITAL")}
                </div>
                <Link href={`/articles/${card1.slug}`}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight hover:text-rose-300 transition-colors">
                    {card1.title}
                  </h3>
                </Link>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {card1.excerpt || card1.summary || (card1.content ? card1.content.slice(0, 140) + "..." : "")}
                </p>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {card1.publishedAt
                      ? new Date(card1.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : card1.date || (lang === "en" ? "Latest" : "Terbaru")}
                  </span>
                  <Link
                    href={`/articles/${card1.slug}`}
                    className="inline-flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <span>{t.articles.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 3 CARDS (2 ON TOP, 1 WIDE ON BOTTOM) */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
              {/* TOP ROW: 2 MEDIUM CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* CARD 2 */}
                <div className="h-[250px] sm:h-[275px] rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-5 sm:p-6">
                  {card2.thumbnailUrl ? (
                    <img
                      src={card2.thumbnailUrl}
                      alt={card2.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-rose-950 z-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 z-10" />

                  <div className="relative z-20 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-[#700020] flex items-center justify-center text-white shadow-md border border-white/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-rose-300 text-[9px] font-bold uppercase tracking-wider">
                      {card2.category?.name || t.articles.watermarks.security}
                    </span>
                  </div>

                  <div className="relative z-20">
                    <div className="text-rose-500/80 font-black text-lg tracking-tighter uppercase select-none -mb-0.5">
                      {card2.category?.name || t.articles.watermarks.security}
                    </div>
                    <Link href={`/articles/${card2.slug}`}>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug hover:text-rose-300 transition-colors line-clamp-2">
                        {card2.title}
                      </h4>
                    </Link>
                    <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {card2.excerpt || card2.summary}
                    </p>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="h-[250px] sm:h-[275px] rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-5 sm:p-6">
                  {card3.thumbnailUrl ? (
                    <img
                      src={card3.thumbnailUrl}
                      alt={card3.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-rose-950 z-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 z-10" />

                  <div className="relative z-20 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-[#700020] flex items-center justify-center text-white shadow-md border border-white/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-rose-300 text-[9px] font-bold uppercase tracking-wider">
                      {card3.category?.name || t.articles.watermarks.efficiency}
                    </span>
                  </div>

                  <div className="relative z-20">
                    <div className="text-rose-500/80 font-black text-lg tracking-tighter uppercase select-none -mb-0.5">
                      {card3.category?.name || t.articles.watermarks.automation}
                    </div>
                    <Link href={`/articles/${card3.slug}`}>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug hover:text-rose-300 transition-colors line-clamp-2">
                        {card3.title}
                      </h4>
                    </Link>
                    <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {card3.excerpt || card3.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: CARD 4 (WIDE LANDSCAPE CARD) */}
              <div className="h-[250px] sm:h-[275px] rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-7">
                {card4.thumbnailUrl ? (
                  <img
                    src={card4.thumbnailUrl}
                    alt={card4.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-rose-950 z-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10" />

                <div className="relative z-20 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/25">
                    {profile.companyName || "Nusantara Tech"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                    {t.articles.provenTrust}
                  </span>
                </div>

                <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="text-rose-500/80 font-black text-xl sm:text-2xl tracking-tighter uppercase select-none -mb-1">
                      {card4.category?.name || t.articles.watermarks.digitalIdentity}
                    </div>
                    <Link href={`/articles/${card4.slug}`}>
                      <h4 className="text-base sm:text-xl font-extrabold text-white leading-snug hover:text-rose-300 transition-colors line-clamp-2">
                        {card4.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {card4.excerpt || card4.summary}
                    </p>
                  </div>

                  <Link
                    href={`/articles/${card4.slug}`}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-rose-800 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all self-start sm:self-end"
                  >
                    <span>{t.articles.readInsight}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & INQUIRY FORM */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2">{t.contact.badge}</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.contact.headline}
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                {t.contact.desc}
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.contact.officeAddress}</h4>
                    <p className="text-slate-600 text-sm mt-0.5">
                      {profile.address || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.contact.officialEmail}</h4>
                    <p className="text-slate-600 text-sm mt-0.5">{profile.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-800">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.contact.phoneWhatsapp}</h4>
                    <p className="text-slate-600 text-sm mt-0.5">
                      {profile.phone || profile.whatsapp || "-"} {profile.phone && profile.whatsapp ? `/ ${profile.whatsapp}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
                {formSubmitted ? (
                  <div className="p-8 text-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold">{t.contact.successTitle}</h3>
                    <p className="mt-2 text-sm text-emerald-700">
                      {t.contact.successDesc}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                          {t.contact.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t.contact.fullNamePlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                          {t.contact.email} *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t.contact.emailPlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                          {t.contact.phone}
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t.contact.phonePlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                          {t.contact.serviceNeed}
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-800"
                        >
                          {t.contact.servicesOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        {t.contact.message} *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.contact.messagePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-rose-800 via-rose-900 to-[#700020] hover:brightness-110 transition-all shadow-md shadow-rose-950/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t.contact.sendBtn}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEGA FOOTER (MULTI-KOLOM DARK INK ALA PRIVY.ID) */}
      <footer id="main-footer" className="bg-[#0b0f17] text-slate-400 pt-16 pb-12 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
            {/* Kolom 1: Profil & Akreditasi Keamanan (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.companyName || "Logo"}
                    className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-800 to-[#700020] flex items-center justify-center text-white font-bold shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-lg font-extrabold text-white leading-tight">
                    {profile.companyName}
                  </div>
                  <div className="text-[10px] tracking-wider text-rose-400 uppercase font-bold">
                    {profile.tagline || (lang === "en" ? "Enterprise Digital Solutions" : "Solusi Teknologi Enterprise")}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {lang === "en" ? t.footer.companyDesc : (profile.about || t.footer.companyDesc)}
              </p>

              {/* Trust & Compliance Badges */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ISO 27001 Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  256-Bit SSL Protection
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Kominfo Registered
                </span>
              </div>
            </div>

            {/* Kolom 2: Solusi & Produk (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.footer.solutionsTitle}
              </h4>
              <ul className="space-y-2 text-xs">
                {t.footer.solutionsList.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="hover:text-rose-400 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 3: Navigasi Perusahaan (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.footer.quickLinksTitle}
              </h4>
              <ul className="space-y-2 text-xs">
                {t.footer.quickLinks.map((link, idx) => (
                  <li key={idx}>
                    {link.isLink ? (
                      <Link href={link.href} className="hover:text-rose-400 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.targetBlank ? "_blank" : undefined}
                        className="hover:text-rose-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4: Kantor & Kontak Resmi (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.footer.contactTitle}
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
                      <span>{t.footer.chatWhatsapp}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Clean Corporate Copyright & Quick Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {currentYear} {profile.companyName || "Nusantara Tech"}. {t.footer.allRights}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href="#about" className="hover:text-slate-300 transition-colors">{t.nav.about}</a>
              <span className="text-slate-700">•</span>
              <a href="#services" className="hover:text-slate-300 transition-colors">{t.nav.services}</a>
              <span className="text-slate-700">•</span>
              <a href="#contact" className="hover:text-slate-300 transition-colors">{t.nav.contact}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t.footer.backToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-800 to-[#700020] hover:from-rose-700 hover:to-rose-900 text-white flex items-center justify-center shadow-xl hover:shadow-2xl border border-white/25 active:scale-90 transition-all duration-300 group cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
