const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

