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
  ReloadOutlined,
  AppstoreOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  status: "PUBLISHED" | "DRAFT";
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = `${API_BASE_URL}/api`;

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        message.error("Gagal memuat produk & layanan");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      status: "PUBLISHED",
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (record: ProductItem) => {
    setEditingProduct(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      shortDesc: record.shortDesc || "",
      description: record.description || "",
      status: record.status || "PUBLISHED",
      isFeatured: record.isFeatured || false,
    });
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setFieldsValue({ slug });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        // UPDATE
        const res = await fetch(`${API_BASE}/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          message.success("Layanan berhasil diperbarui");
          setModalOpen(false);
          fetchProducts();
        } else {
          message.error("Gagal memperbarui layanan");
        }
      } else {
        // CREATE
        const res = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          message.success("Layanan baru berhasil ditambahkan");
          setModalOpen(false);
          fetchProducts();
        } else {
          message.error("Gagal menambahkan layanan");
        }
      }
    } catch {
      // Form validation failed
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Layanan berhasil dihapus dari database");
        fetchProducts();
      } else {
        message.error("Gagal menghapus layanan");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    }
  };

  const handleToggleStatus = async (record: ProductItem, checked: boolean) => {
    const newStatus = checked ? "PUBLISHED" : "DRAFT";
    try {
      const res = await fetch(`${API_BASE}/products/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        message.success(`Status diubah menjadi ${newStatus}`);
        fetchProducts();
      }
    } catch {
      message.error("Gagal mengubah status");
    }
  };

  const columns = [
    {
      title: "Nama Layanan / Solusi",
      key: "name_info",
      render: (_: any, r: ProductItem) => (
        <div>
          <Text strong style={{ fontSize: 14, color: "#0f172a" }}>
            {r.name}
          </Text>
          {r.isFeatured && (
            <Tag color="gold" style={{ marginLeft: 8, fontSize: 10, borderRadius: 4 }}>
              <StarOutlined /> Unggulan
            </Tag>
          )}
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            slug: <code style={{ color: "#9f1239" }}>/{r.slug}</code>
          </div>
          {r.shortDesc && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.shortDesc}</div>
          )}
        </div>
      ),
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 12, color: "#475569" }}>
          {desc || "-"}
        </Paragraph>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st: string, r: ProductItem) => (
        <Space direction="vertical" size={4}>
          <Tag color={st === "PUBLISHED" ? "green" : "orange"} style={{ borderRadius: 6 }}>
            {st === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
          </Tag>
          <Switch
            size="small"
            checked={st === "PUBLISHED"}
            onChange={(checked) => handleToggleStatus(r, checked)}
            checkedChildren="Aktif"
            unCheckedChildren="Draft"
          />
        </Space>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      render: (_: any, r: ProductItem) => (
        <Space>
          <Tooltip title="Edit Layanan">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(r)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Popconfirm
              title="Hapus layanan ini?"
              description="Data layanan akan dihapus dari sistem."
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(r.id)}
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
      <Card style={{ marginBottom: 20, borderRadius: 12, border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
              <AppstoreOutlined style={{ color: "#9f1239" }} />
              Katalog Produk & Solusi Digital
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: "block" }}>
              Kelola daftar penawaran solusi software, cloud, keamanan siber, dan transformasi digital yang ditampilkan pada landing page.
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchProducts} loading={loading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              style={{ background: "#9f1239", borderColor: "#881337" }}
            >
              Tambah Layanan Baru
            </Button>
          </Space>
        </div>
      </Card>

      <Card style={{ borderRadius: 12, border: "1px solid #f1f5f9" }}>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (t) => `Total ${t} layanan aktif` }}
        />
      </Card>

      <Modal
        title={editingProduct ? "Edit Layanan Solusi" : "Tambah Layanan Baru"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Simpan Layanan"
        cancelText="Batal"
        okButtonProps={{ style: { background: "#9f1239", borderColor: "#881337" } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Nama Layanan / Solusi"
            rules={[{ required: true, message: "Nama layanan wajib diisi" }]}
          >
            <Input placeholder="Contoh: Enterprise Web & Cloud Solutions" onChange={handleNameChange} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="slug"
                label="Slug URL"
                rules={[{ required: true, message: "Slug wajib diisi" }]}
              >
                <Input placeholder="enterprise-web-cloud" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status Publikasi">
                <Select>
                  <Select.Option value="PUBLISHED">PUBLISHED</Select.Option>
                  <Select.Option value="DRAFT">DRAFT</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="shortDesc" label="Tagline Singkat">
            <Input placeholder="Contoh: Solusi arsitektur web & cloud enterprise" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Deskripsi Lengkap"
            rules={[{ required: true, message: "Deskripsi wajib diisi" }]}
          >
            <TextArea rows={4} placeholder="Jelaskan cakupan fitur, keunggulan teknis, dan manfaat solusi..." />
          </Form.Item>

          <Form.Item name="isFeatured" valuePropName="checked" label="Jadikan Layanan Unggulan?">
            <Switch checkedChildren="Ya" unCheckedChildren="Tidak" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
