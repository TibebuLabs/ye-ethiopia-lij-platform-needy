// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../api/auth';

// // Types
// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: UserRole;
//   status: 'active' | 'pending' | 'suspended';
//   avatar?: string;
//   organizationId?: string;
//   organizationName?: string;
//   permissions: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// export type UserRole = 'admin' | 'organization' | 'sponsor' | 'school' | 'government';

// export interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   role: UserRole | null;
//   signIn: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   hasPermission: (permission: string) => boolean;
//   hasRole: (roles: UserRole | UserRole[]) => boolean;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUser = async (): Promise<void> => {
//     try {
//       const userData = await getCurrentUser();
//       setUser(userData);
//     } catch (error) {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async (email: string, password: string): Promise<void> => {
//     try {
//       const response = await apiLogin(email, password);
//       localStorage.setItem('access_token', response.access);
//       localStorage.setItem('refresh_token', response.refresh);
//       setUser(response.user);
//     } catch (error) {
//       throw new Error('Authentication failed');
//     }
//   };

//   const signOut = async (): Promise<void> => {
//     try {
//       await apiLogout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       setUser(null);
//     }
//   };

//   const hasPermission = (permission: string): boolean => {
//     if (!user) return false;
//     return user.permissions?.includes(permission) || false;
//   };

//   const hasRole = (roles: UserRole | UserRole[]): boolean => {
//     if (!user?.role) return false;
    
//     if (Array.isArray(roles)) {
//       return roles.includes(user.role);
//     }
    
//     return user.role === roles;
//   };

//   const refreshUser = async (): Promise<void> => {
//     await fetchUser();
//   };

//   const value: AuthContextType = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     role: user?.role || null,
//     signIn,
//     signOut,
//     hasPermission,
//     hasRole,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };