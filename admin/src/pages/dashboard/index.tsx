import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Modal,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  FileTextOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MailOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  SlidersOutlined,
  PlusOutlined,
  MessageOutlined,
  PhoneOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../config/api";

const { Title, Text, Paragraph } = Typography;

const API_BASE = `${API_BASE_URL}/api`;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({ companyName: "PT Alkarim Jaya Abadi" });
  const [articlesCount, setArticlesCount] = useState(0);
  const [publishedArticles, setPublishedArticles] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [pRes, aRes, prodRes, cRes, iRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/company-profile`).catch(() => null),
        fetch(`${API_BASE}/articles`).catch(() => null),
        fetch(`${API_BASE}/products`).catch(() => null),
        fetch(`${API_BASE}/clients`).catch(() => null),
        fetch(`${API_BASE}/inquiries`).catch(() => null),
        fetch(`${API_BASE}/hero-slides`).catch(() => null),
      ]);

      if (pRes && pRes.ok) {
        const d = await pRes.json();
        if (d && d.companyName) setProfile(d);
      }

      if (aRes && aRes.ok) {
        const d = await aRes.json();
        if (Array.isArray(d)) {
          setArticlesCount(d.length);
          setPublishedArticles(d.filter((a: any) => a.status === "PUBLISHED").length);
        }
      }

      if (prodRes && prodRes.ok) {
        const d = await prodRes.json();
        if (Array.isArray(d)) setProductsCount(d.length);
      }

      if (cRes && cRes.ok) {
        const d = await cRes.json();
        if (Array.isArray(d)) setClientsCount(d.length);
      }

      if (iRes && iRes.ok) {
        const d = await iRes.json();
        if (Array.isArray(d)) setInquiries(d);
      }

      if (sRes && sRes.ok) {
        const d = await sRes.json();
        if (Array.isArray(d)) setSlidesCount(d.length);
      }
    } catch {
      message.error("Gagal memuat beberapa data dasbor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const unreadInquiries = inquiries.filter(
    (i) => i.status === "UNREAD" || i.status === "Unread" || !i.status
  ).length;

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        message.success("Status pesan berhasil diperbarui");
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
        fetchDashboardData();
      }
    } catch {
      message.error("Gagal memperbarui status pesan");
    }
  };

  const columns = [
    {
      title: "Pengirim",
      key: "sender",
      render: (_: any, r: any) => (
        <div>
          <Text strong style={{ fontSize: 13, color: "#0f172a" }}>
            {r.fullName || r.name || "Anonim"}
          </Text>
          <div style={{ fontSize: 11, color: "#64748b" }}>{r.email}</div>
          {r.phone && <div style={{ fontSize: 11, color: "#64748b" }}>{r.phone}</div>}
        </div>
      ),
    },
    {
      title: "Layanan Diminati",
      dataIndex: "service",
      key: "service",
      render: (svc: string) => (
        <Tag color="magenta" style={{ borderRadius: 6, fontWeight: 600, fontSize: 11 }}>
          {svc || "Konsultasi Umum"}
        </Tag>
      ),
    },
    {
      title: "Pesan Singkat",
      dataIndex: "message",
      key: "message",
      render: (msg: string) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 12, color: "#475569" }}>
          {msg || "-"}
        </Paragraph>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (st: string) => {
        const isUnread = st === "UNREAD" || st === "Unread" || !st;
        const isReplied = st === "REPLIED" || st === "Replied";
        return (
          <Tag color={isUnread ? "error" : isReplied ? "success" : "processing"} style={{ borderRadius: 6 }}>
            {isUnread ? "Belum Dibaca" : isReplied ? "Sudah Dibalas" : "Sudah Dibaca"}
          </Tag>
        );
      },
    },
    {
      title: "Waktu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => (
        <Text style={{ fontSize: 11, color: "#94a3b8" }}>
          {val
            ? new Date(val).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </Text>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          size="small"
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedInquiry(record);
            if (record.status === "UNREAD" || !record.status) {
              handleUpdateInquiryStatus(record.id, "READ");
            }
          }}
        >
          Lihat
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* EXECUTIVE CRIMSON WELCOME BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, #4c0519 0%, #700020 50%, #9f1239 100%)",
          borderRadius: 16,
          padding: "24px 28px",
          color: "#fff",
          marginBottom: 24,
          boxShadow: "0 10px 30px rgba(112, 0, 32, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ maxWidth: 650 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Enterprise Admin Portal
            </span>
            <Badge status="processing" color="#4ade80" text={<span style={{ color: "#dcfce7", fontSize: 11 }}>Database PostgreSQL Aktif</span>} />
          </div>
          <Title level={2} style={{ color: "#fff", margin: "4px 0 8px", fontWeight: 800 }}>
            {profile.companyName}
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Selamat datang di pusat kendali website perusahaan. Kelola identitas perusahaan, artikel wawasan, produk & layanan, serta pantau prospek konsultasi yang masuk secara real-time.
          </Paragraph>
        </div>

        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchDashboardData}
            loading={loading}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: 20,
            }}
          >
            Refresh Data
          </Button>
          <Button
            type="primary"
            icon={<GlobalOutlined />}
            onClick={() => window.open("http://localhost:3000", "_blank")}
            style={{
              background: "#fff",
              color: "#881337",
              fontWeight: 700,
              borderRadius: 20,
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            Kunjungi Website Utama
          </Button>
        </Space>
      </div>

      {/* 4 GLOWING REAL-TIME METRIC CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Metric 1: Artikel */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/articles")}
            style={{
              borderRadius: 14,
              border: "1px solid #f1f5f9",
              background: "linear-gradient(180deg, #ffffff 0%, #fff1f2 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  Artikel & Wawasan
                </Text>
                <Title level={2} style={{ margin: "6px 0 4px", color: "#881337", fontWeight: 800 }}>
                  {articlesCount}
                </Title>
                <Tag color="rose" style={{ borderRadius: 6, fontWeight: 600 }}>
                  {publishedArticles} Published
                </Tag>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #be123c, #881337)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 22,
                  boxShadow: "0 8px 16px rgba(190, 18, 60, 0.25)",
                }}
              >
                <FileTextOutlined />
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#be123c", fontSize: 12, fontWeight: 600 }}>
              <span>Kelola Artikel</span>
              <ArrowRightOutlined style={{ fontSize: 10 }} />
            </div>
          </Card>
        </Col>

        {/* Metric 2: Produk & Layanan */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/products")}
            style={{
              borderRadius: 14,
              border: "1px solid #f1f5f9",
              background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  Produk & Layanan
                </Text>
                <Title level={2} style={{ margin: "6px 0 4px", color: "#15803d", fontWeight: 800 }}>
                  {productsCount}
                </Title>
                <Tag color="success" style={{ borderRadius: 6, fontWeight: 600 }}>
                  Solusi Enterprise
                </Tag>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 22,
                  boxShadow: "0 8px 16px rgba(22, 163, 74, 0.25)",
                }}
              >
                <AppstoreOutlined />
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontSize: 12, fontWeight: 600 }}>
              <span>Kelola Layanan</span>
              <ArrowRightOutlined style={{ fontSize: 10 }} />
            </div>
          </Card>
        </Col>

        {/* Metric 3: Klien & Mitra */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/clients")}
            style={{
              borderRadius: 14,
              border: "1px solid #f1f5f9",
              background: "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  Mitra & Klien
                </Text>
                <Title level={2} style={{ margin: "6px 0 4px", color: "#6d28d9", fontWeight: 800 }}>
                  {clientsCount}
                </Title>
                <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600 }}>
                  Logo Partner Aktif
                </Tag>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 22,
                  boxShadow: "0 8px 16px rgba(124, 58, 237, 0.25)",
                }}
              >
                <TeamOutlined />
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>
              <span>Kelola Klien</span>
              <ArrowRightOutlined style={{ fontSize: 10 }} />
            </div>
          </Card>
        </Col>

        {/* Metric 4: Pesan Masuk (Leads) */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/inquiries")}
            style={{
              borderRadius: 14,
              border: "1px solid #f1f5f9",
              background: "linear-gradient(180deg, #ffffff 0%, #fffbeb 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  Pesan Masuk (Leads)
                </Text>
                <Title level={2} style={{ margin: "6px 0 4px", color: "#b45309", fontWeight: 800 }}>
                  {inquiries.length}
                </Title>
                <Tag color={unreadInquiries > 0 ? "error" : "default"} style={{ borderRadius: 6, fontWeight: 600 }}>
                  {unreadInquiries} Perlu Respon
                </Tag>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #d97706, #b45309)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 22,
                  boxShadow: "0 8px 16px rgba(217, 119, 6, 0.25)",
                }}
              >
                <MailOutlined />
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#d97706", fontSize: 12, fontWeight: 600 }}>
              <span>Buka Kotak Masuk</span>
              <ArrowRightOutlined style={{ fontSize: 10 }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* QUICK ACTIONS ROW */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid #f1f5f9",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircleOutlined style={{ color: "#9f1239" }} />
            Aksi Cepat Manajemen
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Pintasan navigasi langsung ke modul utama
          </Text>
        </div>

        <Row gutter={[12, 12]}>
          <Col xs={12} sm={6}>
            <Button
              block
              icon={<PlusOutlined />}
              onClick={() => navigate("/articles")}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
            >
              + Tambah Artikel Baru
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              block
              icon={<SlidersOutlined />}
              onClick={() => navigate("/hero-slides")}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
            >
              Atur Hero Carousel ({slidesCount} slide)
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              block
              icon={<AppstoreOutlined />}
              onClick={() => navigate("/products")}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
            >
              + Tambah Produk/Layanan
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              block
              icon={<TeamOutlined />}
              onClick={() => navigate("/clients")}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
            >
              + Tambah Mitra/Klien
            </Button>
          </Col>
        </Row>
      </Card>

      {/* RECENT INQUIRIES REAL-TIME TABLE */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Pesan Konsultasi Pengunjung Terbaru
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Daftar pesan langsung yang dikirim oleh calon klien dari formulir website utama
            </Text>
          </div>
          <Button type="link" onClick={() => navigate("/inquiries")}>
            Lihat Semua Pesan ({inquiries.length}) &rarr;
          </Button>
        </div>

        <Table
          dataSource={inquiries.slice(0, 5)}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* INQUIRY DETAIL MODAL */}
      <Modal
        title="Detail Pesan Masuk Konsultasi"
        open={!!selectedInquiry}
        onCancel={() => setSelectedInquiry(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedInquiry(null)}>
            Tutup
          </Button>,
          selectedInquiry?.phone && (
            <Button
              key="wa"
              type="primary"
              style={{ background: "#16a34a", borderColor: "#15803d" }}
              icon={<PhoneOutlined />}
              onClick={() => {
                const phone = selectedInquiry.phone.replace(/\D/g, "");
                window.open(`https://wa.me/${phone}?text=Halo%20${encodeURIComponent(selectedInquiry.fullName || "")},%20terima%20kasih%20telah%20menghubungi%20kami.`, "_blank");
              }}
            >
              Balas via WhatsApp
            </Button>
          ),
          <Button
            key="mark"
            type="primary"
            style={{ background: "#881337", borderColor: "#700020" }}
            onClick={() => {
              if (selectedInquiry) {
                handleUpdateInquiryStatus(selectedInquiry.id, "REPLIED");
              }
            }}
          >
            Tandai Selesai / Dibalas
          </Button>,
        ]}
      >
        {selectedInquiry && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedInquiry.fullName || selectedInquiry.name}
                </Title>
                <Text type="secondary">{selectedInquiry.email} &bull; {selectedInquiry.phone}</Text>
              </div>
              <Tag color="magenta">{selectedInquiry.service || "Konsultasi"}</Tag>
            </div>
            <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 12 }}>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                Isi Pesan:
              </Text>
              <Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {selectedInquiry.message}
              </Paragraph>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
              Diterima pada: {new Date(selectedInquiry.createdAt).toLocaleString("id-ID")}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
