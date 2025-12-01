
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, CreditCard, Activity, Calendar, LogOut, Sparkles, Zap, Edit2, Check, X, Clock,
  LayoutGrid, Settings, Shield, Bell, Lock, Moon, Sun, Monitor, Trash2, Mail, Save, AlertTriangle
} from 'lucide-react';

interface UserDashboardProps {
  onShowPricing: () => void;
  theme?: string;
  toggleTheme?: () => void;
  initialTab?: 'overview' | 'subscription' | 'settings';
}

type TabType = 'overview' | 'subscription' | 'settings';
type SettingsTabType = 'profile' | 'security' | 'preferences' | 'danger';

const UserDashboard: React.FC<UserDashboardProps> = ({ onShowPricing, theme, toggleTheme, initialTab = 'overview' }) => {
  const { user, logout, isPro, updateProfile, updatePassword, deleteAccount, cancelSubscription } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTabType>('profile');
  
  // Update active tab if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobTitle: 'Digital Marketer'
  });
  
  // Security State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preference State
  const [prefForm, setPrefForm] = useState({
    marketingEmails: user?.preferences.marketingEmails ?? true,
    securityAlerts: user?.preferences.securityAlerts ?? true,
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user) {
        setProfileForm(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  if (!user) return null;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateProfile({ name: profileForm.name });
      showNotification("Profile updated successfully!");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (securityForm.newPassword !== securityForm.confirmPassword) {
          showNotification("Passwords do not match", "error");
          return;
      }
      await updatePassword(securityForm.newPassword);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification("Password updated successfully!");
  };

  const handleDeleteAccount = async () => {
      await deleteAccount();
  };

  const nextResetDate = isPro 
    ? null 
    : new Date(new Date(user.credits.lastReset).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  // Mock Activity Feed
  const activities = [
      { id: 1, action: 'Generated Keyword Report', tool: 'AI Keyword Research', date: '2 mins ago', icon: Sparkles },
      { id: 2, action: 'Checked Mobile Compatibility', tool: 'Mobile-First Tool', date: '4 hours ago', icon: Activity },
      { id: 3, action: 'Exported VAT Calculation', tool: 'VAT Calculator', date: 'Yesterday', icon: CreditCard },
      { id: 4, action: 'Updated Subscription', tool: 'Billing', date: '3 days ago', icon: CreditCard },
  ];

  return (
    <div className="w-full font-inter animate-in fade-in duration-500 min-h-[80vh] bg-brand-light/20">
      
      {/* Toast Notification */}
      {notification && (
          <div className={`fixed top-24 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-medium">{notification.message}</span>
          </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Header & Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-brand-dark mb-1">Dashboard</h1>
                <p className="text-brand-dark/60">Manage your account, subscription and preferences.</p>
            </div>
            
            <div className="flex items-center bg-brand-surface p-1 rounded-xl border border-brand-medium/20 shadow-sm">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-brand-light text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                >
                    <LayoutGrid className="w-4 h-4" /> Overview
                </button>
                <button 
                    onClick={() => setActiveTab('subscription')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'subscription' ? 'bg-brand-light text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                >
                    <CreditCard className="w-4 h-4" /> Subscription
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-brand-light text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                >
                    <Settings className="w-4 h-4" /> Settings
                </button>
            </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                {/* User Welcome Card */}
                <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full border-4 border-brand-light shadow-md overflow-hidden bg-gray-100">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark mb-1">Welcome back, {user.name}</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-brand-dark/60 text-sm">{user.email}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isPro ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    {user.subscription.tier} Plan
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        {!isPro && (
                            <button onClick={onShowPricing} className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm">
                                <Sparkles className="w-4 h-4" /> Upgrade to Pro
                            </button>
                        )}
                        <button onClick={logout} className="px-4 py-2.5 border border-brand-medium/30 text-brand-dark font-medium rounded-xl hover:bg-brand-light transition-colors flex items-center gap-2 text-sm">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-surface p-6 rounded-2xl border border-brand-medium/30 shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Zap className="w-24 h-24 text-yellow-500" /></div>
                        <p className="text-sm font-bold text-brand-dark/50 uppercase tracking-wide mb-2">Weekly Credits</p>
                        <div className="flex items-baseline gap-2">
                            <div className="text-4xl font-extrabold text-brand-dark mb-1">{isPro ? '∞' : user.credits.current}</div>
                            {!isPro && <span className="text-sm text-brand-dark/40 font-medium">/ {user.credits.limit}</span>}
                        </div>
                        {!isPro && (
                            <>
                                <div className="w-full bg-brand-light rounded-full h-1.5 mt-4">
                                    <div className={`h-1.5 rounded-full ${user.credits.current < 20 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${(user.credits.current / user.credits.limit) * 100}%` }}></div>
                                </div>
                                <p className="text-xs text-brand-dark/40 mt-2">Resets on {nextResetDate}</p>
                            </>
                        )}
                        {isPro && <p className="text-xs text-brand-dark/40 mt-4 font-medium text-green-600">Unlimited Access Active</p>}
                    </div>

                    <div className="bg-brand-surface p-6 rounded-2xl border border-brand-medium/30 shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Sparkles className="w-24 h-24 text-indigo-500" /></div>
                        <p className="text-sm font-bold text-brand-dark/50 uppercase tracking-wide mb-2">Total Generations</p>
                        <div className="text-4xl font-extrabold text-brand-dark mb-1">{user.usage.generationsThisMonth}</div>
                        <p className="text-xs text-brand-dark/40 mt-4">Calculations & AI tasks this month</p>
                    </div>

                    <div className="bg-brand-surface p-6 rounded-2xl border border-brand-medium/30 shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-brand-medium" /> Recent Activity</h3>
                        <div className="space-y-4">
                            {activities.slice(0, 3).map((activity, index) => (
                                <div key={activity.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark/60">
                                        <activity.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-brand-dark truncate">{activity.action}</p>
                                        <p className="text-xs text-brand-dark/40">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-brand-medium/20 bg-brand-light/10">
                        <h2 className="text-xl font-bold text-brand-dark mb-2">Subscription Plan</h2>
                        <p className="text-brand-dark/60 text-sm">Manage your billing and plan details</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 w-full p-6 rounded-xl border border-brand-medium/20 bg-brand-light/20">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wide mb-2">Current Plan</p>
                                        <h3 className="text-3xl font-extrabold text-brand-dark capitalize">{user.subscription.tier.replace('-', ' ')}</h3>
                                        <p className="text-sm text-brand-dark/60 mt-1">
                                            {user.subscription.tier === 'free' ? 'Basic access to tools' : 'Full access to all premium features'}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.subscription.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-dark/60">Billing Cycle</span>
                                        <span className="font-medium text-brand-dark capitalize">{user.subscription.tier === 'monthly' ? 'Monthly' : user.subscription.tier === 'annual' ? 'Annual' : 'Free'}</span>
                                    </div>
                                    {user.subscription.expiryDate && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-brand-dark/60">Next Billing Date</span>
                                            <span className="font-medium text-brand-dark">{new Date(user.subscription.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-dark/60">Payment Method</span>
                                        <span className="font-medium text-brand-dark flex items-center gap-2">
                                            {user.subscription.tier === 'free' ? 'N/A' : <><CreditCard className="w-3 h-3" /> •••• 4242</>}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {!isPro ? (
                                        <button onClick={onShowPricing} className="flex-1 py-2.5 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-colors text-sm">
                                            Upgrade Plan
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={onShowPricing} className="flex-1 py-2.5 bg-brand-surface border border-brand-medium/30 text-brand-dark font-bold rounded-lg hover:bg-brand-light transition-colors text-sm">
                                                Change Plan
                                            </button>
                                            {user.subscription.status === 'active' && user.subscription.tier !== 'lifetime' && (
                                                <button onClick={cancelSubscription} className="px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm border border-transparent hover:border-red-100">
                                                    Cancel
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/3">
                                <h4 className="font-bold text-brand-dark mb-4 text-sm">Billing History</h4>
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-brand-light/50 transition-colors border border-transparent hover:border-brand-medium/10">
                                            <div>
                                                <p className="text-sm font-medium text-brand-dark">Invoice #{2024000 + i}</p>
                                                <p className="text-xs text-brand-dark/50">Oct {28-i}, 2025</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-brand-dark">$0.00</span>
                                                <button className="text-brand-dark/40 hover:text-brand-primary">
                                                    <CreditCard className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Settings Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm overflow-hidden p-2">
                        <button 
                            onClick={() => setActiveSettingsTab('profile')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeSettingsTab === 'profile' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/30'}`}
                        >
                            <User className="w-4 h-4" /> Profile
                        </button>
                        <button 
                            onClick={() => setActiveSettingsTab('security')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeSettingsTab === 'security' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/30'}`}
                        >
                            <Lock className="w-4 h-4" /> Security
                        </button>
                        <button 
                            onClick={() => setActiveSettingsTab('preferences')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeSettingsTab === 'preferences' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/30'}`}
                        >
                            <Bell className="w-4 h-4" /> Preferences
                        </button>
                        <div className="my-2 border-t border-brand-medium/10"></div>
                        <button 
                            onClick={() => setActiveSettingsTab('danger')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeSettingsTab === 'danger' ? 'bg-red-50 text-red-600' : 'text-red-500/70 hover:text-red-600 hover:bg-red-50/50'}`}
                        >
                            <Shield className="w-4 h-4" /> Danger Zone
                        </button>
                    </div>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden min-h-[500px]">
                    
                    {/* PROFILE SETTINGS */}
                    {activeSettingsTab === 'profile' && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-brand-dark mb-6">Profile Settings</h2>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full border-4 border-brand-light overflow-hidden bg-gray-100">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <button type="button" className="absolute bottom-0 right-0 p-2 bg-brand-dark text-white rounded-full hover:bg-brand-dark/90 shadow-sm border-2 border-white">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-bold text-brand-dark">Profile Picture</h3>
                                        <p className="text-xs text-brand-dark/50 mt-1">JPG, GIF or PNG. Max size 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2">Job Title</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.jobTitle}
                                            onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-brand-dark mb-2">Email Address</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-dark/40" />
                                                <input 
                                                    type="email" 
                                                    value={profileForm.email}
                                                    readOnly
                                                    className="w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-medium/20 rounded-lg text-brand-dark/60 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-brand-dark/40 mt-1.5">Contact support to change email address.</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-brand-medium/10 flex justify-end">
                                    <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-colors shadow-sm flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* SECURITY SETTINGS */}
                    {activeSettingsTab === 'security' && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-brand-dark mb-6">Security</h2>
                            
                            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={securityForm.currentPassword}
                                        onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">New Password</label>
                                    <input 
                                        type="password" 
                                        value={securityForm.newPassword}
                                        onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={securityForm.confirmPassword}
                                        onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/30 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-dark/90 transition-colors shadow-sm">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* PREFERENCES */}
                    {activeSettingsTab === 'preferences' && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-brand-dark mb-6">Preferences</h2>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-4 text-brand-dark/60">Appearance</h3>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-brand-medium/20 bg-brand-light/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark">
                                                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark">Interface Theme</p>
                                                <p className="text-xs text-brand-dark/60">Select your preferred color scheme</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={toggleTheme}
                                            className="px-4 py-2 bg-brand-surface border border-brand-medium/30 rounded-lg text-sm font-medium hover:bg-brand-light transition-colors"
                                        >
                                            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-4 text-brand-dark/60">Notifications</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3">
                                            <div>
                                                <p className="font-bold text-brand-dark text-sm">Marketing Emails</p>
                                                <p className="text-xs text-brand-dark/60">Receive updates about new features and promotions</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={prefForm.marketingEmails} onChange={(e) => setPrefForm({...prefForm, marketingEmails: e.target.checked})} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-3">
                                            <div>
                                                <p className="font-bold text-brand-dark text-sm">Security Alerts</p>
                                                <p className="text-xs text-brand-dark/60">Get notified about suspicious activity</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={prefForm.securityAlerts} onChange={(e) => setPrefForm({...prefForm, securityAlerts: e.target.checked})} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DANGER ZONE */}
                    {activeSettingsTab === 'danger' && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h2>
                            
                            <div className="border border-red-200 dark:border-red-900/50 rounded-xl p-6 bg-red-50/50 dark:bg-red-900/10">
                                <h3 className="font-bold text-brand-dark mb-2">Delete Account</h3>
                                <p className="text-sm text-brand-dark/70 mb-6 max-w-xl">
                                    Once you delete your account, there is no going back. Please be certain. 
                                    All your data, credits, and subscription history will be permanently removed.
                                </p>
                                <button 
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        )}

      </div>
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default UserDashboard;
