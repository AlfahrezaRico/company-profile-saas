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
  Select,
  Switch,
  Upload,
  message,
  Popconfirm,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  PictureOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnailUrl: string | null;
  status: "PUBLISHED" | "DRAFT";
  publishedAt?: string | null;
  createdAt?: string;
  category?: { id: string; name: string } | null;
}

const API_BASE = `${API_BASE_URL}/api`;

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string>("");

  const [form] = Form.useForm();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/articles`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        message.error("Gagal memuat daftar artikel dari database");
      }
    } catch (err) {
      message.error("Terjadi kesalahan jaringan saat memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setCurrentThumbnailUrl("");
    form.resetFields();
    form.setFieldsValue({
      status: "PUBLISHED",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (record: ArticleItem) => {
    setEditingArticle(record);
    setCurrentThumbnailUrl(record.thumbnailUrl || "");
    form.resetFields();
    form.setFieldsValue({
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt || "",
      content: record.content || "",
      status: record.status || "PUBLISHED",
      thumbnailUrl: record.thumbnailUrl || "",
    });
    setModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingArticle) {
      const generatedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setFieldsValue({ slug: generatedSlug });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        thumbnailUrl: currentThumbnailUrl || null,
      };

      if (editingArticle) {
        // UPDATE
        const res = await fetch(`${API_BASE}/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          message.success("Artikel berhasil diperbarui");
          setModalOpen(false);
          fetchArticles();
        } else {
          message.error("Gagal memperbarui artikel");
        }
      } else {
        // CREATE
        const res = await fetch(`${API_BASE}/articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          message.success("Artikel baru berhasil dibuat dan disimpan");
          setModalOpen(false);
          fetchArticles();
        } else {
          message.error("Gagal menambahkan artikel");
        }
      }
    } catch (err) {
      // Form validation failed
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Artikel berhasil dihapus dari database");
        fetchArticles();
      } else {
        message.error("Gagal menghapus artikel");
      }
    } catch (err) {
      message.error("Terjadi kesalahan jaringan saat menghapus artikel");
    }
  };

  const handleToggleStatus = async (record: ArticleItem, checked: boolean) => {
    const newStatus = checked ? "PUBLISHED" : "DRAFT";
    try {
      const res = await fetch(`${API_BASE}/articles/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        message.success(`Status artikel diubah menjadi ${newStatus}`);
        fetchArticles();
      } else {
        message.error("Gagal mengubah status artikel");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setImageUploading(true);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentThumbnailUrl(data.url);
        form.setFieldsValue({ thumbnailUrl: data.url });
        message.success("Gambar sampul artikel berhasil diunggah");
      } else {
        message.error("Gagal mengunggah gambar sampul");
      }
    } catch {
      message.error("Terjadi kesalahan saat upload gambar");
    } finally {
      setImageUploading(false);
    }
    return false; // prevent default upload
  };

  const publishedCount = articles.filter((a) => a.status === "PUBLISHED").length;
  const draftCount = articles.filter((a) => a.status === "DRAFT").length;

  const columns = [
    {
      title: "Sampul",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 100,
      render: (url: string | null) =>
        url ? (
          <img
            src={url}
            alt="Thumbnail"
            style={{
              width: 72,
              height: 48,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 48,
              background: "#f1f5f9",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: 18,
            }}
          >
            <PictureOutlined />
          </div>
        ),
    },
    {
      title: "Judul & Ringkasan",
      key: "title_excerpt",
      render: (_: any, record: ArticleItem) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 14 }}>
            {record.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            slug: <code style={{ color: "#9f1239" }}>/{record.slug}</code>
          </Text>
          {record.excerpt && (
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, fontSize: 12, color: "#64748b" }}
            >
              {record.excerpt}
            </Paragraph>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string, record: ArticleItem) => (
        <Space direction="vertical" size={4}>
          <Tag color={status === "PUBLISHED" ? "green" : "orange"}>
            {status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
          </Tag>
          <Switch
            size="small"
            checked={status === "PUBLISHED"}
            onChange={(checked) => handleToggleStatus(record, checked)}
            checkedChildren="Publik"
            unCheckedChildren="Draft"
          />
        </Space>
      ),
    },
    {
      title: "Tanggal",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (val?: string) =>
        val ? (
          <Text style={{ fontSize: 12 }}>
            {new Date(val).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 140,
      render: (_: any, record: ArticleItem) => (
        <Space>
          <Tooltip title="Lihat di Web">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(`http://localhost:3000/articles/${record.slug}`, "_blank")}
            />
          </Tooltip>
          <Tooltip title="Edit Artikel">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Popconfirm
              title="Hapus artikel ini?"
              description="Artikel ini akan dihapus permanen dari database."
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* HEADER SECTION */}
      <Card style={{ marginBottom: 20, borderRadius: 12, border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
              <FileTextOutlined style={{ color: "#9f1239" }} />
              Manajemen Artikel & Wawasan Resmi
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: "block" }}>
              Kelola konten artikel wawasan, berita, dan panduan industri yang tersimpan langsung di database PostgreSQL.
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchArticles} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              style={{ background: "#9f1239", borderColor: "#881337" }}
            >
              Tambah Artikel Baru
            </Button>
          </Space>
        </div>

        {/* STATS OVERVIEW */}
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={12} sm={8}>
            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", fontWeight: "bold" }}>
                Total Artikel
              </Text>
              <Title level={3} style={{ margin: "4px 0 0", color: "#0f172a" }}>
                {articles.length}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8}>
            <div style={{ background: "#f0fdf4", padding: "12px 16px", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", fontWeight: "bold", color: "#166534" }}>
                Artikel Published
              </Text>
              <Title level={3} style={{ margin: "4px 0 0", color: "#15803d" }}>
                {publishedCount}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8}>
            <div style={{ background: "#fffbeb", padding: "12px 16px", borderRadius: 8, border: "1px solid #fde68a" }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", fontWeight: "bold", color: "#92400e" }}>
                Artikel Draft
              </Text>
              <Title level={3} style={{ margin: "4px 0 0", color: "#b45309" }}>
                {draftCount}
              </Title>
            </div>
          </Col>
        </Row>
      </Card>

      {/* ARTICLES TABLE */}
      <Card style={{ borderRadius: 12, border: "1px solid #f1f5f9" }}>
        <Table
          dataSource={articles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} artikel di database` }}
        />
      </Card>

      {/* CREATE & EDIT MODAL */}
      <Modal
        title={editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        width={720}
        okText="Simpan Artikel"
        cancelText="Batal"
        okButtonProps={{ style: { background: "#9f1239", borderColor: "#881337" } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Judul Artikel"
            rules={[{ required: true, message: "Judul artikel wajib diisi" }]}
          >
            <Input placeholder="Contoh: Pentingnya Arsitektur Microservices Modern" onChange={handleTitleChange} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="slug"
                label="Slug URL"
                rules={[{ required: true, message: "Slug URL wajib diisi" }]}
                tooltip="URL unik yang akan diakses pengunjung, contoh: arsitektur-microservices-modern"
              >
                <Input placeholder="arsitektur-microservices-modern" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status Publikasi" initialValue="PUBLISHED">
                <Select>
                  <Select.Option value="PUBLISHED">PUBLISHED (Tampil)</Select.Option>
                  <Select.Option value="DRAFT">DRAFT (Disembunyikan)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Gambar Sampul / Thumbnail">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={imageUploading}>
                  Upload File Gambar (JPG / PNG / WebP)
                </Button>
              </Upload>

              {currentThumbnailUrl && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={currentThumbnailUrl}
                    alt="Preview"
                    style={{
                      width: 140,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      setCurrentThumbnailUrl("");
                      form.setFieldsValue({ thumbnailUrl: "" });
                    }}
                  >
                    Hapus Sampul
                  </Button>
                </div>
              )}
            </Space>
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Ringkasan Singkat (Excerpt)"
            rules={[{ required: true, message: "Ringkasan wajib diisi" }]}
          >
            <TextArea
              rows={2}
              placeholder="Ringkasan 1-2 kalimat yang akan muncul pada kartu artikel..."
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Konten Artikel Lengkap (Mendukung Markdown)"
            rules={[{ required: true, message: "Konten artikel wajib diisi" }]}
          >
            <TextArea
              rows={8}
              placeholder="Tuliskan isi artikel lengkap di sini. Mendukung heading (## Subjudul), paragraf, bullet points, dan penomoran..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
