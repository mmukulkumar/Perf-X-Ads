
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  deleteDoc 
} from 'firebase/firestore';

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

// Mock User for Demo Mode
const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  role: 'user',
  joinedDate: new Date().toISOString().split('T')[0],
  subscription: { tier: 'free', status: 'active' },
  usage: { searchesThisMonth: 5, generationsThisMonth: 12 },
  credits: { current: 88, limit: 100, lastReset: new Date().toISOString() },
  preferences: { marketingEmails: false, securityAlerts: true }
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

  // Sync with Firebase Auth
  useEffect(() => {
    if (!auth || !db) {
        console.log("AuthContext: Firebase not initialized. Running in offline mode.");
        setIsLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // User is signed in, fetch details from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
            setUser(userDoc.data() as User);
            } else {
            // Create new user document
            const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: 'user', // Default role
                joinedDate: new Date().toISOString().split('T')[0],
                avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
                subscription: { tier: 'free', status: 'active' },
                usage: { searchesThisMonth: 0, generationsThisMonth: 0 },
                credits: { current: 100, limit: 100, lastReset: new Date().toISOString() },
                preferences: { marketingEmails: true, securityAlerts: true }
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
            }
        } catch (e) {
            console.error("Error fetching user profile:", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string) => {
    // For demo/dev when firebase keys aren't set
    if (!auth) {
        setUser(DEMO_USER);
        return;
    }
    alert("Please use Google or GitHub login for this demo.");
  };

  const loginWithSocial = async (provider: 'google' | 'github') => {
    if (!auth) {
        // Demo fallback
        setUser(DEMO_USER);
        return;
    }
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, authProvider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    if (!auth) {
        setUser(null);
        return;
    }
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    // Optimistic update for demo mode
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    if (db) {
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, data);
        } catch (error) {
            console.error("Update profile failed", error);
        }
    }
  };

  const updatePassword = async (password: string) => {
    alert("Please update your password via your provider settings (Google/GitHub).");
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (window.confirm("Are you sure? This is permanent.")) {
        if (!auth || !db) {
            setUser(null);
            return;
        }
        try {
            await deleteDoc(doc(db, 'users', user.id));
            const currentUser = auth.currentUser;
            if (currentUser) await currentUser.delete();
            setUser(null);
        } catch (error) {
            console.error("Delete account failed", error);
            alert("Failed to delete account. You may need to re-login first.");
        }
    }
  };

  const upgradeSubscription = async (tier: SubscriptionTier) => {
    if (!user) return;
    
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

    if (db) {
        try {
            await updateDoc(doc(db, 'users', user.id), updates);
        } catch (error) {
            console.error("Subscription upgrade failed", error);
        }
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;
    
    // @ts-ignore
    const updates = { subscription: { ...user.subscription, status: 'canceled' } };
    
    // Optimistic
    // @ts-ignore
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);

    if (db) {
        try {
            await updateDoc(doc(db, 'users', user.id), updates);
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
        
        // Optimistically update UI
        setUser({
            ...user,
            credits: { ...user.credits, current: newCredits },
            usage: { ...user.usage, generationsThisMonth: newUsage }
        });

        if (db) {
            // Background update
            updateDoc(doc(db, 'users', user.id), {
                'credits.current': newCredits,
                'usage.generationsThisMonth': newUsage
            });
        }
        return true;
    } else {
        setPricingModalOpen(true);
        return false;
    }
  };

  // --- Admin Functions (Fetch from Firestore) ---
  const admin: AdminFunctions = {
    getAllUsers: async () => {
        if (!db) return [];
        const snapshot = await getDocs(collection(db, 'users'));
        return snapshot.docs.map(doc => doc.data() as User);
    },
    updateUser: async (userId, data) => {
        if (!db) return;
        await updateDoc(doc(db, 'users', userId), data);
    },
    deleteUser: async (userId) => {
        if (!db) return;
        await deleteDoc(doc(db, 'users', userId));
    },
    getStats: async () => {
        if (!db) return { totalUsers: 0, revenue: 0, activeSubs: 0 };
        const snapshot = await getDocs(collection(db, 'users'));
        const users = snapshot.docs.map(doc => doc.data() as User);
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
