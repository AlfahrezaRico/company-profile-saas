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


