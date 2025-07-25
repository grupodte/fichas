// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserProfile = async (session) => {
        if (!session?.user) return null;

        const { data: profile } = await supabase
            .from('usuarios')
            .select('rol_global, nombre, empresa_id')
            .eq('id', session.user.id)
            .single();

        return {
            ...session.user,
            rol_global: profile?.rol_global || 'user',
            nombre: profile?.nombre || session.user.email,
            empresa_id: profile?.empresa_id || null
        };
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const fullUser = await loadUserProfile(session);
                setUser(fullUser);
            }
            setLoading(false);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session) {
                    const fullUser = await loadUserProfile(session);
                    setUser(fullUser);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
