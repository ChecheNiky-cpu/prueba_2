import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Package, Lock, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { createClient } from '../utils/supabase/client';
import { publicAnonKey } from '../utils/supabase/info';
import { api } from '../utils/api';

interface LoginScreenProps {
  onLogin: (session: { userId: string; email: string; name: string; accessToken: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [signup, setSignup] = useState({ show: false, name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await createClient().auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!data.session) throw new Error('No se pudo obtener la sesión');
      
      const userName = data.user.user_metadata?.name || data.user.email || 'Usuario';
      toast.success('¡Bienvenido!', { description: `Has iniciado sesión como ${userName}` });
      onLogin({
        userId: data.user.id,
        email: data.user.email || '',
        name: userName,
        accessToken: data.session.access_token
      });
    } catch (error: any) {
      toast.error('Error al iniciar sesión', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signup.password !== signup.confirm) return toast.error('Error', { description: 'Las contraseñas no coinciden' });
    if (signup.password.length < 6) return toast.error('Error', { description: 'La contraseña debe tener al menos 6 caracteres' });
    
    setLoading(true);
    try {
      await api.auth.signup(signup.email, signup.password, signup.name, publicAnonKey);
      toast.success('¡Cuenta creada exitosamente!', { description: 'Ahora puedes iniciar sesión' });
      setSignup({ show: false, name: '', email: '', password: '', confirm: '' });
      setCredentials({ email: signup.email, password: '' });
    } catch (error: any) {
      toast.error('Error al crear cuenta', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle>Sistema de Inventario</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" value={credentials.email}
                onChange={(e) => setCredentials(p => ({ ...p, email: e.target.value }))} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="Ingresa tu contraseña" value={credentials.password}
                onChange={(e) => setCredentials(p => ({ ...p, password: e.target.value }))} required disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />Iniciando sesión...</> 
                : <><Lock className="w-4 h-4 mr-2" />Iniciar Sesión</>}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">¿No tienes cuenta?</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setSignup(p => ({ ...p, show: true }))} disabled={loading}>
            <UserPlus className="w-4 h-4 mr-2" />Crear Cuenta
          </Button>
        </CardContent>
      </Card>

      <Dialog open={signup.show} onOpenChange={(show) => setSignup(p => ({ ...p, show }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Cuenta</DialogTitle>
            <DialogDescription>Completa los datos para registrarte en el sistema</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input placeholder="Juan Pérez" value={signup.name} onChange={(e) => setSignup(p => ({ ...p, name: e.target.value }))} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input type="email" placeholder="tu@email.com" value={signup.email} onChange={(e) => setSignup(p => ({ ...p, email: e.target.value }))} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="Mínimo 6 caracteres" value={signup.password} onChange={(e) => setSignup(p => ({ ...p, password: e.target.value }))} required disabled={loading} minLength={6} />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Contraseña</Label>
              <Input type="password" placeholder="Repite la contraseña" value={signup.confirm} onChange={(e) => setSignup(p => ({ ...p, confirm: e.target.value }))} required disabled={loading} minLength={6} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSignup(p => ({ ...p, show: false }))} disabled={loading}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando...</> : 'Crear Cuenta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
