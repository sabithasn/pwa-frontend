import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const session = useLiveQuery(async () => {
        const s = await db.sessions.get('current');
        return s !== undefined ? s : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Determine loading state. useLiveQuery returns undefined while loading,
        // but now returns null if the record is explicitly not found.
        if (session !== undefined) {
            setLoading(false);
        }
    }, [session]);

    const login = async (username: string) => {
        const mockToken = btoa(JSON.stringify({ username, exp: Date.now() + 86400000 }));
        await db.sessions.put({
            id: 'current',
            username,
            token: mockToken,
            loginTime: Date.now()
        });
    };

    const logout = async () => {
        await db.sessions.delete('current');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!session?.token,
                username: session?.username ?? null,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
