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
  Modal,
  Form,
  Input,
  App as AntdApp,
} from "antd";
import {
  LogoutOutlined,
  GlobalOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { API_BASE_URL } from "../../config/api";

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
  const { notification } = AntdApp.useApp();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();
  const { mode, setMode } = useContext(ColorModeContext);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    lineHeight: "normal",
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const handleChangePassword = async (values: any) => {
    setSubmittingPassword(true);
    try {
      const authToken = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengubah kata sandi.");
      }

      notification.success({
        message: "Kata Sandi Berhasil Diperbarui",
        description:
          "Kata sandi akun administrator Anda telah berhasil diubah di database.",
        placement: "topRight",
        duration: 4.5,
      });

      setPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err: any) {
      notification.error({
        message: "Gagal Mengubah Kata Sandi",
        description:
          err.message || "Terjadi kesalahan saat memproses perubahan kata sandi.",
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <>
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
              icon={<KeyOutlined />}
              onClick={() => {
                passwordForm.resetFields();
                setPasswordModalOpen(true);
              }}
              style={{
                marginLeft: 4,
                display: "flex",
                alignItems: "center",
                height: 32,
                color: token.colorTextSecondary,
              }}
            >
              Ubah Password
            </Button>

            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={() => logout()}
              style={{
                marginLeft: 2,
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

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <KeyOutlined style={{ color: "#9f1239" }} />
            <span>Ubah Kata Sandi Administrator</span>
          </div>
        }
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Kata Sandi Lama"
            name="oldPassword"
            rules={[{ required: true, message: "Kata sandi lama wajib diisi" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="Masukkan kata sandi saat ini"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Kata Sandi Baru"
            name="newPassword"
            rules={[
              { required: true, message: "Kata sandi baru wajib diisi" },
              { min: 6, message: "Kata sandi baru minimal 6 karakter" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="Minimal 6 karakter"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Kata Sandi Baru"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Konfirmasi kata sandi baru wajib diisi" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Konfirmasi kata sandi tidak cocok"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="Ulangi kata sandi baru"
              size="large"
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 24,
            }}
          >
            <Button
              onClick={() => {
                setPasswordModalOpen(false);
                passwordForm.resetFields();
              }}
            >
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submittingPassword}
              style={{ backgroundColor: "#9f1239" }}
            >
              Simpan Kata Sandi
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};


