import React, { useEffect, useState } from "react";
import { AuthPage } from "@refinedev/antd";
import { BankOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

interface CompanyProfile {
  companyName?: string;
  logoUrl?: string;
}

export const LoginPage: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/company-profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.companyName) {
          setProfile(data);
          document.title = `${data.companyName} - Login Admin`;
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
      .catch((err) => {
        console.error("Gagal memuat profil perusahaan di login:", err);
      });
  }, []);

  return (
    <AuthPage
      type="login"
      title={
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {profile?.logoUrl ? (
            <div style={{ marginBottom: 12 }}>
              <img
                src={profile.logoUrl}
                alt={profile.companyName || "Logo Perusahaan"}
                style={{
                  maxHeight: 60,
                  maxWidth: 180,
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <BankOutlined style={{ fontSize: 36, color: "#9f1239" }} />
            </div>
          )}
          <div style={{ fontSize: 20, fontWeight: "bold", color: "#1f2937" }}>
            {profile?.companyName || "Admin Portal CMS"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Silakan masuk untuk mengelola konten website
          </div>
        </div>
      }
      formProps={{
        autoComplete: "off",
      }}
      rememberMe={false}
    />
  );
};
