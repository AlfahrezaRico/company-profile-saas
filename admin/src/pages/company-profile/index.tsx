import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Divider,
  Upload,
  Spin,
  Image,
} from "antd";
import {
  SaveOutlined,
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  UploadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const CompanyProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [heroBgUrl, setHeroBgUrl] = useState<string>("");

  const API_URL = `${API_BASE_URL}/api`;

  // Ambil data profil perusahaan langsung dari PostgreSQL
  useEffect(() => {
    fetch(`${API_URL}/company-profile`)
      .then((res) => res.json())
      .then((data) => {
        form.setFieldsValue(data);
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
        if (data.heroBgUrl) {
          setHeroBgUrl(data.heroBgUrl);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil profil:", err);
        message.error("Gagal memuat profil dari server");
      })
      .finally(() => setLoading(false));
  }, [form]);

  // Handler simpan data ke database PostgreSQL
  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        logoUrl: logoUrl,
        heroBgUrl: heroBgUrl,
      };

      const res = await fetch(`${API_URL}/company-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan ke database");
      const updated = await res.json();
      message.success("✓ Profil perusahaan & logo berhasil diperbarui ke PostgreSQL!");
      form.setFieldsValue(updated);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Handler upload logo ke endpoint backend NestJS /api/upload
  const handleUploadLogo = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();
      setLogoUrl(data.url);
      message.success("✓ Logo berhasil diunggah! Jangan lupa klik 'Simpan Perubahan'.");
      onSuccess(data, file);
    } catch (err: any) {
      console.error("Upload error:", err);
      message.error("Gagal mengunggah logo: " + err.message);
      onError(err);
    }
  };

  // Handler upload background hero banner
  const handleUploadHeroBg = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload background gagal");
      const data = await res.json();
      setHeroBgUrl(data.url);
      message.success("✓ Background Hero berhasil diunggah! Jangan lupa klik 'Simpan Perubahan'.");
      onSuccess(data, file);
    } catch (err: any) {
      console.error("Upload background error:", err);
      message.error("Gagal mengunggah background hero: " + err.message);
      onError(err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 12 }}>Memuat data dari PostgreSQL...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 4 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Kelola Profil Perusahaan
        </Title>
        <Text type="secondary">
          Perbarui informasi publik, visi, misi, logo, dan kontak resmi yang tersimpan langsung di database PostgreSQL.
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card
              title={
                <span>
                  <BankOutlined /> Identitas & Visi Misi
                </span>
              }
              variant="outlined"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Form.Item
                label="Nama Resmi Perusahaan"
                name="companyName"
                rules={[{ required: true, message: "Nama perusahaan wajib diisi" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item label="Slogan / Tagline Bisnis" name="tagline">
                <Input size="large" />
              </Form.Item>

              <Form.Item label="Tentang Perusahaan (About Us)" name="about">
                <TextArea rows={4} />
              </Form.Item>

              <Divider />

              <Form.Item label="Visi Perusahaan" name="vision">
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item label="Misi Perusahaan" name="mission">
                <TextArea rows={3} />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            {/* CARD UPLOAD LOGO */}
            <Card
              title={
                <span>
                  <PictureOutlined /> Logo Perusahaan
                </span>
              }
              variant="outlined"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {logoUrl ? (
                  <div style={{ marginBottom: 12 }}>
                    <Image
                      src={logoUrl}
                      alt="Logo Perusahaan"
                      height={90}
                      style={{ objectFit: "contain", borderRadius: 8, border: "1px solid #f0f0f0", padding: 6 }}
                    />
                    <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
                      URL: <Text code copyable>{logoUrl}</Text>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: 80,
                      backgroundColor: "#fafafa",
                      border: "1px dashed #d9d9d9",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: 13,
                      marginBottom: 12,
                    }}
                  >
                    Belum ada logo terunggah
                  </div>
                )}

                <Upload
                  customRequest={handleUploadLogo}
                  showUploadList={false}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                >
                  <Button icon={<UploadOutlined />}>Pilih & Unggah Logo Baru</Button>
                </Upload>
                <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
                  Format: PNG, JPG, WebP, SVG (Maks. 5 MB)
                </div>
              </div>
            </Card>

            {/* CARD UPLOAD BACKGROUND HERO */}
            <Card
              title={
                <span>
                  <PictureOutlined /> Gambar Background Hero Banner
                </span>
              }
              variant="outlined"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {heroBgUrl ? (
                  <div style={{ marginBottom: 12 }}>
                    <Image
                      src={heroBgUrl}
                      alt="Hero Background"
                      height={100}
                      style={{ objectFit: "cover", width: "100%", borderRadius: 8, border: "1px solid #f0f0f0" }}
                    />
                    <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
                      URL: <Text code copyable>{heroBgUrl}</Text>
                    </div>
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() => setHeroBgUrl("")}
                      style={{ marginTop: 4 }}
                    >
                      Hapus Background (Gunakan Default)
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      height: 80,
                      backgroundColor: "#fafafa",
                      border: "1px dashed #d9d9d9",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: 13,
                      marginBottom: 12,
                    }}
                  >
                    Menggunakan background gradasi bawaan
                  </div>
                )}

                <Upload
                  customRequest={handleUploadHeroBg}
                  showUploadList={false}
                  accept="image/png,image/jpeg,image/webp"
                >
                  <Button icon={<UploadOutlined />}>Pilih & Unggah Background Hero</Button>
                </Upload>
                <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
                  Rekomendasi: 1920x1080 atau 1600x900 (Maks. 5 MB)
                </div>
              </div>
            </Card>

            <Card
              title={
                <span>
                  <EnvironmentOutlined /> Kontak & Lokasi Kantor
                </span>
              }
              variant="outlined"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Form.Item label="Alamat Fisik Kantor" name="address">
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item label="Email Resmi" name="email">
                <Input />
              </Form.Item>

              <Form.Item label="Nomor Telepon Kantor" name="phone">
                <Input />
              </Form.Item>

              <Form.Item label="Nomor WhatsApp CS" name="whatsapp">
                <Input />
              </Form.Item>
            </Card>

            <Card
              title={
                <span>
                  <GlobalOutlined /> Tautan Media Sosial
                </span>
              }
              variant="outlined"
              style={{ borderRadius: 12 }}
            >
              <Form.Item label="LinkedIn URL" name="linkedin">
                <Input />
              </Form.Item>

              <Form.Item label="Instagram URL" name="instagram">
                <Input />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={saving}
                block
                style={{ marginTop: 12 }}
              >
                Simpan Perubahan ke Database
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
