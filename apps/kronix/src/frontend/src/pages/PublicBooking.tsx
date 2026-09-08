import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Servicio, Asesor, Reserva } from '../types';
import { calcularDisponibilidadPooling, calcularHorasCliente, calcularHoraFinReal, timeToMinutes } from '../utils/availability';
import { Clock, ArrowLeft, ArrowRight, Calendar, User, CheckCircle, ChevronLeft, ChevronRight, MapPin, Info } from 'lucide-react';

type Step = 'service' | 'asesor' | 'date' | 'time' | 'details' | 'confirmed';

export default function PublicBooking() {
  const { usuario, asesores, servicios, reservas, agregarReserva, setPagina } = useApp();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [selectedAsesor, setSelectedAsesor] = useState<Asesor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [confirmedReserva, setConfirmedReserva] = useState<Reserva | null>(null);

  // Si no hay usuario logueado, mostrar la demo
  const displayUsuario = usuario || {
    nombre: 'Alejandro Ruiz',
    avatar: '👨‍💼',
    negocio_nombre: 'Centro de Bienestar Kronix',
    negocio_descripcion: 'Servicios profesionales de salud y bienestar',
    negocio_color: '#4c6ef5',
    slug: 'alejandro',
  };

  const serviciosActivos = servicios.filter(s => s.activo);
  const asesoresActivos = asesores.filter(a => a.activo);

  // Asesores disponibles para el servicio seleccionado
  const asesoresDisponibles = useMemo(() => {
    if (!selectedService) return [];
    return asesoresActivos.filter(a => a.habilidades.includes(selectedService.id));
  }, [selectedService, asesoresActivos]);

  // Fechas disponibles (próximos 14 días)
  const fechasDisponibles = useMemo(() => {
    const fechas: string[] = [];
    const hoy = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(hoy);
      d.setDate(d.getDate() + i);
      const diaStr = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][d.getDay()];
      
      // Verificar si algún asesor trabaja ese día
      const hayAsesor = selectedAsesor
        ? selectedAsesor.horario.dias_activos.includes(diaStr)
        : asesoresDisponibles.some(a => a.horario.dias_activos.includes(diaStr));
      
      if (hayAsesor) {
        fechas.push(d.toISOString().split('T')[0]);
      }
    }
    return fechas;
  }, [selectedAsesor, asesoresDisponibles]);

  // Slots disponibles
  const slotsDisponibles = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return calcularDisponibilidadPooling(
      asesoresActivos,
      selectedService,
      selectedDate,
      reservas,
      selectedAsesor?.id
    );
  }, [selectedService, selectedDate, selectedAsesor, asesoresActivos, reservas]);

  const handleConfirm = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) return;

    // Seleccionar asesor (específico o balanceo)
    let asesorFinal = selectedAsesor;
    if (!asesorFinal) {
      // Balanceo: elegir el de menor carga
      const cargas = asesoresDisponibles.map(a => ({
        asesor: a,
        carga: reservas.filter(r => r.asesor_id === a.id && r.fecha === selectedDate && r.estado !== 'cancelada').length,
      }));
      cargas.sort((a, b) => a.carga - b.carga);
      asesorFinal = cargas[0]?.asesor || null;
    }

    if (!asesorFinal) return;

    const { hora_cliente_inicio, hora_cliente_fin } = calcularHorasCliente(selectedTime, selectedService);
    const hora_fin_real = calcularHoraFinReal(selectedTime, selectedService);

    const nuevaReserva: Reserva = {
      id: 'res-' + Date.now(),
      usuario_id: displayUsuario.slug,
      asesor_id: asesorFinal.id,
      servicio_id: selectedService.id,
      cliente_nombre: clientName,
      cliente_email: clientEmail,
      cliente_telefono: clientPhone,
      cliente_notas: clientNotes,
      fecha: selectedDate,
      hora_inicio: selectedTime,
      hora_fin: hora_fin_real,
      hora_cliente_inicio,
      hora_cliente_fin,
      estado: 'confirmada',
      creada_en: new Date(),
    };

    agregarReserva(nuevaReserva);
    setConfirmedReserva(nuevaReserva);
    setStep('confirmed');
  };

  const resetBooking = () => {
    setStep('service');
    setSelectedService(null);
    setSelectedAsesor(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setConfirmedReserva(null);
  };

  const isPublicView = !usuario;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublicView ? (
              <>
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold font-display text-gradient">Kronix</span>
              </>
            ) : (
              <button onClick={() => setPagina('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Volver al panel</span>
              </button>
            )}
          </div>
          {!isPublicView && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-indigo-600">Vista previa pública</span>
              <span className="text-xs font-mono text-indigo-700">kronix.app/{displayUsuario.slug}</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Business Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            {displayUsuario.avatar}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{displayUsuario.negocio_nombre}</h1>
          <p className="text-gray-500 mt-1">{displayUsuario.negocio_descripcion}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['service', 'asesor', 'date', 'time', 'details'] as Step[]).map((s, i) => {
            const steps = ['service', 'asesor', 'date', 'time', 'details'];
            const currentIdx = steps.indexOf(step === 'confirmed' ? 'details' : step);
            const stepIdx = steps.indexOf(s);
            const isActive = stepIdx <= currentIdx;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive ? 'gradient-brand text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepIdx < currentIdx ? '✓' : i + 1}
                </div>
                {i < 4 && <div className={`w-8 h-0.5 ${stepIdx < currentIdx ? 'bg-indigo-500' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {step === 'service' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Selecciona un servicio</h2>
              <p className="text-gray-500 mb-6">Elige el servicio que deseas reservar</p>
              <div className="grid md:grid-cols-2 gap-4">
                {serviciosActivos.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setStep('asesor'); }}
                    className="text-left p-6 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                        style={{ backgroundColor: s.color + '15' }}>
                        {s.icono}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{s.nombre}</h3>
                        <p className="text-sm text-gray-500 mt-1">{s.descripcion}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" /> {s.duracion_minutos} min
                          </span>
                          {s.mostrar_precio && (
                            <span className="text-sm font-semibold" style={{ color: s.color }}>
                              {s.precio > 0 ? `$${s.precio.toLocaleString('es-CO')}` : 'Gratis'}
                            </span>
                          )}
                        </div>
                        {s.mostrar_buffer_cliente && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Info className="w-3 h-3" />
                            <span>Llega {s.buffer_antes_minutos} min antes para preparación</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'asesor' && selectedService && (
            <div className="p-8">
              <button onClick={() => setStep('service')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Elige tu asesor</h2>
              <p className="text-gray-500 mb-6">Selecciona un asesor específico o deja que elijamos el mejor para ti</p>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Opción "Cualquier asesor" */}
                <button
                  onClick={() => { setSelectedAsesor(null); setStep('date'); }}
                  className="text-left p-6 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                      ✨
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-700">Cualquier asesor disponible</h3>
                      <p className="text-sm text-gray-500 mt-1">Asignamos automáticamente al mejor disponible</p>
                      <p className="text-xs text-indigo-600 mt-2">{asesoresDisponibles.length} asesores pueden atenderte</p>
                    </div>
                  </div>
                </button>
                {/* Asesores específicos */}
                {asesoresDisponibles.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAsesor(a); setStep('date'); }}
                    className="text-left p-6 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl">
                        {a.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-700">{a.nombre}</h3>
                        <p className="text-sm text-gray-500">{a.titulo}</p>
                        <p className="text-xs text-gray-400 mt-1">{a.horario.hora_inicio} - {a.horario.hora_fin}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'date' && selectedService && (
            <div className="p-8">
              <button onClick={() => setStep('asesor')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Selecciona una fecha</h2>
              <p className="text-gray-500 mb-6">Elige el día que prefieras para tu cita</p>
              <div className="grid grid-cols-7 gap-2">
                {fechasDisponibles.map(f => {
                  const d = new Date(f + 'T12:00:00');
                  const diaNombre = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()];
                  const diaNum = d.getDate();
                  const mesNombre = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][d.getMonth()];
                  const isSelected = selectedDate === f;
                  const isToday = f === new Date().toISOString().split('T')[0];
                  return (
                    <button
                      key={f}
                      onClick={() => { setSelectedDate(f); setStep('time'); }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'gradient-brand text-white shadow-lg'
                          : isToday
                            ? 'bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-400'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <p className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{diaNombre}</p>
                      <p className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{diaNum}</p>
                      <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{mesNombre}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'time' && selectedService && (
            <div className="p-8">
              <button onClick={() => setStep('date')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Selecciona una hora</h2>
              <p className="text-gray-500 mb-6">
                {selectedAsesor ? `Con ${selectedAsesor.nombre}` : 'Con el asesor disponible'} •{' '}
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              {slotsDisponibles.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
                  <button onClick={() => setStep('date')} className="mt-4 text-indigo-600 font-medium hover:underline">
                    Elegir otra fecha
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {slotsDisponibles.map(slot => (
                    <button
                      key={slot.hora}
                      onClick={() => { setSelectedTime(slot.hora); setStep('details'); }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedTime === slot.hora
                          ? 'gradient-brand text-white shadow-lg'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                      }`}
                    >
                      {slot.hora}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'details' && selectedService && (
            <div className="p-8">
              <button onClick={() => setStep('time')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tus datos</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input value={clientName} onChange={e => setClientName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Tu nombre" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="tu@email.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="300 123 4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                      <textarea value={clientNotes} onChange={e => setClientNotes(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={3} placeholder="Algo que debamos saber..." />
                    </div>
                    <button
                      onClick={handleConfirm}
                      disabled={!clientName || !clientEmail}
                      className="w-full py-3 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Confirmar reserva
                    </button>
                  </div>
                </div>
                {/* Summary */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: selectedService.color + '20' }}>
                        {selectedService.icono}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedService.nombre}</p>
                        <p className="text-sm text-gray-500">{selectedService.duracion_minutos} minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-700">{selectedAsesor?.nombre || 'Asesor asignado automáticamente'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-700">{selectedTime} ({selectedService.duracion_minutos} min)</p>
                    </div>
                    {selectedService.mostrar_precio && selectedService.precio > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-lg font-bold" style={{ color: selectedService.color }}>
                          ${selectedService.precio.toLocaleString('es-CO')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmed' && confirmedReserva && selectedService && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h2>
              <p className="text-gray-500 mb-8">Hemos enviado los detalles a tu email</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Servicio</span>
                  <span className="font-medium text-gray-900">{selectedService.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium text-gray-900">{confirmedReserva.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hora</span>
                  <span className="font-medium text-gray-900">{confirmedReserva.hora_cliente_inicio} - {confirmedReserva.hora_cliente_fin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Asesor</span>
                  <span className="font-medium text-gray-900">{asesores.find(a => a.id === confirmedReserva.asesor_id)?.nombre}</span>
                </div>
              </div>
              <button onClick={resetBooking} className="mt-8 px-6 py-3 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 shadow-md">
                Hacer otra reserva
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
