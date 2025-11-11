import React, { useEffect, useState, useCallback } from 'react';
import { getUsers, getUserDetail, updateUser, deleteUser, blockUser } from '../services/adminApi';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        page,
        limit: 20,
        role: roleFilter,
        status: statusFilter,
        search: search
      });

      if (response.success) {
        setUsers(response.users || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleViewDetails = async (userId: string) => {
    try {
      const response = await getUserDetail(userId);
      if (response.success) {
        setSelectedUser(response.user);
        setEditData({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          address: response.user.address,
          role: response.user.role,
          status: response.user.status
        });
        setShowModal(true);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      alert('Có lỗi khi tải thông tin người dùng');
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      setProcessing(true);
      const response = await updateUser(selectedUser._id, editData);
      if (response.success) {
        alert('Cập nhật thành công!');
        loadUsers();
        setShowModal(false);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi khi cập nhật người dùng');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      setProcessing(true);
      const response = await deleteUser(userId);
      if (response.success) {
        alert('Xóa người dùng thành công!');
        loadUsers();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi khi xóa người dùng');
    } finally {
      setProcessing(false);
    }
  };

  const handleBlock = async (userId: string, block: boolean) => {
    const action = block ? 'chặn' : 'bỏ chặn';
    if (!window.confirm(`Bạn có chắc muốn ${action} người dùng này?`)) return;

    try {
      setProcessing(true);
      const response = await blockUser(userId, block);
      if (response.success) {
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} người dùng thành công!`);
        loadUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, status: block ? 'blocked' : 'active' });
        }
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      alert(`Có lỗi khi ${action} người dùng`);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'provider': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users in the system</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Name</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Role</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Joined</th>
              <th className="text-center py-4 px-6 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(user._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {!editMode ? (
                <>
                  {/* View Mode */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium text-lg">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-lg">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-lg">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Address</label>
                      <p className="font-medium text-lg">{selectedUser.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Role</label>
                      <p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Statistics */}
                  {selectedUser.role === 'provider' && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <label className="text-sm text-blue-600">Services</label>
                          <p className="text-2xl font-bold text-blue-700">{selectedUser.servicesCount}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <label className="text-sm text-green-600">Bookings</label>
                          <p className="text-2xl font-bold text-green-700">{selectedUser.bookingsCount}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit User
                    </button>
                    {selectedUser.status === 'active' ? (
                      <button
                        onClick={() => handleBlock(selectedUser._id, true)}
                        disabled={processing}
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
                      >
                        Block User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(selectedUser._id, false)}
                        disabled={processing}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      >
                        Unblock User
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedUser._id)}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                    >
                      Delete User
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={editData.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdate}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
