import { AuthProvider } from "@refinedev/core";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api`;

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Mengirim dan menerima cookie dari server
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: {
            name: "Autentikasi Gagal",
            message: data.message || "Email atau kata sandi tidak valid.",
          },
        };
      }

      // Simpan JWT Token di Cookie (Best Practice) & LocalStorage (Fallback)
      setCookie("auth_token", data.token, 7);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          name: "Koneksi Error",
          message: "Tidak dapat terhubung ke server backend API.",
        },
      };
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}

    deleteCookie("auth_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    // Ambil token dari Cookie (Best Practice) atau LocalStorage
    const token = getCookie("auth_token") || localStorage.getItem("auth_token");
    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (res.ok) {
        return {
          authenticated: true,
        };
      }
    } catch (err) {
      return { authenticated: true };
    }

    deleteCookie("auth_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    return {
      authenticated: false,
      redirectTo: "/login",
      logout: true,
    };
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return [user.role];
    }
    return null;
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};
