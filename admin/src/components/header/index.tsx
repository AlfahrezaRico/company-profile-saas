import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import {
  Avatar,
  Layout as AntdLayout,
  Space,
  Switch,
  theme,
  Typography,
  Tag,
  Button,
} from "antd";
import { LogoutOutlined, GlobalOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    lineHeight: "normal", // Reset Ant Design's default 64px line-height
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button
            type="default"
            icon={<GlobalOutlined style={{ color: "#9f1239" }} />}
            style={{
              borderColor: "#f43f5e",
              color: "#9f1239",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 6,
            }}
          >
            Lihat Website Utama
          </Button>
        </a>

        <Tag
          color="success"
          style={{
            margin: 0,
            borderRadius: 12,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 500,
            border: "none",
          }}
        >
          ● Database Terhubung
        </Tag>

        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "4px 8px",
            borderRadius: 8,
          }}
        >
          {user?.avatar && (
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              size={36}
              style={{
                border: `1px solid ${token.colorBorderSecondary}`,
                flexShrink: 0,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: token.colorTextHeading,
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "Administrator"}
            </span>
            <div style={{ marginTop: 3 }}>
              <Tag
                color="blue"
                bordered={false}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  margin: 0,
                  padding: "0 6px",
                  lineHeight: "18px",
                  borderRadius: 4,
                  display: "inline-block",
                }}
              >
                {user?.role || "SUPERADMIN"}
              </Tag>
            </div>
          </div>
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={() => logout()}
            style={{
              marginLeft: 4,
              display: "flex",
              alignItems: "center",
              height: 32,
            }}
          >
            Keluar
          </Button>
        </div>
      </div>
    </AntdLayout.Header>
  );
};


