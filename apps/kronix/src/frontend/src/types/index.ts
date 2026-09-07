// ============================================================
// KRONIX - Tipos del Sistema SaaS
// ============================================================

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  avatar: string;
  slug: string; // URL pública: kronix.app/{slug}
  negocio_nombre: string;
  negocio_descripcion: string;
  negocio_color: string;
  plan: 'free' | 'pro' | 'business';
  creado_en: Date;
}

export interface Asesor {
  id: string;
  usuario_id: string;
  nombre: string;
  email: string;
  avatar: string;
  titulo: string;
  habilidades: string[]; // IDs de servicios
  horario: Horario;
  activo: boolean;
}

export interface Horario {
  dias_activos: string[]; // ['lunes', 'martes', ...]
  hora_inicio: string; // "09:00"
  hora_fin: string; // "18:00"
  intervalo_minutos: number; // 15, 30, 60
  pausa_inicio?: string;
  pausa_fin?: string;
}

export interface Servicio {
  id: string;
  usuario_id: string;
  nombre: string;
  descripcion: string;
  duracion_minutos: number;
  buffer_antes_minutos: number; // NO visible al cliente
  buffer_despues_minutos: number; // NO visible al cliente
  precio: number;
  moneda: string;
  color: string;
  icono: string;
  activo: boolean;
  mostrar_precio: boolean;
  mostrar_buffer_cliente: boolean; // Si se muestra info de prep/post al cliente
}

export interface Reserva {
  id: string;
  usuario_id: string; // Dueño del negocio
  asesor_id: string;
  servicio_id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_notas: string;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:MM (hora real con buffer antes)
  hora_fin: string; // HH:MM (hora real con buffer después)
  hora_cliente_inicio: string; // HH:MM (hora que ve el cliente)
  hora_cliente_fin: string; // HH:MM
  estado: 'confirmada' | 'pendiente' | 'cancelada' | 'completada';
  creada_en: Date;
}

export interface SlotDisponible {
  hora: string; // HH:MM
  asesor_id: string;
  disponible: boolean;
}

export type Pagina = 
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'servicios'
  | 'asesores'
  | 'reservas'
  | 'calendario'
  | 'configuracion'
  | 'public-booking';
