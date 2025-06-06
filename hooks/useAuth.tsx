import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User types
export type UserRole = 'admin' | 'resident';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  flatNumber?: string;
  contactNumber?: string;
}

// Mock user data - In a real app, this would come from your backend
const MOCK_USERS = [
  {
    uid: 'admin123',
    email: 'admin@example.com',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin' as UserRole,
  },
  {
    uid: 'resident123',
    email: 'resident@example.com',
    password: 'resident123',
    displayName: 'John Resident',
    role: 'resident' as UserRole,
    flatNumber: 'A-101',
    contactNumber: '+91 9876543210',
  }
];

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  initialized: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const register = async (userData: any) => {
    // In a real app, this would create a new user in your backend
    console.log('Registering new user:', userData);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      initialized, 
      login, 
      logout,
      register,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}