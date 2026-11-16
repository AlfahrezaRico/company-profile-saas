const rawEnvUrl = import.meta.env.VITE_API_URL?.trim();

let normalizedUrl =
  rawEnvUrl && !rawEnvUrl.includes("fake-rest.refine.dev")
    ? rawEnvUrl.replace(/\/+$/, "")
    : "http://localhost:4000";

if (
  normalizedUrl &&
  !normalizedUrl.startsWith("http://") &&
  !normalizedUrl.startsWith("https://")
) {
  normalizedUrl = `https://${normalizedUrl}`;
}

export const API_BASE_URL = normalizedUrl;

const rawWebsiteUrl = import.meta.env.VITE_WEBSITE_URL?.trim();

export const getWebsiteUrl = (): string => {
  if (rawWebsiteUrl) {
    let url = rawWebsiteUrl.replace(/\/+$/, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url;
  }
  // Di production (non-localhost), otomatis arahkan ke URL website Vercel
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return "https://company-profile-saas-j3an.vercel.app";
  }
  return "http://localhost:3000";
};

export const WEBSITE_URL = getWebsiteUrl();


