import React, { useEffect, useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { API_BASE_URL } from "../../config/api";

const { Text } = Typography;

export const AppTitle: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  const [profile, setProfile] = useState<{ companyName?: string; logoUrl?: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/company-profile`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.companyName) {
          setProfile(d);
          document.title = `${d.companyName} - Admin Portal`;
          if (d.logoUrl) {
            let link: HTMLLinkElement | null =
              document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement("link");
              link.rel = "icon";
              document.head.appendChild(link);
            }
            link.href = d.logoUrl;
          }
        }
      })
      .catch(() => {});
  }, []);

  if (collapsed) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 48 }}>
        {profile?.logoUrl ? (
          <img
            src={profile.logoUrl}
            alt="Logo"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
        ) : (
          <BankOutlined style={{ fontSize: 22, color: "#9f1239" }} />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        overflow: "hidden",
      }}
    >
      {profile?.logoUrl ? (
        <img
          src={profile.logoUrl}
          alt="Logo"
          style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
        />
      ) : (
        <BankOutlined style={{ fontSize: 24, color: "#9f1239", flexShrink: 0 }} />
      )}
      <Text
        strong
        ellipsis
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#9f1239",
          maxWidth: 160,
        }}
      >
        {profile?.companyName || "Admin CMS"}
      </Text>
    </div>
  );
};
