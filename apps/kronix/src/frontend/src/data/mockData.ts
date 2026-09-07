import { Usuario, Asesor, Servicio, Reserva } from '../types';

// ============================================================
// USUARIO DEMO (dueño del negocio)
// ============================================================
export const usuarioDemo: Usuario = {
  id: 'user-1',
  nombre: 'Alejandro Ruiz',
  email: 'demo@kronix.app',
  password: 'demo123',
  avatar: '👨‍💼',
  slug: 'alejandro',
  negocio_nombre: 'Centro de Bienestar Kronix',
  negocio_descripcion: 'Servicios profesionales de salud y bienestar',
  negocio_color: '#4c6ef5',
  plan: 'pro',
  creado_en: new Date('2024-01-15'),
};

// ============================================================
// ASESORES
// ============================================================
export const asesoresDemo: Asesor[] = [
  {
    id: 'asesor-1',
    usuario_id: 'user-1',
    nombre: 'Carlos Martínez',
    email: 'carlos@kronix.app',
    avatar: '👨‍🔧',
    titulo: 'Terapeuta Senior',
    habilidades: ['serv-1', 'serv-2', 'serv-3'],
    horario: {
      dias_activos: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      hora_inicio: '08:00',
      hora_fin: '18:00',
      intervalo_minutos: 15,
      pausa_inicio: '12:00',
      pausa_fin: '13:00',
    },
    activo: true,
  },
  {
    id: 'asesor-2',
    usuario_id: 'user-1',
    nombre: 'Ana García',
    email: 'ana@kronix.app',
    avatar: '👩‍💼',
    titulo: 'Especialista en Masajes',
    habilidades: ['serv-1', 'serv-4', 'serv-5'],
    horario: {
      dias_activos: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      hora_inicio: '09:00',
      hora_fin: '17:00',
      intervalo_minutos: 15,
      pausa_inicio: '12:30',
      pausa_fin: '13:30',
    },
    activo: true,
  },
  {
    id: 'asesor-3',
    usuario_id: 'user-1',
    nombre: 'Miguel Rodríguez',
    email: 'miguel@kronix.app',
    avatar: '👨‍⚕️',
    titulo: 'Fisioterapeuta',
    habilidades: ['serv-2', 'serv-3', 'serv-5'],
    horario: {
      dias_activos: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      hora_inicio: '07:00',
      hora_fin: '16:00',
      intervalo_minutos: 15,
      pausa_inicio: '11:30',
      pausa_fin: '12:30',
    },
    activo: true,
  },
];

// ============================================================
// SERVICIOS
// ============================================================
export const serviciosDemo: Servicio[] = [
  {
    id: 'serv-1',
    usuario_id: 'user-1',
    nombre: 'Masaje Relajante',
    descripcion: 'Sesión completa de masaje para liberar tensiones y mejorar tu bienestar',
    duracion_minutos: 60,
    buffer_antes_minutos: 10,
    buffer_despues_minutos: 15,
    precio: 80000,
    moneda: 'COP',
    color: '#4c6ef5',
    icono: '💆',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: false,
  },
  {
    id: 'serv-2',
    usuario_id: 'user-1',
    nombre: 'Fisioterapia',
    descripcion: 'Tratamiento personalizado de rehabilitación y recuperación muscular',
    duracion_minutos: 45,
    buffer_antes_minutos: 5,
    buffer_despues_minutos: 10,
    precio: 120000,
    moneda: 'COP',
    color: '#7950f2',
    icono: '🏥',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: false,
  },
  {
    id: 'serv-3',
    usuario_id: 'user-1',
    nombre: 'Terapia de Pareja',
    descripcion: 'Sesión conjunta para mejorar la comunicación y conexión emocional',
    duracion_minutos: 90,
    buffer_antes_minutos: 15,
    buffer_despues_minutos: 20,
    precio: 180000,
    moneda: 'COP',
    color: '#e64980',
    icono: '💑',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: false,
  },
  {
    id: 'serv-4',
    usuario_id: 'user-1',
    nombre: 'Aromaterapia',
    descripcion: 'Experiencia sensorial con aceites esenciales para equilibrio mental',
    duracion_minutos: 50,
    buffer_antes_minutos: 10,
    buffer_despues_minutos: 10,
    precio: 95000,
    moneda: 'COP',
    color: '#20c997',
    icono: '🌿',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: true,
  },
  {
    id: 'serv-5',
    usuario_id: 'user-1',
    nombre: 'Consulta de Valoración',
    descripcion: 'Evaluación inicial para determinar el mejor tratamiento',
    duracion_minutos: 30,
    buffer_antes_minutos: 5,
    buffer_despues_minutos: 5,
    precio: 0,
    moneda: 'COP',
    color: '#fd7e14',
    icono: '📋',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: false,
  },
];

