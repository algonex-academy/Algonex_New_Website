import { useState, useEffect } from "react";
import { Table, Button, Card, Modal, Input, message, Tag, Space, Alert } from "antd";
import { Cloud, Database, RefreshCw, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
import { getBackups, createBackup, restoreBackup } from "../../api/backups";

const AdminBackupPage = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetFile, setTargetFile] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");

  const loadBackups = async () => {
    setLoading(true);
    try {
      const data = await getBackups();
      if (data.status === "success") {
        setBackups(data.backups || []);
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch S3 backups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await createBackup();
      message.success(res.message || "Backup created and uploaded to S3!");
      await loadBackups();
    } catch (err) {
      message.error(err.response?.data?.message || "Backup creation failed.");
    } finally {
      setCreating(false);
    }
  };

  const openRestoreModal = (filename = null) => {
    setTargetFile(filename);
    setAdminPassword("");
    setIsModalOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!adminPassword.trim()) {
      message.warning("Please enter your admin password.");
      return;
    }

    setRestoring(true);
    try {
      const res = await restoreBackup(adminPassword, targetFile);
      message.success(res.message || "Database restored successfully!");
      setIsModalOpen(false);
      setAdminPassword("");
      await loadBackups();
    } catch (err) {
      message.error(err.response?.data?.message || "Restore failed. Please verify password.");
    } finally {
      setRestoring(false);
    }
  };

  const columns = [
    {
      title: "Backup File",
      dataIndex: "filename",
      key: "filename",
      render: (text) => (
        <Space orientation="horizontal" size="small">
          <Database size={16} className="text-cyan-500" />
          <span className="font-mono text-sm font-semibold">{text}</span>
        </Space>
      ),
    },
    {
      title: "Size",
      dataIndex: "size_formatted",
      key: "size_formatted",
      render: (size) => <Tag color="blue">{size}</Tag>,
    },
    {
      title: "Created At (UTC)",
      dataIndex: "last_modified",
      key: "last_modified",
      render: (val) => new Date(val).toLocaleString(),
    },
    {
      title: "Location",
      key: "location",
      render: () => <Tag color="green">AWS S3 (algonex-media-storage)</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<RefreshCw size={14} />}
          onClick={() => openRestoreModal(record.filename)}
        >
          Restore This
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex orientation-horizontal items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
                <Cloud size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-0">Database Backup & Disaster Recovery</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl mb-0">
              Automated AWS S3 backups protect your database snapshots. Create manual backups or restore any previous snapshot using your Admin credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<Cloud size={18} />}
              loading={creating}
              onClick={handleCreateBackup}
              className="bg-cyan-500 hover:bg-cyan-400 border-none font-semibold"
            >
              ⚡ Backup Now to S3
            </Button>
            <Button
              danger
              size="large"
              icon={<RefreshCw size={18} />}
              onClick={() => openRestoreModal(null)}
            >
              📥 Restore Latest S3 Backup
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-slate-200">
          <div className="flex orientation-horizontal items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Database size={24} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Backups in S3</div>
              <div className="text-2xl font-bold text-slate-900">{backups.length}</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <div className="flex orientation-horizontal items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Automated Nightly Schedule</div>
              <div className="text-sm font-bold text-slate-900">Every Night at 2:00 AM UTC</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <div className="flex orientation-horizontal items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Cloud size={24} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target S3 Bucket</div>
              <div className="text-sm font-mono font-bold text-slate-900">algonex-media-storage</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Backups Table */}
      <Card
        title={
          <div className="flex orientation-horizontal justify-between items-center py-2">
            <span className="font-bold text-base">Available S3 Snapshots</span>
            <Button
              size="small"
              icon={<RefreshCw size={14} />}
              onClick={loadBackups}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        <Table
          dataSource={backups}
          columns={columns}
          rowKey="filename"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Admin Password Confirmation Modal */}
      <Modal
        title={
          <div className="flex orientation-horizontal orientation-horizontal items-center gap-2 text-rose-600 font-bold">
            <AlertTriangle size={20} />
            <span>Confirm Database Restore</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="restore"
            type="primary"
            danger
            loading={restoring}
            icon={<Lock size={16} />}
            onClick={handleConfirmRestore}
          >
            Authorize & Restore Database
          </Button>,
        ]}
      >
        <div className="py-2">
          <Alert
            type="warning"
            showIcon
            message="Irreversible Action"
            description={
              targetFile
                ? `Restoring will overwrite current database state with snapshot: ${targetFile}`
                : "Restoring will overwrite current database state with the latest snapshot from AWS S3."
            }
            className="mb-4"
          />

          <p className="text-sm text-slate-600 mb-2">
            For security, please enter your <strong>Admin Password</strong> to proceed with the restoration:
          </p>

          <Input.Password
            size="large"
            placeholder="Enter Admin Password"
            prefix={<Lock size={16} className="text-slate-400" />}
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onPressEnter={handleConfirmRestore}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminBackupPage;
