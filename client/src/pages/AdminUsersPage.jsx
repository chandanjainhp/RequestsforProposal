import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Filter, X, AlertCircle } from 'lucide-react';
import api from '../api/axiosConfig';

// API Service
const usersAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },
  
  create: async (userData) => {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },
  
  updateRole: async (id, role) => {
    const response = await api.patch(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, { status });
    return response.data;
  }
};

// User Form Modal Component
const UserModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    ...user
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({ name: '', email: '', role: 'user', status: 'active' });
    }
  }, [user, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-[640] text-[#4A4A4A]">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6D8196] hover:text-[#4A4A4A] transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                errors.name ? 'border-red-500' : 'border-[#CBCBCB]'
              }`}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                errors.email ? 'border-red-500' : 'border-[#CBCBCB]'
              }`}
              disabled={isLoading || user} // Disable email edit for existing users
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-[#CBCBCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196]"
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-[#CBCBCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196]"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] hover:bg-[#CBCBCB] hover:bg-opacity-20 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#6D8196] text-[#FFFFE3] font-[600] py-2 px-4 rounded-[10px] hover:bg-[#5A6B7F] transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, userName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertCircle size={24} />
          <h2 className="text-xl font-[640]">Confirm Deletion</h2>
        </div>
        
        <p className="text-[#4A4A4A] mb-6">
          Are you sure you want to delete user <strong>{userName}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] hover:bg-[#CBCBCB] hover:bg-opacity-20 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white font-[600] py-2 px-4 rounded-[10px] hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersAPI.getAll({
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setUsers(data.data || data); // Handle different response formats
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // CRUD Operations
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSubmitUser = async (formData) => {
    try {
      setModalLoading(true);
      
      if (selectedUser) {
        // Update existing user
        await usersAPI.update(selectedUser.id, formData);
      } else {
        // Create new user
        await usersAPI.create(formData);
      }
      
      setShowUserModal(false);
      setSelectedUser(null);
      await fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error saving user:', err);
      alert(err.response?.data?.message || 'Failed to save user. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setModalLoading(true);
      await usersAPI.delete(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      await fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Filter users client-side (for additional filtering if API doesn't support)
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFE3] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D8196] mx-auto mb-4"></div>
          <p className="text-[#6D8196]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFE3] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">User Management</h1>
          <p className="text-base text-[#6D8196] font-[460]">Manage user accounts and permissions</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-[560]">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6D8196] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#CBCBCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196] bg-white"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="text-[#6D8196] w-4 h-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-[#CBCBCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196] bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-[#CBCBCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D8196] bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Add User Button */}
            <button
              onClick={handleAddUser}
              className="bg-[#6D8196] text-[#FFFFE3] font-[600] py-2 px-4 rounded-[10px] hover:bg-[#5A6B7F] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D8196] mx-auto mb-4"></div>
              <p className="text-[#6D8196]">Refreshing...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-[#CBCBCB] mb-4" />
              <h3 className="text-lg font-[560] text-[#4A4A4A] mb-2">No users found</h3>
              <p className="text-[#6D8196]">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first user.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#CBCBCB] bg-opacity-20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-[600] text-[#4A4A4A]">User</th>
                    <th className="px-6 py-4 text-left text-sm font-[600] text-[#4A4A4A]">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-[600] text-[#4A4A4A]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-[600] text-[#4A4A4A]">Last Login</th>
                    <th className="px-6 py-4 text-left text-sm font-[600] text-[#4A4A4A]">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-[600] text-[#4A4A4A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-[#CBCBCB] hover:bg-[#CBCBCB] hover:bg-opacity-10">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-[560] text-[#4A4A4A]">{user.name || 'N/A'}</div>
                          <div className="text-sm text-[#6D8196]">{user.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-[560] ${
                          user.role === 'admin'
                            ? 'bg-[#6D8196] bg-opacity-10 text-[#6D8196]'
                            : 'bg-[#CBCBCB] bg-opacity-20 text-[#4A4A4A]'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-[560] ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6D8196]">
                        {formatDate(user.lastLogin || user.last_login)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6D8196]">
                        {formatDate(user.createdAt || user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-[#6D8196] hover:text-[#4A4A4A] transition-colors"
                            title="Edit user"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Show result count */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-[#6D8196] text-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleSubmitUser}
        isLoading={modalLoading}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default AdminUsersPage;
