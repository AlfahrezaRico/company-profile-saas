const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").trim();
let normalizedUrl = rawApiUrl.replace(/\/+$/, "");

if (
  normalizedUrl &&
  !normalizedUrl.startsWith("http://") &&
  !normalizedUrl.startsWith("https://")
) {
  normalizedUrl = `https://${normalizedUrl}`;
}

export const API_BASE_URL = normalizedUrl;


