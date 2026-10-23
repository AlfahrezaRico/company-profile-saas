import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Upload,
  Spin,
  Image,
  App as AntdApp,
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
  const { notification } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [heroBgUrl, setHeroBgUrl] = useState<string>("");

  const API_URL = `${API_BASE_URL}/api`;

  // Kompresi otomatis gambar sebelum diunggah jika ukuran file besar (canvas browser resize)
  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (
        file.type === "image/svg+xml" ||
        file.type === "image/gif" ||
        file.size < 400 * 1024
      ) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          let { width, height } = img;
          const maxWidth = 1920;
          const maxHeight = 1080;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const optimized = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              );
              resolve(optimized);
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // Ambil data profil perusahaan langsung dari PostgreSQL
  useEffect(() => {
    fetch(`${API_URL}/company-profile`, { cache: "no-store" })
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
        notification.error({
          message: "Koneksi Gagal",
          description: "Gagal memuat data profil perusahaan dari server.",
          placement: "topRight",
        });
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `Gagal menyimpan ke database (Status: ${res.status})`
        );
      }
      const updated = await res.json();
      form.setFieldsValue(updated);
      if (updated.logoUrl !== undefined) setLogoUrl(updated.logoUrl || "");
      if (updated.heroBgUrl !== undefined) setHeroBgUrl(updated.heroBgUrl || "");

      notification.success({
        message: "✓ Berhasil Disimpan ke Database!",
        description:
          "Seluruh informasi profil perusahaan, kontak kantor, visi misi, logo, dan background hero banner berhasil diperbarui di PostgreSQL.",
        placement: "topRight",
        duration: 4.5,
      });
    } catch (err: any) {
      console.error(err);
      notification.error({
        message: "Gagal Menyimpan Perubahan",
        description:
          err.message || "Terjadi kesalahan saat menyimpan data ke database PostgreSQL.",
        placement: "topRight",
        duration: 6,
      });
    } finally {
      setSaving(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.warn("Validation failed:", errorInfo);
    notification.warning({
      message: "Validasi Form Belum Lengkap",
      description: "Mohon periksa kolom bertanda bintang (Nama Resmi Perusahaan) sebelum menyimpan.",
      placement: "topRight",
      duration: 4.5,
    });
  };

  // Handler upload logo ke endpoint backend NestJS /api/upload
  const handleUploadLogo = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const processedFile = await optimizeImage(file);
      const formData = new FormData();
      formData.append("file", processedFile);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Upload logo gagal");
      }
      const data = await res.json();
      setLogoUrl(data.url);
      notification.success({
        message: "Logo Berhasil Diunggah",
        description:
          "Berkas logo telah berhasil diunggah. Jangan lupa klik tombol 'Simpan Perubahan ke Database' di bawah.",
        placement: "topRight",
        duration: 4,
      });
      onSuccess(data, file);
    } catch (err: any) {
      console.error("Upload error:", err);
      notification.error({
        message: "Gagal Mengunggah Logo",
        description: err.message || "Pastikan format berkas gambar valid (maks. 5MB).",
        placement: "topRight",
        duration: 5,
      });
      onError(err);
    }
  };

  // Handler upload background hero banner
  const handleUploadHeroBg = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const processedFile = await optimizeImage(file);
      const formData = new FormData();
      formData.append("file", processedFile);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Upload background gagal");
      }
      const data = await res.json();
      setHeroBgUrl(data.url);
      notification.success({
        message: "Background Hero Berhasil Diunggah",
        description:
          "Gambar background hero telah siap. Klik 'Simpan Perubahan ke Database' di bawah untuk menyimpannya permanen.",
        placement: "topRight",
        duration: 4,
      });
      onSuccess(data, file);
    } catch (err: any) {
      console.error("Upload background error:", err);
      notification.error({
        message: "Gagal Mengunggah Background Hero",
        description: err.message || "Pastikan format berkas gambar valid (maks. 5MB).",
        placement: "topRight",
        duration: 5,
      });
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

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
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
                      style={{
                        objectFit: "contain",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        padding: 8,
                        backgroundColor: "#f8fafc",
                      }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => setLogoUrl("")}
                      >
                        Hapus Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: 90,
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
                  <Button icon={<UploadOutlined />}>
                    {logoUrl ? "Ganti File Logo" : "Pilih & Unggah Logo"}
                  </Button>
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
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => setHeroBgUrl("")}
                      >
                        Hapus Background (Gunakan Default)
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: 90,
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
                  <Button icon={<UploadOutlined />}>
                    {heroBgUrl ? "Ganti Background Hero" : "Pilih & Unggah Background Hero"}
                  </Button>
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
