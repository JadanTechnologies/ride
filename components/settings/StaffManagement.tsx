import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'support' | 'driver_manager' | 'analyst';
  status: 'active' | 'inactive';
}

interface Permission {
  id: string;
  name: string;
  checked: boolean;
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@kekenapepe.com',
      phone: '+234 XXX XXX XXXX',
      role: 'admin',
      status: 'active'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffMember>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'support',
    status: 'active'
  });

  const roles = [
    { id: 'admin', label: 'Administrator', permissions: ['all'] },
    { id: 'support', label: 'Support Team', permissions: ['view_users', 'respond_chat', 'send_notifications'] },
    { id: 'driver_manager', label: 'Driver Manager', permissions: ['view_drivers', 'verify_drivers', 'suspend_drivers'] },
    { id: 'analyst', label: 'Analyst', permissions: ['view_analytics', 'view_reports', 'export_data'] }
  ];

  const handleAddNew = () => {
    setFormData({ id: Date.now().toString(), name: '', email: '', phone: '', role: 'support', status: 'active' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (member: StaffMember) => {
    setFormData(member);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setStaff(prev => prev.map(s => s.id === editingId ? formData : s));
    } else {
      setStaff(prev => [...prev, formData]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Staff Management & Roles</h3>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Staff List */}
      <div className="space-y-3 mb-6">
        {staff.map((member) => (
          <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.email} • {member.phone}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{member.role}</span>
                  <span className={`text-xs px-2 py-1 rounded ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Form */}
      {showForm && (
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@kekenapepe.com"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full border rounded px-3 py-2"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-4 h-4"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-4 h-4"
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Staff Member' : 'Add Staff Member'}
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
