// Sertakan token login admin (JWT) pada permintaan ke backend yang
// dilindungi login. Backend menolak permintaan tanpa token (401).
export const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
