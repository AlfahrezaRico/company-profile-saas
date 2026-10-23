const rawEnvUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL =
  rawEnvUrl && !rawEnvUrl.includes("fake-rest.refine.dev")
    ? rawEnvUrl.replace(/\/+$/, "")
    : "http://localhost:4000";

