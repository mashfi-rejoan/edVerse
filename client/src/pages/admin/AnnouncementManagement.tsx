import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import { Megaphone, Plus, Edit, Eye, Send, Archive, Calendar } from 'lucide-react';

interface AnnouncementRecord {
  id: string;
  title: string;
  scope: 'All' | 'Students' | 'Teachers' | 'Department';
  status: 'Draft' | 'Published' | 'Archived';
  createdBy: string;
  createdDate: string;
  publishedDate?: string;
  expiryDate?: string;
  content: string;
}

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([
    {
      id: 'ANN-1001',
      title: 'Spring 2026 Registration Open',
      scope: 'All',
      status: 'Published',
      createdBy: 'Admin Office',
      createdDate: '2026-01-02',
      publishedDate: '2026-01-03',
      expiryDate: '2026-01-10',
      content: 'Registration is now open for Spring 2026. Please complete before the deadline.'
    },
    {
      id: 'ANN-1002',
      title: 'Lab Safety Guidelines Updated',
      scope: 'Students',
      status: 'Draft',
      createdBy: 'Admin Office',
      createdDate: '2026-01-15',
      content: 'Updated lab safety rules are ready for review.'
    }
  ]);

  const [filters, setFilters] = useState({ status: 'All', scope: 'All' });
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementRecord | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, any>>({});

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchStatus = filters.status === 'All' || item.status === filters.status;
      const matchScope = filters.scope === 'All' || item.scope === filters.scope;
      return matchStatus && matchScope;
    });
  }, [announcements, filters]);

  const formFields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Announcement title' },
    { name: 'scope', label: 'Scope', type: 'select', required: true, options: [
      { label: 'All', value: 'All' },
      { label: 'Students', value: 'Students' },
      { label: 'Teachers', value: 'Teachers' },
      { label: 'Department', value: 'Department' }
    ]},
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Published', value: 'Published' },
      { label: 'Archived', value: 'Archived' }
    ]},
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'content', label: 'Content', type: 'textarea', required: true, placeholder: 'Write announcement details' }
  ];

  const handleSave = (data: any) => {
    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: data.title,
                scope: data.scope,
                status: data.status,
                expiryDate: data.expiryDate,
                content: data.content,
                publishedDate:
                  data.status === 'Published' ? item.publishedDate || new Date().toISOString().slice(0, 10) : undefined
              }
            : item
        )
      );
    } else {
      const newItem: AnnouncementRecord = {
        id: `ANN-${1000 + announcements.length + 1}`,
        title: data.title,
        scope: data.scope,
        status: data.status,
        createdBy: 'Admin Office',
        createdDate: new Date().toISOString().slice(0, 10),
        publishedDate: data.status === 'Published' ? new Date().toISOString().slice(0, 10) : undefined,
        expiryDate: data.expiryDate,
        content: data.content
      };
      setAnnouncements((prev) => [...prev, newItem]);
    }

    setShowModal(false);
    setEditingId(null);
    setFormDefaults({});
  };

  const handleEdit = (item: AnnouncementRecord) => {
    setEditingId(item.id);
    setFormDefaults({
      title: item.title,
      scope: item.scope,
      status: item.status,
      expiryDate: item.expiryDate || '',
      content: item.content
    });
    setShowModal(true);
  };

  const handlePublish = (item: AnnouncementRecord) => {
    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === item.id
          ? { ...ann, status: 'Published', publishedDate: new Date().toISOString().slice(0, 10) }
          : ann
      )
    );
  };

  const handleArchive = (item: AnnouncementRecord) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === item.id ? { ...ann, status: 'Archived' } : ann))
    );
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'scope', label: 'Scope', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: AnnouncementRecord['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Published'
              ? 'bg-green-100 text-green-700'
              : value === 'Archived'
              ? 'bg-gray-100 text-gray-600'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {value}
        </span>
      )
    },
    { key: 'createdBy', label: 'Created By', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true },
    {
      key: 'publishedDate',
      label: 'Published',
      render: (value: string | undefined) => value || '—'
    },
    {
      key: 'expiryDate',
      label: 'Expiry',
      render: (value: string | undefined) => value || '—'
    }
  ];

  const actions = [
    { label: 'View', onClick: (item: AnnouncementRecord) => { setSelectedAnnouncement(item); setShowDetailModal(true); }, color: 'blue' as const, icon: <Eye size={18} /> },
    { label: 'Edit', onClick: handleEdit, color: 'green' as const, icon: <Edit size={18} /> },
    { label: 'Publish', onClick: handlePublish, color: 'green' as const, icon: <Send size={18} /> },
    { label: 'Archive', onClick: handleArchive, color: 'red' as const, icon: <Archive size={18} /> }
  ];

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Announcements"
          subtitle="Create, publish, and archive campus announcements"
          icon={<Megaphone size={24} className="text-white" />}
          action={{
            label: 'Create Announcement',
            onClick: () => {
              setEditingId(null);
              setFormDefaults({});
              setShowModal(true);
            },
            variant: 'primary'
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.scope}
            onChange={(e) => setFilters((prev) => ({ ...prev, scope: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg"
          >
            <option value="All">All Scopes</option>
            <option value="Students">Students</option>
            <option value="Teachers">Teachers</option>
            <option value="Department">Department</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filteredAnnouncements}
          actions={actions}
          searchable
          searchFields={['title', 'createdBy', 'scope']}
        />

        <AdminModal
          title={editingId ? 'Edit Announcement' : 'Create Announcement'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <AdminForm
            fields={formFields}
            onSubmit={handleSave}
            onCancel={() => setShowModal(false)}
            submitText={editingId ? 'Update Announcement' : 'Create Announcement'}
            defaultValues={formDefaults}
          />
        </AdminModal>

        <AdminModal
          title="Announcement Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="lg"
        >
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedAnnouncement.title}</h3>
                <p className="text-xs text-gray-500">{selectedAnnouncement.createdDate} • {selectedAnnouncement.createdBy}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {selectedAnnouncement.scope}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedAnnouncement.status === 'Published'
                    ? 'bg-green-100 text-green-700'
                    : selectedAnnouncement.status === 'Archived'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedAnnouncement.status}
                </span>
                {selectedAnnouncement.expiryDate && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    <Calendar size={12} className="inline mr-1" /> Expires {selectedAnnouncement.expiryDate}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{selectedAnnouncement.content}</p>
            </div>
          )}
        </AdminModal>
      </div>
  );
};

export default AnnouncementManagement;
