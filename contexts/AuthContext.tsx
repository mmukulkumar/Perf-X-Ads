
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Types
export type UserRole = 'user' | 'admin';
export type SubscriptionTier = 'free' | 'monthly' | 'annual' | 'lifetime';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joinedDate: string;
  subscription: {
    tier: SubscriptionTier;
    status: 'active' | 'expired' | 'canceled';
    expiryDate?: string;
  };
  usage: {
    searchesThisMonth: number;
    generationsThisMonth: number;
  };
  credits: {
    current: number;
    limit: number;
    lastReset: string;
  };
  preferences: {
    marketingEmails: boolean;
    securityAlerts: boolean;
    theme?: 'light' | 'dark';
  };
}

// Mock User for Demo Mode - Now Admin by default for easier testing
const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Demo Admin',
  email: 'admin@perfxads.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  role: 'admin',
  joinedDate: new Date().toISOString().split('T')[0],
  subscription: { tier: 'lifetime', status: 'active' },
  usage: { searchesThisMonth: 125, generationsThisMonth: 89 },
  credits: { current: 9999, limit: 9999, lastReset: new Date().toISOString() },
  preferences: { marketingEmails: true, securityAlerts: true }
};

const MOCK_USERS: User[] = [
    DEMO_USER,
    {
        id: 'u2',
        name: 'Alice Marketing',
        email: 'alice@agency.com',
        role: 'user',
        joinedDate: '2024-01-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        subscription: { tier: 'monthly', status: 'active', expiryDate: '2025-01-15' },
        usage: { searchesThisMonth: 45, generationsThisMonth: 120 },
        credits: { current: 1000, limit: 1000, lastReset: '2024-10-01' },
        preferences: { marketingEmails: true, securityAlerts: true }
    },
    {
        id: 'u3',
        name: 'Bob Builder',
        email: 'bob@saas.io',
        role: 'user',
        joinedDate: '2024-03-10',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        subscription: { tier: 'free', status: 'active' },
        usage: { searchesThisMonth: 2, generationsThisMonth: 5 },
        credits: { current: 95, limit: 100, lastReset: '2024-10-01' },
        preferences: { marketingEmails: false, securityAlerts: true }
    }
];

