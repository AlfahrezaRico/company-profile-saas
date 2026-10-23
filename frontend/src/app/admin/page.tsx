"use client";

import { useEffect } from "react";

export default function AdminRedirectPage() {
  useEffect(() => {
    // Redirect otomatis ke portal Admin CMS
    const adminUrl = (process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5173").replace(/\/+$/, "");
    window.location.href = adminUrl;
  }, []);


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold tracking-tight">Mengarahkan ke Portal Admin CMS...</h2>
      <p className="text-slate-400 text-sm mt-2">
        Jika tidak dialihkan otomatis, <a href="http://localhost:5173" className="text-blue-400 underline">klik di sini</a>.
      </p>
    </div>
  );
}
