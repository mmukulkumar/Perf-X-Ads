
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { redirectToCheckout, isStripeConfigured } from '../lib/stripe';

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
  stripeCustomerId?: string; // Added for Stripe integration
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

// Mock User for Demo Mode
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

interface AdminFunctions {
  getAllUsers: () => Promise<User[]>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getStats: () => Promise<{ totalUsers: number; revenue: number; activeSubs: number }>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  clearError: () => void;
  login: (email: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'github') => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  upgradeSubscription: (priceId: string) => Promise<void>; // Updated signature to accept Price ID
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPricingModalOpen, setPricingModalOpen] = useState(false);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // Check for errors in URL fragment (returned from OAuth redirect)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorDescription = hashParams.get('error_description');
    const errorMsg = hashParams.get('error');
    
    if (errorDescription || errorMsg) {
        setAuthError(errorDescription?.replace(/\+/g, ' ') || errorMsg || "Authentication failed");
        // Clear hash to prevent error persistence on refresh
        window.history.replaceState(null, '', window.location.pathname);
    }

    if (!supabase) {
        setIsLoading(false);
        return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
            // 1. Try to fetch existing profile
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUser(profile as User);
            } else {
                // 2. If no profile exists (or error), prepare new user data
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
                
                // 3. Try to save to DB - use UPSERT to avoid race conditions
                const { error: insertError } = await supabase.from('users').upsert([newUser], { onConflict: 'id' });
                
                if (insertError) {
                    console.error("DB Insert Error:", insertError);
                    if (insertError.code === '42501' || insertError.status === 403) {
                        setAuthError("Database permission error (RLS). Please contact admin.");
                    }
                    setUser(newUser);
                } else {
                    setUser(newUser);
                }
            }
        } catch (e) {
            console.error("Error in auth state change:", e);
        }
      } else {
        if (user?.id !== 'demo-user') {
            setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setAuthError(null);

  const login = async (email: string) => {
    if (!supabase) return;
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        setAuthError(error.message);
    } else {
        alert("Check your email for the login link!");
    }
  };

  const loginWithSocial = async (provider: 'google' | 'github') => {
    if (!supabase) return;
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin, 
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login failed", error);
      setAuthError(error.message || 'Failed to initiate login');
    }
  };

  const loginAsDemo = async () => {
      setIsLoading(true);
      setAuthError(null);
      await new Promise(resolve => setTimeout(resolve, 800));
      setUser(DEMO_USER);
      setIsLoading(false);
  };

  const logout = async () => {
    if (!supabase) {
        setUser(null);
        window.location.reload();
        return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null);
      window.location.reload();
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);
    if (supabase && user.id !== 'demo-user') {
        try {
            const { error } = await supabase.from('users').update(data).eq('id', user.id);
            if (error) throw error;
        } catch (error: any) {
            console.error("Update profile failed", error);
            setAuthError("Failed to save profile: " + error.message);
        }
    }
  };

  const updatePassword = async (password: string) => {
    if (!supabase || user?.id === 'demo-user') return;
    try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    } catch (error: any) {
        console.error("Update password failed", error);
        setAuthError("Password update failed: " + error.message);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (window.confirm("Are you sure? This is permanent.")) {
        if (supabase && user.id !== 'demo-user') {
            try {
                await supabase.from('users').delete().eq('id', user.id);
                await supabase.auth.signOut();
            } catch (error: any) {
                console.error("Delete account failed", error);
                setAuthError("Failed to delete account: " + error.message);
            }
        }
        setUser(null);
    }
  };

  const upgradeSubscription = async (priceId: string, quantity: number = 1) => {
    if (!user) {
        throw new Error('User not logged in');
    }

    // Demo user simulation
    if (user.id === 'demo-user') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const tier = priceId.includes('monthly') ? 'monthly' : priceId.includes('annual') ? 'annual' : 'lifetime';
        const updates = {
            subscription: {
                tier,
                status: 'active' as const,
                expiryDate: tier === 'monthly' 
                    ? new Date(Date.now() + 30*24*60*60*1000).toISOString() 
                    : new Date(Date.now() + 365*24*60*60*1000).toISOString()
            },
            credits: { ...user.credits, current: 999999, limit: 999999 }
        };
        // @ts-ignore
        setUser(prev => prev ? ({ ...prev, ...updates }) : null);
        return;
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
        console.warn("Stripe not fully configured. Falling back to simulation.");
        // Fallback simulation for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        const tier = priceId.includes('monthly') ? 'monthly' : priceId.includes('annual') ? 'annual' : 'lifetime';
        const updates = {
            subscription: {
                tier,
                status: 'active' as const,
                expiryDate: tier === 'monthly' 
                    ? new Date(Date.now() + 30*24*60*60*1000).toISOString() 
                    : new Date(Date.now() + 365*24*60*60*1000).toISOString()
            },
            credits: { ...user.credits, current: 999999, limit: 999999 }
        };
        // @ts-ignore
        setUser(prev => prev ? ({ ...prev, ...updates }) : null);
        if (supabase) {
            await supabase.from('users').update(updates).eq('id', user.id);
        }
        return;
    }

    // Use redirectToCheckout which handles Edge Functions and fallbacks
    const result = await redirectToCheckout({
        priceId,
        userId: user.id,
        email: user.email,
        quantity,
        successUrl: `${window.location.origin}?payment=success`,
        cancelUrl: `${window.location.origin}?payment=cancelled`,
    });

    if (result.error) {
        console.error("Subscription upgrade failed:", result.error);
        throw new Error(result.error);
    }
    
    // If we get here without redirect, something went wrong
    // The redirect should have happened in redirectToCheckout
  };

  const cancelSubscription = async () => {
    if (!user) return;
    
    // In a real app, this would call Stripe API via backend to cancel
    // @ts-ignore
    const updates = { subscription: { ...user.subscription, status: 'canceled' } };
    // @ts-ignore
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);
    if (supabase && user.id !== 'demo-user') {
        try {
            await supabase.from('users').update(updates).eq('id', user.id);
        } catch (error) {
            console.error("Cancel failed", error);
        }
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
        setUser({ ...user, ...updates });
        if (supabase && user.id !== 'demo-user') {
            supabase.from('users').update(updates).eq('id', user.id);
        }
        return true;
    } else {
        setPricingModalOpen(true);
        return false;
    }
  };

  const admin: AdminFunctions = {
    getAllUsers: async () => {
        if (!supabase) return [];
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
        if (!supabase) return { totalUsers: 0, revenue: 0, activeSubs: 0 };
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
      authError,
      clearError,
      login, 
      loginWithSocial, 
      loginAsDemo,
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
