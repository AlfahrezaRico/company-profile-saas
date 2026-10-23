import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  message,
  Popconfirm,
  Tooltip,
  Radio,
  Divider,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  PictureOutlined,
  SlidersOutlined,
  AlignCenterOutlined,
  AlignLeftOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text, Paragraph } = Typography;

interface HeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string | null;
  layout?: "CENTER" | "LEFT" | "SPLIT" | string;
  primaryCtaText: string | null;
  primaryCtaUrl: string | null;
  secondaryCtaText: string | null;
  secondaryCtaUrl: string | null;
  splitTitle?: string | null;
  splitSubtitle?: string | null;
  splitCtaText?: string | null;
  splitCtaUrl?: string | null;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt?: string;
}

const API_BASE = `${API_BASE_URL}/api`;

export const HeroSlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const [form] = Form.useForm();

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/hero-slides`);
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      } else {
        message.error("Gagal memuat daftar hero slides");
      }
    } catch (err) {
      message.error("Terjadi kesalahan jaringan saat memuat slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const layoutValue = Form.useWatch("layout", form) || "CENTER";

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setCurrentImageUrl("");
    form.resetFields();
    form.setFieldsValue({
      badge: "SOLUSI ENTERPRISE TERPERCAYA",
      layout: "CENTER",
      primaryCtaText: "Konsultasi Proyek Gratis",
      primaryCtaUrl: "#contact",
      secondaryCtaText: "Jelajahi Layanan Kami",
      secondaryCtaUrl: "#services",
      splitTitle: "",
      splitSubtitle: "",
      splitCtaText: "",
      splitCtaUrl: "",
      orderIndex: (slides.length || 0) + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlideItem) => {
    setEditingSlide(slide);
    setCurrentImageUrl(slide.imageUrl || "");
    form.setFieldsValue({
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge || "SOLUSI ENTERPRISE TERPERCAYA",
      layout: slide.layout || "CENTER",
      primaryCtaText: slide.primaryCtaText || "Konsultasi Proyek Gratis",
      primaryCtaUrl: slide.primaryCtaUrl || "#contact",
      secondaryCtaText: slide.secondaryCtaText || "Jelajahi Layanan Kami",
      secondaryCtaUrl: slide.secondaryCtaUrl || "#services",
      splitTitle: slide.splitTitle || "",
      splitSubtitle: slide.splitSubtitle || "",
      splitCtaText: slide.splitCtaText || "",
      splitCtaUrl: slide.splitCtaUrl || "",
      orderIndex: slide.orderIndex,
      isActive: slide.isActive,
    });
    setModalOpen(true);
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setImageUploading(true);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const data = await res.json();
      setCurrentImageUrl(data.url);
      message.success("Gambar slide berhasil diunggah!");
    } catch (err) {
      message.error("Upload gambar slide gagal");
    } finally {
      setImageUploading(false);
    }
    return false; // cegah default antd upload
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        imageUrl: currentImageUrl || null,
      };

      if (editingSlide) {
        // Update
        const res = await fetch(`${API_BASE}/hero-slides/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          message.success("Hero slide berhasil diperbarui!");
          setModalOpen(false);
          fetchSlides();
        } else {
          message.error("Gagal memperbarui hero slide");
        }
      } else {
        // Create
        const res = await fetch(`${API_BASE}/hero-slides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          message.success("Hero slide baru berhasil ditambahkan!");
          setModalOpen(false);
          fetchSlides();
        } else {
          message.error("Gagal menambahkan hero slide");
        }
      }
    } catch (error) {
      // Form validation error
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/hero-slides/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Hero slide berhasil dihapus!");
        fetchSlides();
      } else {
        message.error("Gagal menghapus hero slide");
      }
    } catch (err) {
      message.error("Terjadi kesalahan saat menghapus");
    }
  };

  const handleToggleActive = async (slide: HeroSlideItem, checked: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/hero-slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      });
      if (res.ok) {
        message.success(`Slide ${checked ? "diaktifkan" : "dinonaktifkan"}`);
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, isActive: checked } : s))
        );
      } else {
        message.error("Gagal mengubah status slide");
      }
    } catch (err) {
      message.error("Kesalahan jaringan");
    }
  };

  const columns = [
    {
      title: "Urutan",
      dataIndex: "orderIndex",
      key: "orderIndex",
      width: 80,
      render: (val: number) => <Tag color="rose">{val}</Tag>,
    },
    {
      title: "Judul & Badge Slide",
      key: "title",
      render: (_: any, record: HeroSlideItem) => (
        <div>
          {record.badge && (
            <Tag color="#9f1239" style={{ marginBottom: 4 }}>
              {record.badge}
            </Tag>
          )}
          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
            {record.title}
          </div>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ color: "#64748b", fontSize: 12, marginTop: 4, marginBottom: 0 }}
          >
            {record.subtitle}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Tombol Aksi (CTA)",
      key: "cta",
      width: 220,
      render: (_: any, record: HeroSlideItem) => (
        <Space direction="vertical" size={2}>
          {record.primaryCtaText && (
            <Tag color="magenta">CTA 1: {record.primaryCtaText}</Tag>
          )}
          {record.secondaryCtaText && (
            <Tag color="default">CTA 2: {record.secondaryCtaText}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Posisi Layout",
      dataIndex: "layout",
      key: "layout",
      width: 140,
      render: (layout: string) => {
        if (layout === "LEFT") {
          return <Tag color="blue">👈 Rata Kiri</Tag>;
        }
        if (layout === "SPLIT") {
          return <Tag color="purple">⚖️ 2 Sisi / Split</Tag>;
        }
        return <Tag color="default">🏛️ Rata Tengah</Tag>;
      },
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 90,
      render: (url: string | null) =>
        url ? (
          <img
            src={url}
            alt="Preview"
            style={{ width: 48, height: 32, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <Text type="secondary" style={{ fontSize: 11 }}>-</Text>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean, record: HeroSlideItem) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record, checked)}
          checkedChildren="Aktif"
          unCheckedChildren="Off"
        />
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 120,
      render: (_: any, record: HeroSlideItem) => (
        <Space size="middle">
          <Tooltip title="Edit Slide">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#9f1239" }} />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Hero Slide ini?"
            description="Tindakan ini tidak dapat dibatalkan."
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Hapus Slide">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SlidersOutlined style={{ color: "#9f1239", fontSize: 20 }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Hero Banners / Slides
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Kelola konten carousel banner di bagian paling atas website utama (Next / Prev slider)
              </Text>
            </div>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchSlides}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              style={{ backgroundColor: "#9f1239", borderColor: "#9f1239" }}
            >
              Tambah Slide Baru
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={slides}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* MODAL FORM CREATE / EDIT */}
      <Modal
        title={
          <Space>
            <SlidersOutlined style={{ color: "#9f1239" }} />
            <span>
              {editingSlide ? "Edit Hero Slide" : "Tambah Hero Slide Baru"}
            </span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editingSlide ? "Simpan Perubahan" : "Tambahkan Slide"}
        okButtonProps={{ style: { backgroundColor: "#9f1239", borderColor: "#9f1239" } }}
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="layout"
            label="Format / Penataan Posisi Konten (Layout)"
            extra="Tentukan penataan posisi konten slide sesuai estetika halaman depan"
          >
            <Radio.Group buttonStyle="solid" style={{ width: "100%", display: "flex", gap: 8 }}>
              <Radio.Button value="CENTER" style={{ flex: 1, textAlign: "center", borderRadius: 6 }}>
                <AlignCenterOutlined style={{ marginRight: 6 }} />
                Rata Tengah
              </Radio.Button>
              <Radio.Button value="LEFT" style={{ flex: 1, textAlign: "center", borderRadius: 6 }}>
                <AlignLeftOutlined style={{ marginRight: 6 }} />
                Rata Kiri
              </Radio.Button>
              <Radio.Button value="SPLIT" style={{ flex: 1, textAlign: "center", borderRadius: 6 }}>
                <SplitCellsOutlined style={{ marginRight: 6 }} />
                2 Sisi / Split
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {layoutValue === "LEFT" && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16, fontSize: 12 }}
              message="Format Teks Rata Kiri"
              description="Teks headline, subjudul, dan tombol aksi akan diratakan ke kiri. Sisi kanan akan otomatis menampilkan visual kartu arsitektur keamanan modern atau mockup gambar pendukung."
            />
          )}

          <Form.Item
            name="badge"
            label="Badge / Kategori Label"
            extra="Teks kecil kapital di atas judul (misal: 'SOLUSI ENTERPRISE TERPERCAYA')"
          >
            <Input placeholder="Contoh: SOLUSI CLOUD & SIBER" />
          </Form.Item>

          <Form.Item
            name="title"
            label={layoutValue === "SPLIT" ? "Judul Utama Kolom Kiri" : "Judul Utama (Headline Slide)"}
            rules={[{ required: true, message: "Judul utama slide wajib diisi!" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Contoh: Membangun Fondasi Digital Tangguh untuk Pertumbuhan Bisnis"
            />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label={layoutValue === "SPLIT" ? "Subjudul / Deskripsi Kolom Kiri" : "Subjudul / Deskripsi Lengkap"}
            rules={[{ required: true, message: "Subjudul slide wajib diisi!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Jelaskan value proposition atau keunggulan layanan pada slide ini..."
            />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="primaryCtaText" label="Teks Tombol Utama (CTA 1)">
              <Input placeholder="Konsultasi Proyek Gratis" />
            </Form.Item>
            <Form.Item name="primaryCtaUrl" label="Link Tombol Utama">
              <Input placeholder="#contact" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="secondaryCtaText" label="Teks Tombol Kedua (CTA 2)">
              <Input placeholder="Jelajahi Layanan Kami" />
            </Form.Item>
            <Form.Item name="secondaryCtaUrl" label="Link Tombol Kedua">
              <Input placeholder="#services" />
            </Form.Item>
          </div>

          {layoutValue === "SPLIT" && (
            <div
              style={{
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontWeight: 600, color: "#9f1239", fontSize: 13, marginBottom: 4 }}>
                ⚖️ Pengaturan Panel Kanan (Split 2 Kolom ala Privy.id)
              </div>
              <Paragraph style={{ color: "#881337", fontSize: 12, marginBottom: 14 }}>
                Pada mode 2 Sisi (Split) ala Privy.id, sisi kiri menyajikan narasi utama sedangkan sisi kanan menyajikan penawaran solusi spesifik (misal: Enterprise / Corporate) lengkap dengan tombol aksi tersendiri.
              </Paragraph>

              <Form.Item
                name="splitTitle"
                label="Judul Panel Kanan"
                extra="Misal: 'Solusi Khusus Korporasi & Lembaga Negara'"
              >
                <Input placeholder="Contoh: Solusi Korporasi & Lembaga" />
              </Form.Item>

              <Form.Item
                name="splitSubtitle"
                label="Deskripsi Panel Kanan"
                extra="Penjelasan detail penawaran atau solusi untuk panel kanan"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Dukungan SLA 99.9%, integrasi API enterprise, enkripsi end-to-end, dan audit kepatuhan regulasi berkala."
                />
              </Form.Item>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Form.Item name="splitCtaText" label="Teks Tombol Kanan">
                  <Input placeholder="Hubungi Sales Enterprise" />
                </Form.Item>
                <Form.Item name="splitCtaUrl" label="Link Tombol Kanan">
                  <Input placeholder="#contact" />
                </Form.Item>
              </div>
            </div>
          )}

          <Form.Item label="Gambar Visual / Mockup Pendukung Slide (Opsional)">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                beforeUpload={handleUploadImage}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={imageUploading}>
                  Unggah Gambar Slide
                </Button>
              </Upload>
              {currentImageUrl && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={currentImageUrl}
                    alt="Preview"
                    style={{
                      maxHeight: 70,
                      maxWidth: 160,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Button
                    size="small"
                    danger
                    onClick={() => setCurrentImageUrl("")}
                  >
                    Hapus Gambar
                  </Button>
                </div>
              )}
            </Space>
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              name="orderIndex"
              label="Nomor Urutan Tampilan"
              extra="Slide dengan angka lebih kecil akan tampil lebih awal"
            >
              <InputNumber min={1} max={99} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Status Publikasi"
              valuePropName="checked"
            >
              <Switch checkedChildren="Aktif" unCheckedChildren="Non-Aktif" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
