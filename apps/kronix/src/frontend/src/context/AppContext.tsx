import React, { createContext, useContext, useState, useCallback } from 'react';
import { Usuario, Asesor, Servicio, Reserva, Pagina } from '../types';
import { usuarioDemo, asesoresDemo, serviciosDemo, reservasDemo } from '../data/mockData';

interface AppState {
  usuario: Usuario | null;
  asesores: Asesor[];
  servicios: Servicio[];
  reservas: Reserva[];
  pagina: Pagina;
  slugPublico: string | null;
  isAuthenticated: boolean;
  // Actions
  login: (email: string, password: string) => boolean;
  register: (nombre: string, email: string, password: string, slug: string, negocio: string) => boolean;
  logout: () => void;
  setPagina: (p: Pagina) => void;
  setSlugPublico: (s: string | null) => void;
  agregarReserva: (r: Reserva) => void;
  cancelarReserva: (id: string) => void;
  completarReserva: (id: string) => void;
  agregarServicio: (s: Servicio) => void;
  eliminarServicio: (id: string) => void;
  actualizarServicio: (s: Servicio) => void;
  agregarAsesor: (a: Asesor) => void;
  eliminarAsesor: (id: string) => void;
  actualizarAsesor: (a: Asesor) => void;
  actualizarUsuario: (u: Usuario) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [asesores, setAsesores] = useState<Asesor[]>(asesoresDemo);
  const [servicios, setServicios] = useState<Servicio[]>(serviciosDemo);
  const [reservas, setReservas] = useState<Reserva[]>(reservasDemo);
  const [pagina, setPagina] = useState<Pagina>('landing');
  const [slugPublico, setSlugPublico] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === usuarioDemo.email && password === usuarioDemo.password) {
      setUsuario(usuarioDemo);
      setIsAuthenticated(true);
      setPagina('dashboard');
      return true;
    }
    return false;
  }, []);

  const register = useCallback((nombre: string, email: string, _password: string, slug: string, negocio: string): boolean => {
    const nuevoUsuario: Usuario = {
      id: 'user-' + Date.now(),
      nombre,
      email,
      password: _password,
      avatar: '👤',
      slug,
      negocio_nombre: negocio,
      negocio_descripcion: '',
      negocio_color: '#4c6ef5',
      plan: 'free',
      creado_en: new Date(),
    };
    setUsuario(nuevoUsuario);
    setIsAuthenticated(true);
    setPagina('dashboard');
    return true;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    setIsAuthenticated(false);
    setPagina('landing');
  }, []);

  const agregarReserva = useCallback((r: Reserva) => {
    setReservas(prev => [...prev, r]);
  }, []);

  const cancelarReserva = useCallback((id: string) => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'cancelada' as const } : r));
  }, []);

  const completarReserva = useCallback((id: string) => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'completada' as const } : r));
  }, []);

  const agregarServicio = useCallback((s: Servicio) => {
    setServicios(prev => [...prev, s]);
  }, []);

  const eliminarServicio = useCallback((id: string) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  }, []);

  const actualizarServicio = useCallback((s: Servicio) => {
    setServicios(prev => prev.map(x => x.id === s.id ? s : x));
  }, []);

  const agregarAsesor = useCallback((a: Asesor) => {
    setAsesores(prev => [...prev, a]);
  }, []);

  const eliminarAsesor = useCallback((id: string) => {
    setAsesores(prev => prev.filter(a => a.id !== id));
  }, []);

  const actualizarAsesor = useCallback((a: Asesor) => {
    setAsesores(prev => prev.map(x => x.id === a.id ? a : x));
  }, []);

  const actualizarUsuario = useCallback((u: Usuario) => {
    setUsuario(u);
  }, []);

  return (
    <AppContext.Provider value={{
      usuario, asesores, servicios, reservas, pagina, slugPublico, isAuthenticated,
      login, register, logout, setPagina, setSlugPublico,
      agregarReserva, cancelarReserva, completarReserva,
      agregarServicio, eliminarServicio, actualizarServicio,
      agregarAsesor, eliminarAsesor, actualizarAsesor, actualizarUsuario,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
