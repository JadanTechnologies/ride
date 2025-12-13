import React, { useState } from 'react';
import { Search, Trash2, Lock, CheckCircle, XCircle, RotateCcw, Edit2, Key, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'passenger';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  rides: number;
  rating: number;
}

const mockUsers: User[] = [
  { id: '1', name: 'Chioma Adebayo', email: 'chioma@email.com', phone: '+234802123456', role: 'passenger', status: 'active', joinDate: '2025-01-15', rides: 24, rating: 4.8 },
  { id: '2', name: 'Ibrahim Musa', email: 'ibrahim@email.com', phone: '+234801654321', role: 'driver', status: 'active', joinDate: '2024-12-01', rides: 156, rating: 4.6 },
  { id: '3', name: 'Samuel Okon', email: 'samuel@email.com', phone: '+234809876543', role: 'passenger', status: 'suspended', joinDate: '2025-02-10', rides: 5, rating: 2.1 },
  { id: '4', name: 'Emmanuel Bassey', email: 'emmanuel@email.com', phone: '+234805432109', role: 'driver', status: 'banned', joinDate: '2024-11-20', rides: 203, rating: 1.2 },
  { id: '5', name: 'Sarah Smith', email: 'sarah@email.com', phone: '+234807654321', role: 'passenger', status: 'active', joinDate: '2025-01-08', rides: 12, rating: 4.9 },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'driver' | 'passenger'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: string; user: User } | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (user: User) => {
    setConfirmAction({ action: 'delete', user });
    setShowConfirmModal(true);
  };

  const handleBanUser = (user: User) => {
    setConfirmAction({ action: 'ban', user });
    setShowConfirmModal(true);
  };

  const handleSuspendUser = (user: User) => {
    setConfirmAction({ action: 'suspend', user });
    setShowConfirmModal(true);
  };

  const handleReactivateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...user, status: 'active' });
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { action, user } = confirmAction;

    switch (action) {
      case 'delete':
        setUsers(users.filter(u => u.id !== user.id));
        setSelectedUser(null);
        break;
      case 'ban':
        setUsers(users.map(u => u.id === user.id ? { ...u, status: 'banned' } : u));
        if (selectedUser?.id === user.id) {
          setSelectedUser({ ...user, status: 'banned' });
        }
        break;
      case 'suspend':
        setUsers(users.map(u => u.id === user.id ? { ...u, status: 'suspended' } : u));
        if (selectedUser?.id === user.id) {
          setSelectedUser({ ...user, status: 'suspended' });
        }
        break;
    }

    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleResetPassword = () => {
    if (!selectedUser || !newPassword.trim()) return;

    // In production, this would send to backend
    console.log(`Password reset for ${selectedUser.name}: ${newPassword}`);
    
    setNewPassword('');
    setShowResetPasswordModal(false);
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} /> Active</span>;
      case 'suspended':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle size={14} /> Suspended</span>;
      case 'banned':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle size={14} /> Banned</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">User Management</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          
          {/* Role Filter */}
          <div className="flex gap-2">
            {(['all', 'driver', 'passenger'] as const).map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterRole === role
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'active', 'suspended', 'banned'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedUser?.id === user.id
                  ? 'bg-brand-50 border-brand-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900 text-sm">{user.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium capitalize">
                  {user.role}
                </span>
                {getStatusBadge(user.status)}
              </div>
            </button>
          ))}
        </div>

        {/* User Details & Actions */}
        {selectedUser && (
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusBadge(selectedUser.status)}
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Join Date</p>
                    <p className="font-semibold text-gray-900">{selectedUser.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Rides</p>
                    <p className="font-semibold text-gray-900">{selectedUser.rides}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                    <p className="font-semibold text-gray-900">{selectedUser.rating} ★</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-800 mb-3">Admin Actions</p>

                <button
                  onClick={() => setShowResetPasswordModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                >
                  <Key size={18} />
                  Reset Password
                </button>

                {selectedUser.status === 'active' ? (
                  <>
                    <button
                      onClick={() => handleSuspendUser(selectedUser)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors font-medium"
                    >
                      <AlertCircle size={18} />
                      Suspend User
                    </button>
                    <button
                      onClick={() => handleBanUser(selectedUser)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium"
                    >
                      <Lock size={18} />
                      Ban User
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReactivateUser(selectedUser)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium"
                  >
                    <RotateCcw size={18} />
                    Reactivate User
                  </button>
                )}

                <button
                  onClick={() => handleDeleteUser(selectedUser)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium border border-red-200"
                >
                  <Trash2 size={18} />
                  Delete User (Permanent)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reset Password for {selectedUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">User will be sent a notification about the password reset.</p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setNewPassword('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">
              {confirmAction.action === 'delete' && `Are you sure you want to permanently delete ${confirmAction.user.name}? This action cannot be undone.`}
              {confirmAction.action === 'ban' && `Are you sure you want to ban ${confirmAction.user.name}? They will no longer be able to use the platform.`}
              {confirmAction.action === 'suspend' && `Are you sure you want to suspend ${confirmAction.user.name}? They will be temporarily unable to use the platform.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium ${
                  confirmAction.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : confirmAction.action === 'ban'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
