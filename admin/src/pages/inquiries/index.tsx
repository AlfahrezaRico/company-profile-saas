import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Radio,
  Badge,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "../../config/api";

const { Title, Text, Paragraph } = Typography;

export interface InquiryItem {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED" | string;
  createdAt: string;
}

const API_BASE = `${API_BASE_URL}/api`;

export const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else {
        message.error("Gagal memuat pesan masuk");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        message.success(`Status pesan diubah menjadi ${newStatus}`);
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
        fetchInquiries();
      } else {
        message.error("Gagal memperbarui status pesan");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Pesan berhasil dihapus");
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
        fetchInquiries();
      } else {
        message.error("Gagal menghapus pesan");
      }
    } catch {
      message.error("Terjadi kesalahan jaringan");
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "UNREAD") return item.status === "UNREAD" || item.status === "Unread" || !item.status;
    if (filterStatus === "READ") return item.status === "READ" || item.status === "Read";
    if (filterStatus === "REPLIED") return item.status === "REPLIED" || item.status === "Replied";
    return true;
  });

  const unreadCount = inquiries.filter(
    (i) => i.status === "UNREAD" || i.status === "Unread" || !i.status
  ).length;

  const columns = [
    {
      title: "Pengirim & Kontak",
      key: "sender",
      render: (_: any, r: InquiryItem) => (
        <div>
          <Text strong style={{ fontSize: 14, color: "#0f172a" }}>
            {r.fullName || r.name || "Calon Klien"}
          </Text>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            <a href={`mailto:${r.email}`} style={{ color: "#475569" }}>
              {r.email}
            </a>
          </div>
          {r.phone && (
            <div style={{ fontSize: 12, color: "#64748b" }}>
              <a
                href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#16a34a", fontWeight: 600 }}
              >
                <PhoneOutlined /> {r.phone}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Layanan Diminati",
      dataIndex: "service",
      key: "service",
      render: (svc: string | null) => (
        <Tag color="magenta" style={{ borderRadius: 6, fontWeight: 600 }}>
          {svc || "Konsultasi Umum"}
        </Tag>
      ),
    },
    {
      title: "Isi Pesan",
      dataIndex: "message",
      key: "message",
      render: (msg: string) => (
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 13, color: "#334155" }}>
          {msg}
        </Paragraph>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st: string) => {
        const isUnread = st === "UNREAD" || st === "Unread" || !st;
        const isReplied = st === "REPLIED" || st === "Replied";
        return (
          <Space direction="vertical" size={4}>
            <Tag color={isUnread ? "error" : isReplied ? "success" : "processing"} style={{ borderRadius: 6 }}>
              {isUnread ? "Belum Dibaca" : isReplied ? "Sudah Dibalas" : "Sudah Dibaca"}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Waktu",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (val: string) => (
        <Text style={{ fontSize: 12, color: "#64748b" }}>
          {val
            ? new Date(val).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </Text>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      render: (_: any, r: InquiryItem) => (
        <Space>
          <Tooltip title="Baca Pesan Lengkap">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedInquiry(r);
                if (r.status === "UNREAD" || !r.status) {
                  handleUpdateStatus(r.id, "READ");
                }
              }}
            >
              Buka
            </Button>
          </Tooltip>
          {r.phone && (
            <Tooltip title="Chat WhatsApp">
              <Button
                size="small"
                style={{ color: "#16a34a", borderColor: "#86efac" }}
                icon={<PhoneOutlined />}
                onClick={() => {
                  const num = (r.phone || "").replace(/\D/g, "");
                  window.open(`https://wa.me/${num}?text=Halo%20${encodeURIComponent(r.fullName || "")},%20terima%20kasih%20telah%20menghubungi%20kami.`, "_blank");
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Hapus">
            <Popconfirm
              title="Hapus pesan ini?"
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
              <MailOutlined style={{ color: "#9f1239" }} />
              Kotak Masuk Konsultasi & Prospek Klien (Leads)
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: "block" }}>
              Pesan langsung yang dikirimkan calon klien dari formulir landing page website utama.
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchInquiries} loading={loading}>
              Refresh
            </Button>
          </Space>
        </div>

        {/* STATUS FILTER BUTTONS */}
        <div style={{ marginTop: 20 }}>
          <Radio.Group
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">Semua Pesan ({inquiries.length})</Radio.Button>
            <Radio.Button value="UNREAD">
              Belum Dibaca {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: 6 }} />}
            </Radio.Button>
            <Radio.Button value="READ">Sudah Dibaca</Radio.Button>
            <Radio.Button value="REPLIED">Sudah Dibalas</Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      <Card style={{ borderRadius: 12, border: "1px solid #f1f5f9" }}>
        <Table
          dataSource={filteredInquiries}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (t) => `Total ${t} pesan` }}
        />
      </Card>

      {/* DETAIL MODAL */}
      <Modal
        title="Detail Pesan Masuk"
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
                const phone = (selectedInquiry.phone || "").replace(/\D/g, "");
                window.open(`https://wa.me/${phone}?text=Halo%20${encodeURIComponent(selectedInquiry.fullName || "")},%20terima%20kasih%20telah%20menghubungi%20kami.`, "_blank");
              }}
            >
              Balas via WhatsApp
            </Button>
          ),
          <Button
            key="email"
            icon={<MailOutlined />}
            onClick={() => {
              if (selectedInquiry) {
                window.open(`mailto:${selectedInquiry.email}?subject=Tanggapan%20Permintaan%20Konsultasi`, "_blank");
              }
            }}
          >
            Balas via Email
          </Button>,
          <Button
            key="status"
            type="primary"
            style={{ background: "#881337", borderColor: "#700020" }}
            onClick={() => {
              if (selectedInquiry) {
                handleUpdateStatus(selectedInquiry.id, "REPLIED");
              }
            }}
          >
            Tandai Sudah Dibalas
          </Button>,
        ]}
      >
        {selectedInquiry && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedInquiry.fullName || selectedInquiry.name || "Calon Klien"}
                </Title>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                  <div>Email: <strong>{selectedInquiry.email}</strong></div>
                  {selectedInquiry.phone && <div>No. Telepon / WA: <strong>{selectedInquiry.phone}</strong></div>}
                </div>
              </div>
              <Tag color="magenta" style={{ fontSize: 12, padding: "4px 8px" }}>
                {selectedInquiry.service || "Konsultasi Umum"}
              </Tag>
            </div>

            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 16 }}>
              <Text strong style={{ display: "block", marginBottom: 6, color: "#334155" }}>
                Isi Kebutuhan Proyek:
              </Text>
              <Paragraph style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>
                {selectedInquiry.message}
              </Paragraph>
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
              <span>Diterima pada: {new Date(selectedInquiry.createdAt).toLocaleString("id-ID")}</span>
              <span>Status saat ini: <strong style={{ color: "#881337" }}>{selectedInquiry.status}</strong></span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
