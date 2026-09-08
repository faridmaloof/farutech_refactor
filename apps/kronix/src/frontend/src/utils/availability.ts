import { Asesor, Servicio, Reserva, SlotDisponible } from '../types';

// ============================================================
// MOTOR DE DISPONIBILIDAD - KRONIX
// Implementa: Snapping, Colisiones, Pooling
// ============================================================

const DIAS_MAP: Record<string, number> = {
  'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3,
  'jueves': 4, 'viernes': 5, 'sábado': 6,
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * SNAPPING: Alinea un tiempo al intervalo más cercano
 */
function snapToInterval(minutes: number, interval: number): number {
  return Math.ceil(minutes / interval) * interval;
}

/**
 * Verifica si una fecha es un día laborable para el asesor
 */
function esDiaLaborable(date: Date, horario: Asesor['horario']): boolean {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const diaSemana = dias[date.getDay()];
  return horario.dias_activos.includes(diaSemana);
}

/**
 * Obtiene las reservas de un asesor para una fecha específica
 */
function getReservasAsesorFecha(
  reservas: Reserva[],
  asesorId: string,
  fecha: string
): Reserva[] {
  return reservas.filter(
    r => r.asesor_id === asesorId && r.fecha === fecha && r.estado !== 'cancelada'
  );
}

/**
 * Verifica si un slot colisiona con una reserva existente
 */
function colisionaConReserva(
  slotInicio: number,
  slotFin: number,
  reservas: Reserva[]
): boolean {
  for (const r of reservas) {
    const resInicio = timeToMinutes(r.hora_inicio);
    const resFin = timeToMinutes(r.hora_fin);
    // Colisión si los rangos se superponen
    if (slotInicio < resFin && slotFin > resInicio) {
      return true;
    }
  }
  return false;
}

/**
 * Verifica si un slot está dentro de la pausa de almuerzo
 */
function estaEnPausa(slotInicio: number, slotFin: number, horario: Asesor['horario']): boolean {
  if (!horario.pausa_inicio || !horario.pausa_fin) return false;
  const pausaIni = timeToMinutes(horario.pausa_inicio);
  const pausaFin = timeToMinutes(horario.pausa_fin);
  return slotInicio < pausaFin && slotFin > pausaIni;
}

/**
 * Calcula los slots disponibles para UN asesor en una fecha
 * Implementa Snapping + Colisiones
 */
export function calcularDisponibilidadAsesor(
  asesor: Asesor,
  servicio: Servicio,
  fecha: string,
  reservas: Reserva[]
): SlotDisponible[] {
  const dateObj = new Date(fecha + 'T12:00:00');
  
  // Verificar si es día laborable
  if (!esDiaLaborable(dateObj, asesor.horario)) {
    return [];
  }

  const inicioJornada = timeToMinutes(asesor.horario.hora_inicio);
  const finJornada = timeToMinutes(asesor.horario.hora_fin);
  const intervalo = asesor.horario.intervalo_minutos;

  // Duración total = buffer_antes + core + buffer_después
  const duracionTotal = servicio.buffer_antes_minutos + servicio.duracion_minutos + servicio.buffer_despues_minutos;

  // Obtener reservas del asesor para esta fecha
  const reservasAsesor = getReservasAsesorFecha(reservas, asesor.id, fecha);

  const slots: SlotDisponible[] = [];

  // Generar slots con Snapping
  for (let mins = inicioJornada; mins + duracionTotal <= finJornada; mins += intervalo) {
    // Snapping: asegurar que el inicio esté alineado al intervalo
    const slotInicio = snapToInterval(mins, intervalo);
    const slotFin = slotInicio + duracionTotal;

    // Verificar que no exceda la jornada
    if (slotFin > finJornada) break;

    // Verificar colisiones
    if (colisionaConReserva(slotInicio, slotFin, reservasAsesor)) continue;

    // Verificar pausa
    if (estaEnPausa(slotInicio, slotFin, asesor.horario)) continue;

    slots.push({
      hora: minutesToTime(slotInicio),
      asesor_id: asesor.id,
      disponible: true,
    });
  }

  return slots;
}

/**
 * POOLING: Calcula disponibilidad cruzando todos los asesores capacitados
 * Si se especifica asesorId, solo calcula para ese asesor
 * Si no, cruza todos y hace balanceo de carga
 */
export function calcularDisponibilidadPooling(
  asesores: Asesor[],
  servicio: Servicio,
  fecha: string,
  reservas: Reserva[],
  asesorEspecificoId?: string
): SlotDisponible[] {
  // Filtrar asesores capacitados para el servicio
  let asesoresFiltrados = asesores.filter(
    a => a.activo && a.habilidades.includes(servicio.id)
  );

  // Si se especifica un asesor, solo usar ese
  if (asesorEspecificoId) {
    asesoresFiltrados = asesoresFiltrados.filter(a => a.id === asesorEspecificoId);
  }

  // Calcular disponibilidad para cada asesor
  const todosLosSlots: SlotDisponible[] = [];
  for (const asesor of asesoresFiltrados) {
    const slots = calcularDisponibilidadAsesor(asesor, servicio, fecha, reservas);
    todosLosSlots.push(...slots);
  }

  // Unificar slots por hora (Pooling)
  const slotsUnicos = new Map<string, SlotDisponible>();
  for (const slot of todosLosSlots) {
    if (!slotsUnicos.has(slot.hora)) {
      slotsUnicos.set(slot.hora, slot);
    }
  }

  // Ordenar por hora
  return Array.from(slotsUnicos.values()).sort((a, b) => 
    timeToMinutes(a.hora) - timeToMinutes(b.hora)
  );
}

/**
 * Selecciona el asesor con menor carga de trabajo (balanceo)
 */
export function seleccionarAsesorBalanceo(
  asesores: Asesor[],
  servicio: Servicio,
  reservas: Reserva[]
): Asesor | null {
  const asesoresCapacitados = asesores.filter(
    a => a.activo && a.habilidades.includes(servicio.id)
  );

  if (asesoresCapacitados.length === 0) return null;

  // Contar reservas confirmadas de hoy para cada asesor
  const hoy = new Date().toISOString().split('T')[0];
  const cargas = asesoresCapacitados.map(a => ({
    asesor: a,
    carga: reservas.filter(r => r.asesor_id === a.id && r.fecha === hoy && r.estado === 'confirmada').length,
  }));

  // Retornar el de menor carga
  cargas.sort((a, b) => a.carga - b.carga);
  return cargas[0].asesor;
}

/**
 * Calcula los tiempos de hora_cliente_inicio y hora_cliente_fin
 */
export function calcularHorasCliente(
  horaInicio: string,
  servicio: Servicio
): { hora_cliente_inicio: string; hora_cliente_fin: string } {
  const inicio = timeToMinutes(horaInicio);
  const clienteInicio = inicio + servicio.buffer_antes_minutos;
  const clienteFin = clienteInicio + servicio.duracion_minutos;
  return {
    hora_cliente_inicio: minutesToTime(clienteInicio),
    hora_cliente_fin: minutesToTime(clienteFin),
  };
}

/**
 * Calcula la hora_fin_real (incluye buffer después)
 */
export function calcularHoraFinReal(horaInicio: string, servicio: Servicio): string {
  const inicio = timeToMinutes(horaInicio);
  const fin = inicio + servicio.buffer_antes_minutos + servicio.duracion_minutos + servicio.buffer_despues_minutos;
  return minutesToTime(fin);
}

export { timeToMinutes, minutesToTime };
