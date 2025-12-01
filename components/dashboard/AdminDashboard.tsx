
import React, { useState } from 'react';
import { useAuth, User, SubscriptionTier } from '../../contexts/AuthContext';
import { Users, DollarSign, TrendingUp, Search, MoreVertical, Shield, CheckCircle, XCircle, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, admin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  if (user?.role !== 'admin') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Access Denied</h2>
            <p className="text-brand-dark/60">You do not have permission to view this area.</p>
        </div>
      );
  }

  const allUsers = admin.getAllUsers();
  const stats = admin.getStats();

  // Filter users
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  const handleUpdateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser) return;
      admin.updateUser(editingUser.id, {
          name: editingUser.name,
          subscription: editingUser.subscription,
          credits: editingUser.credits
      });
      setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
      if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
          admin.deleteUser(userId);
      }
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                    <Shield className="w-8 h-8 text-brand-primary" /> Admin Portal
                </h1>
                <p className="text-sm text-brand-dark/60 mt-1">Manage users, subscriptions, and platform settings.</p>
            </div>
            <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Operational
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-brand-dark/60 mb-1">Total Users</p>
                    <div className="text-3xl font-extrabold text-brand-dark">{stats.totalUsers}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-brand-dark/60 mb-1">Monthly Revenue (Est)</p>
                    <div className="text-3xl font-extrabold text-brand-dark">${stats.revenue.toFixed(0)}</div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 text-green-600">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-brand-dark/60 mb-1">Active Subscriptions</p>
                    <div className="text-3xl font-extrabold text-brand-dark">{stats.activeSubs}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                    <TrendingUp className="w-6 h-6" />
                </div>
            </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-medium/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-brand-dark">User Management</h3>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-medium" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-brand-light border border-brand-medium/30 rounded-lg text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-dark" 
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-brand-light/30 text-brand-dark/60 border-b border-brand-medium/20 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Subscription</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Credits</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-medium/10">
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-brand-light/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={u.avatar} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                                        <div>
                                            <div className="font-bold text-brand-dark">{u.name}</div>
                                            <div className="text-xs text-brand-dark/50">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                                        u.subscription.tier === 'lifetime' ? 'bg-purple-100 text-purple-700' : 
                                        u.subscription.tier !== 'free' ? 'bg-blue-100 text-blue-700' : 
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {u.subscription.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 ${u.subscription.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                        {u.subscription.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        <span className="capitalize">{u.subscription.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-brand-dark/70 font-mono text-xs">
                                    {u.credits.current} / {u.credits.limit}
                                </td>
                                <td className="px-6 py-4 text-brand-dark/50 text-xs">{u.joinedDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingUser(u)} className="p-1.5 hover:bg-blue-50 text-brand-dark/60 hover:text-blue-600 rounded transition-colors" title="Edit User">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 hover:bg-red-50 text-brand-dark/60 hover:text-red-600 rounded transition-colors" title="Delete User">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-brand-dark/40">
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-brand-medium/20 text-center bg-brand-light/10">
                <span className="text-xs text-brand-dark/40">Showing {filteredUsers.length} of {allUsers.length} users</span>
            </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-brand-surface rounded-2xl w-full max-w-lg shadow-2xl border border-brand-medium/20 overflow-hidden">
                    <div className="p-6 border-b border-brand-medium/20 flex justify-between items-center bg-brand-light/30">
                        <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                            <Edit className="w-5 h-5 text-brand-primary" /> Edit User
                        </h3>
                        <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-brand-light rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-1">Name</label>
                            <input 
                                type="text" 
                                value={editingUser.name} 
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                className="w-full px-4 py-2 bg-brand-light/50 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/30 outline-none"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-1">Subscription Tier</label>
                                <select 
                                    value={editingUser.subscription.tier} 
                                    onChange={(e) => setEditingUser({ ...editingUser, subscription: { ...editingUser.subscription, tier: e.target.value as SubscriptionTier } })}
                                    className="w-full px-4 py-2 bg-brand-light/50 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/30 outline-none"
                                >
                                    <option value="free">Free</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                    <option value="lifetime">Lifetime</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-1">Status</label>
                                <select 
                                    value={editingUser.subscription.status} 
                                    onChange={(e) => setEditingUser({ ...editingUser, subscription: { ...editingUser.subscription, status: e.target.value as any } })}
                                    className="w-full px-4 py-2 bg-brand-light/50 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/30 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-1">Credit Balance</label>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingUser({ ...editingUser, credits: { ...editingUser.credits, current: Math.max(0, editingUser.credits.current - 100) } })} className="px-3 bg-red-100 text-red-600 rounded hover:bg-red-200">-</button>
                                <input 
                                    type="number" 
                                    value={editingUser.credits.current} 
                                    onChange={(e) => setEditingUser({ ...editingUser, credits: { ...editingUser.credits, current: parseInt(e.target.value) || 0 } })}
                                    className="flex-1 text-center px-4 py-2 bg-brand-light/50 border border-brand-medium/30 rounded-lg text-brand-dark font-mono"
                                />
                                <button type="button" onClick={() => setEditingUser({ ...editingUser, credits: { ...editingUser.credits, current: editingUser.credits.current + 100 } })} className="px-3 bg-green-100 text-green-600 rounded hover:bg-green-200">+</button>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-2 border border-brand-medium/30 rounded-lg text-brand-dark hover:bg-brand-light transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