interface AdminFunctions {
  getAllUsers: () => Promise<User[]>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getStats: () => Promise<{ totalUsers: number; revenue: number; activeSubs: number }>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  upgradeSubscription: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isAdmin: boolean;
  isPro: boolean;
  consumeCredits: (amount: number) => boolean;
  openPricingModal: () => void;
  setPricingModalOpen: (isOpen: boolean) => void;
  isPricingModalOpen: boolean;
  admin: AdminFunctions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPricingModalOpen, setPricingModalOpen] = useState(false);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // If Supabase is not configured (offline mode), auto-login as Demo Admin
    if (!supabase) {
        setUser(DEMO_USER);
        setIsLoading(false);
        return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch detailed user profile from 'users' table
        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUser(profile as User);
            } else if (!error) {
                // Profile doesn't exist, create it
                const newUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    email: session.user.email || '',
                    role: 'user',
                    joinedDate: new Date().toISOString().split('T')[0],
                    avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
                    subscription: { tier: 'free', status: 'active' },
                    usage: { searchesThisMonth: 0, generationsThisMonth: 0 },
                    credits: { current: 100, limit: 100, lastReset: new Date().toISOString() },
                    preferences: { marketingEmails: true, securityAlerts: true }
                };
                
                const { error: insertError } = await supabase.from('users').insert([newUser]);
                if (!insertError) {
                    setUser(newUser);
                }
            }
        } catch (e) {
            console.error("Error fetching user:", e);
        }
      } else {
        // Only set user to null if we're not manually falling back to demo mode in current session
        // This logic is simplified for the specific request
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    if (!supabase) {
        setUser(DEMO_USER);
        return;
    }
    // Magic link login for email
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        console.error("Login failed", error);
        // Fallback to demo user if backend is not configured or rate limited
        if (email.toLowerCase().includes('demo') || error.status === 400 || error.status === 429 || error.status === 500) {
             console.warn("Login failed (backend issue). Falling back to Demo User.");
             setUser(DEMO_USER);
        } else {
             alert(`Login failed: ${error.message}`);
        }
    } else {
        alert("Check your email for the login link!");
    }
  };

  const loginWithSocial = async (provider: 'google' | 'github') => {
    if (!supabase) {
        setUser(DEMO_USER);
        return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login failed", error);
      
      // Auto-fallback to demo user if providers are not enabled
      if (error?.message?.includes('provider is not enabled') || 
          error?.msg?.includes('provider is not enabled') ||
          error?.error_code === 'validation_failed' ||
          error?.code === 400) {
          
          console.warn("Provider not enabled. Falling back to Demo User for preview.");
          setUser(DEMO_USER);
      } else {
          alert(`Login failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const logout = async () => {
    if (!supabase) {
        setUser(null);
        return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null); // Force logout locally
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !supabase) return;
    
    // Optimistic update
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    try {
        await supabase
            .from('users')
            .update(data)
            .eq('id', user.id);
    } catch (error) {
        console.error("Update profile failed", error);
    }
  };

  const updatePassword = async (password: string) => {
    if (!supabase) return;
    try {
        await supabase.auth.updateUser({ password });
    } catch (error) {
        console.error("Update password failed", error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (window.confirm("Are you sure? This is permanent.")) {
        if (!supabase) {
            setUser(null);
            return;
        }
        try {
            await supabase.from('users').delete().eq('id', user.id);
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Delete account failed", error);
        }
    }
  };

  const upgradeSubscription = async (tier: SubscriptionTier) => {
    if (!user || !supabase) return;
    
    const updates = {
        subscription: {
            tier,
            status: 'active' as const,
            expiryDate: tier === 'monthly' ? new Date(Date.now() + 30*24*60*60*1000).toISOString() : new Date(Date.now() + 365*24*60*60*1000).toISOString()
        },
        credits: { ...user.credits, current: 999999, limit: 999999 }
    };

    // Optimistic
    // @ts-ignore
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);

    try {
        await supabase.from('users').update(updates).eq('id', user.id);
    } catch (error) {
        console.error("Subscription upgrade failed", error);
    }
  };

  const cancelSubscription = async () => {
    if (!user || !supabase) return;
    
    // @ts-ignore
    const updates = { subscription: { ...user.subscription, status: 'canceled' } };
    
    // Optimistic
    // @ts-ignore
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);

    try {
        await supabase.from('users').update(updates).eq('id', user.id);
    } catch (error) {
        console.error("Cancel failed", error);
    }
  };

  const consumeCredits = (amount: number): boolean => {
    if (!user) {
        setPricingModalOpen(true);
        return false;
    }
    const isPro = user.subscription.tier !== 'free';
    if (isPro) return true;

    if (user.credits.current >= amount) {
        const newCredits = user.credits.current - amount;
        const newUsage = user.usage.generationsThisMonth + 1;
        
        const updates = {
            credits: { ...user.credits, current: newCredits },
            usage: { ...user.usage, generationsThisMonth: newUsage }
        };

        // Optimistically update UI
        setUser({
            ...user,
            ...updates
        });

        if (supabase) {
            supabase.from('users').update(updates).eq('id', user.id);
        }
        return true;
    } else {
        setPricingModalOpen(true);
        return false;
    }
  };

  // --- Admin Functions ---
  const admin: AdminFunctions = {
    getAllUsers: async () => {
        if (!supabase) return MOCK_USERS; // Return mocks if offline
        const { data } = await supabase.from('users').select('*');
        return (data || []) as User[];
    },
    updateUser: async (userId, data) => {
        if (!supabase) return;
        await supabase.from('users').update(data).eq('id', userId);
    },
    deleteUser: async (userId) => {
        if (!supabase) return;
        await supabase.from('users').delete().eq('id', userId);
    },
    getStats: async () => {
        if (!supabase) {
            // Calculate stats from mocks
            const users = MOCK_USERS;
            const revenue = users.reduce((acc, u) => {
                if (u.subscription.tier === 'monthly') return acc + 29;
                if (u.subscription.tier === 'annual') return acc + (180/12);
                if (u.subscription.tier === 'lifetime') return acc + 249;
                return acc;
            }, 0);
            const activeSubs = users.filter(u => u.subscription.tier !== 'free' && u.subscription.status === 'active').length;
            return { totalUsers: users.length, revenue, activeSubs };
        }
        const { data } = await supabase.from('users').select('*');
        const users = (data || []) as User[];
        const revenue = users.reduce((acc, u) => {
            if (u.subscription.tier === 'monthly') return acc + 29;
            if (u.subscription.tier === 'annual') return acc + (180/12);
            if (u.subscription.tier === 'lifetime') return acc + 249;
            return acc;
        }, 0);
        const activeSubs = users.filter(u => u.subscription.tier !== 'free' && u.subscription.status === 'active').length;
        return { totalUsers: users.length, revenue, activeSubs };
    }
  };

  const isAdmin = user?.role === 'admin';
  const isPro = user?.subscription.tier !== 'free';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      loginWithSocial, 
      logout, 
      updateProfile,
      updatePassword,
      deleteAccount,
      upgradeSubscription,
      cancelSubscription,
      isAdmin,
      isPro,
      consumeCredits,
      openPricingModal: () => setPricingModalOpen(true),
      setPricingModalOpen,
      isPricingModalOpen,
      admin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
