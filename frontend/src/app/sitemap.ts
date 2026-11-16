import { MetadataRoute } from "next";
import { API_BASE_URL } from "@/config/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://company-profile-saas-j3an.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const res = await fetch(`${API_BASE_URL}/api/articles?status=PUBLISHED`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const articles = await res.json();
      if (Array.isArray(articles)) {
        const articleRoutes: MetadataRoute.Sitemap = articles.map((art: any) => ({
          url: `${baseUrl}/articles/${art.slug}`,
          lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
        return [...staticRoutes, ...articleRoutes];
      }
    }
  } catch {
    // Fallback jika API belum aktif saat build
  }

  return staticRoutes;
}