// ============================================================
// RESERVAS EXISTENTES (hoy)
// ============================================================
function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const reservasDemo: Reserva[] = [
  {
    id: 'res-1',
    usuario_id: 'user-1',
    asesor_id: 'asesor-1',
    servicio_id: 'serv-1',
    cliente_nombre: 'Juan Pérez',
    cliente_email: 'juan@email.com',
    cliente_telefono: '3001234567',
    cliente_notas: '',
    fecha: getTodayStr(),
    hora_inicio: '08:00', // Con buffer antes
    hora_fin: '09:25', // Con buffer después (10+60+15=85min)
    hora_cliente_inicio: '08:10',
    hora_cliente_fin: '09:10',
    estado: 'confirmada',
    creada_en: new Date(),
  },
  {
    id: 'res-2',
    usuario_id: 'user-1',
    asesor_id: 'asesor-1',
    servicio_id: 'serv-2',
    cliente_nombre: 'María López',
    cliente_email: 'maria@email.com',
    cliente_telefono: '3009876543',
    cliente_notas: 'Traer ropa cómoda',
    fecha: getTodayStr(),
    hora_inicio: '10:00',
    hora_fin: '11:10', // 5+45+10=60min
    hora_cliente_inicio: '10:05',
    hora_cliente_fin: '10:50',
    estado: 'confirmada',
    creada_en: new Date(),
  },
  {
    id: 'res-3',
    usuario_id: 'user-1',
    asesor_id: 'asesor-2',
    servicio_id: 'serv-4',
    cliente_nombre: 'Pedro Gómez',
    cliente_email: 'pedro@email.com',
    cliente_telefono: '3015551234',
    cliente_notas: '',
    fecha: getTodayStr(),
    hora_inicio: '09:00',
    hora_fin: '10:20', // 10+50+10=70min
    hora_cliente_inicio: '09:10',
    hora_cliente_fin: '10:00',
    estado: 'confirmada',
    creada_en: new Date(),
  },
  {
    id: 'res-4',
    usuario_id: 'user-1',
    asesor_id: 'asesor-3',
    servicio_id: 'serv-5',
    cliente_nombre: 'Sofía Ramírez',
    cliente_email: 'sofia@email.com',
    cliente_telefono: '3021112233',
    cliente_notas: 'Primera consulta',
    fecha: getTodayStr(),
    hora_inicio: '07:00',
    hora_fin: '07:40', // 5+30+5=40min
    hora_cliente_inicio: '07:05',
    hora_cliente_fin: '07:35',
    estado: 'confirmada',
    creada_en: new Date(),
  },
  {
    id: 'res-5',
    usuario_id: 'user-1',
    asesor_id: 'asesor-1',
    servicio_id: 'serv-3',
    cliente_nombre: 'Andrés y Laura',
    cliente_email: 'andres@email.com',
    cliente_telefono: '3034445566',
    cliente_notas: '',
    fecha: getTodayStr(),
    hora_inicio: '14:00',
    hora_fin: '15:45', // 15+90+20=125min
    hora_cliente_inicio: '14:15',
    hora_cliente_fin: '15:45',
    estado: 'confirmada',
    creada_en: new Date(),
  },
  {
    id: 'res-6',
    usuario_id: 'user-1',
    asesor_id: 'asesor-2',
    servicio_id: 'serv-1',
    cliente_nombre: 'Camila Torres',
    cliente_email: 'camila@email.com',
    cliente_telefono: '3047778899',
    cliente_notas: '',
    fecha: getTomorrowStr(),
    hora_inicio: '10:00',
    hora_fin: '11:25',
    hora_cliente_inicio: '10:10',
    hora_cliente_fin: '11:10',
    estado: 'confirmada',
    creada_en: new Date(),
  },
];
