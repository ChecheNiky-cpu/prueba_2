import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { InventoryDashboard } from './components/InventoryDashboard';
import { createClient } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';

interface UserSession {
    userId: string;
    email: string;
    name: string;
    accessToken: string;
}

export default function App() {
    const [session, setSession] = useState<UserSession | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        createClient().auth.getSession().then(({ data }) => {
            if (data.session) {
                const user = data.session.user;
                setSession({
                    userId: user.id,
                    email: user.email || '',
                    name: user.user_metadata?.name || user.email || 'Usuario',
                    accessToken: data.session.access_token
                });
            }
            setIsChecking(false);
        });
    }, []);

    const handleLogout = async () => {
        await createClient().auth.signOut();
        setSession(null);
    };

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {!session ? (
                    <LoginScreen onLogin={setSession} />
                ) : (
                    <InventoryDashboard
                        onLogout={handleLogout}
                        username={session.name}
                        accessToken={session.accessToken}
                    />
                )}
            </div>
            <Toaster />
        </>
    );
}
