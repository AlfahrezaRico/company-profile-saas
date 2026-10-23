import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Avatar,
  Modal,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  UploadOutlined,
  GlobalOutlined,
  ReloadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text } = Typography;

interface ClientItem {
  id: string;
  companyName: string;
  category: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt?: string;
}

const API_BASE = `${API_BASE_URL}/api`;

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");

  const [form] = Form.useForm();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clients`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        message.error("Gagal memuat daftar mitra");
      }
    } catch (err) {
      console.error(err);
      message.error("Koneksi ke backend API terputus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenAdd = () => {
    setEditingClient(null);
    setCurrentLogoUrl("");
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      category: "Korporasi",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (client: ClientItem) => {
    setEditingClient(client);
    setCurrentLogoUrl(client.logoUrl || "");
    form.resetFields();
    form.setFieldsValue({
      companyName: client.companyName,
      category: client.category,
      websiteUrl: client.websiteUrl,
      isActive: client.isActive,
    });
    setModalOpen(true);
  };

  const handleUploadLogo = async (file: File) => {
    setLogoUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengunggah logo");
      const data = await res.json();
      setCurrentLogoUrl(data.url);
      message.success("Logo mitra berhasil diunggah");
    } catch (err: any) {
      message.error(err.message || "Gagal mengunggah logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      companyName: values.companyName,
      category: values.category || "",
      websiteUrl: values.websiteUrl || "",
      logoUrl: currentLogoUrl || null,
      isActive: values.isActive ?? true,
    };

    try {
      if (editingClient) {
        // UPDATE
        const res = await fetch(`${API_BASE}/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal memperbarui mitra");
        message.success("Data mitra & logo berhasil diperbarui");
      } else {
        // CREATE
        const res = await fetch(`${API_BASE}/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal menambahkan mitra");
        message.success("Mitra baru berhasil ditambahkan ke database");
      }

      setModalOpen(false);
      fetchClients();
    } catch (err: any) {
      message.error(err.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus mitra");
      message.success("Mitra berhasil dihapus dari database");
      fetchClients();
    } catch (err: any) {
      message.error(err.message || "Gagal menghapus mitra");
    }
  };

  const columns = [
    {
      title: "Logo Mitra",
      dataIndex: "logoUrl",
      key: "logoUrl",
      width: 110,
      render: (logoUrl: string | null, record: ClientItem) => (
        <div
          style={{
            width: 72,
            height: 48,
            borderRadius: 8,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={record.companyName}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <BankOutlined style={{ fontSize: 24, color: "#94a3b8" }} />
          )}
        </div>
      ),
    },
    {
      title: "Nama Mitra / Korporasi",
      dataIndex: "companyName",
      key: "companyName",
      render: (name: string, record: ClientItem) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>
            {name}
          </Text>
          {record.websiteUrl && (
            <div style={{ marginTop: 2 }}>
              <a
                href={record.websiteUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: "#1677ff", display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <GlobalOutlined />
                {record.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Sektor Industri",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => (
        <Tag color="geekblue" style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4 }}>
          {cat || "Umum"}
        </Tag>
      ),
    },
    {
      title: "Status Tampil di Website",
      dataIndex: "isActive",
      key: "isActive",
      width: 170,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success" style={{ borderRadius: 4, fontWeight: 500 }}>
            ● Aktif di Carousel
          </Tag>
        ) : (
          <Tag color="default" style={{ borderRadius: 4 }}>
            Disembunyikan
          </Tag>
        ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      render: (_: any, record: ClientItem) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Mitra?"
            description={`Yakin ingin menghapus ${record.companyName} dari database?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Klien, Mitra & Portofolio
          </Title>
          <Text type="secondary">
            Kelola logo mitra kerja, nama korporasi, dan tautan resmi yang tampil di carousel website depan.
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchClients} loading={loading}>
            Muat Ulang
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={handleOpenAdd}
          >
            Tambah Mitra Baru
          </Button>
        </Space>
      </div>

      <Card variant="outlined" style={{ borderRadius: 12 }}>
        <Table
          dataSource={clients}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal Tambah / Edit Mitra */}
      <Modal
        title={
          <div style={{ fontSize: 16, fontWeight: "bold" }}>
            {editingClient ? "Edit Data & Logo Mitra" : "Tambah Mitra Korporasi Baru"}
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          {/* LOGO UPLOAD AREA */}
          <Form.Item label="Logo Perusahaan Mitra (PNG / SVG Transparan Disarankan)">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                borderRadius: 8,
                backgroundColor: "#f8fafc",
                border: "1px dashed #cbd5e1",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 64,
                  borderRadius: 6,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  overflow: "hidden",
                }}
              >
                {currentLogoUrl ? (
                  <img
                    src={currentLogoUrl}
                    alt="Logo Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8" }}>
                    <PictureOutlined style={{ fontSize: 22 }} />
                    <div style={{ fontSize: 10 }}>Belum Ada</div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleUploadLogo(file);
                    return false;
                  }}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                >
                  <Button icon={<UploadOutlined />} loading={logoUploading}>
                    {currentLogoUrl ? "Ganti Logo" : "Unggah File Logo"}
                  </Button>
                </Upload>
                {currentLogoUrl && (
                  <Button
                    type="link"
                    danger
                    size="small"
                    style={{ paddingLeft: 8 }}
                    onClick={() => setCurrentLogoUrl("")}
                  >
                    Hapus Logo
                  </Button>
                )}
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Disarankan gambar rasio horizontal dengan latar belakang transparan.
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Nama Perusahaan / Korporasi"
            rules={[{ required: true, message: "Nama perusahaan wajib diisi" }]}
          >
            <Input placeholder="Contoh: PT Bank Mandiri (Persero) Tbk" size="large" />
          </Form.Item>

          <Form.Item name="category" label="Sektor Industri">
            <Input placeholder="Contoh: Perbankan & Finansial, Telekomunikasi, Logistik" />
          </Form.Item>

          <Form.Item name="websiteUrl" label="Website Resmi Mitra (Opsional)">
            <Input placeholder="https://www.example.com" prefix={<GlobalOutlined style={{ color: "#94a3b8" }} />} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Tampilkan di Carousel Website Depan"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktif Tampil" unCheckedChildren="Sembunyikan" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="primary" htmlType="submit" size="large">
              {editingClient ? "Simpan Perubahan" : "Tambahkan Mitra"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
