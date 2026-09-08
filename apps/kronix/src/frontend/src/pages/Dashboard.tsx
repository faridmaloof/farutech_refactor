import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Servicio, Asesor } from '../types';
import {
  Calendar, Clock, Users, Settings, Plus, Trash2, Edit3, Link2, Copy,
  BarChart3, CheckCircle, XCircle, ExternalLink, LayoutDashboard,
  CreditCard, UserCheck, ChevronRight
} from 'lucide-react';

type Tab = 'overview' | 'servicios' | 'asesores' | 'reservas' | 'calendario' | 'config';

export default function Dashboard() {
  const { usuario, asesores, servicios, reservas, setPagina, logout,
    agregarServicio, eliminarServicio, actualizarServicio,
    agregarAsesor, eliminarAsesor, actualizarAsesor, cancelarReserva, completarReserva } = useApp();
  const [tab, setTab] = useState<Tab>('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAsesorModal, setShowAsesorModal] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);
  const [editingAsesor, setEditingAsesor] = useState<Asesor | null>(null);
  const [copied, setCopied] = useState(false);

  if (!usuario) return null;

  const publicUrl = `kronix.app/${usuario.slug}`;
  const reservasHoy = reservas.filter(r => r.fecha === getTodayStr() && r.estado !== 'cancelada');
  const ingresosHoy = reservasHoy.reduce((acc, r) => {
    const s = servicios.find(sv => sv.id === r.servicio_id);
    return acc + (s?.precio || 0);
  }, 0);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display text-gradient">Kronix</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Panel" active={tab === 'overview'} onClick={() => setTab('overview')} />
          <NavItem icon={<Calendar className="w-5 h-5" />} label="Servicios" active={tab === 'servicios'} onClick={() => setTab('servicios')} />
          <NavItem icon={<Users className="w-5 h-5" />} label="Asesores" active={tab === 'asesores'} onClick={() => setTab('asesores')} />
          <NavItem icon={<CheckCircle className="w-5 h-5" />} label="Reservas" active={tab === 'reservas'} onClick={() => setTab('reservas')} />
          <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Calendario" active={tab === 'calendario'} onClick={() => setTab('calendario')} />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Configuración" active={tab === 'config'} onClick={() => setTab('config')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-lg">
              {usuario.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{usuario.nombre}</p>
              <p className="text-xs text-gray-500 truncate">{usuario.negocio_nombre}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors py-2">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {tab === 'overview' && 'Panel de Control'}
              {tab === 'servicios' && 'Mis Servicios'}
              {tab === 'asesores' && 'Mis Asesores'}
              {tab === 'reservas' && 'Reservas'}
              {tab === 'calendario' && 'Calendario'}
              {tab === 'config' && 'Configuración'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg">
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-700 font-medium">{publicUrl}</span>
              <button onClick={handleCopyUrl} className="text-indigo-600 hover:text-indigo-800">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setPagina('public-booking')}
              className="flex items-center gap-2 px-4 py-2 gradient-brand text-white text-sm font-semibold rounded-lg hover:opacity-90"
            >
              <ExternalLink className="w-4 h-4" />
              Ver página pública
            </button>
          </div>
        </header>

        <main className="p-8">
          {tab === 'overview' && (
            <OverviewTab
              reservasHoy={reservasHoy.length}
              ingresosHoy={ingresosHoy}
              totalServicios={servicios.length}
              totalAsesores={asesores.filter(a => a.activo).length}
              reservas={reservas}
              servicios={servicios}
              asesores={asesores}
              publicUrl={publicUrl}
              onCopyUrl={handleCopyUrl}
              copied={copied}
            />
          )}
          {tab === 'servicios' && (
            <ServiciosTab
              servicios={servicios}
              asesores={asesores}
              onAdd={() => { setEditingService(null); setShowServiceModal(true); }}
              onEdit={(s: Servicio) => { setEditingService(s); setShowServiceModal(true); }}
              onDelete={eliminarServicio}
              onUpdate={actualizarServicio}
              showModal={showServiceModal}
              setShowModal={setShowServiceModal}
              editing={editingService}
              usuarioId={usuario.id}
            />
          )}
          {tab === 'asesores' && (
            <AsesoresTab
              asesores={asesores}
              servicios={servicios}
              onAdd={() => { setEditingAsesor(null); setShowAsesorModal(true); }}
              onEdit={(a: Asesor) => { setEditingAsesor(a); setShowAsesorModal(true); }}
              onDelete={eliminarAsesor}
              onUpdate={actualizarAsesor}
              showModal={showAsesorModal}
              setShowModal={setShowAsesorModal}
              editing={editingAsesor}
              usuarioId={usuario.id}
            />
          )}
          {tab === 'reservas' && (
            <ReservasTab reservas={reservas} servicios={servicios} asesores={asesores}
              onCancelar={cancelarReserva} onCompletar={completarReserva} />
          )}
          {tab === 'calendario' && <CalendarioTab reservas={reservas} servicios={servicios} asesores={asesores} />}
          {tab === 'config' && <ConfigTab usuario={usuario} />}
        </main>
      </div>

      {/* Modals */}
      {showServiceModal && (
        <ServiceModal
          servicio={editingService}
          asesores={asesores}
          onSave={(s: Servicio) => {
            if (editingService) actualizarServicio(s);
            else agregarServicio(s);
            setShowServiceModal(false);
          }}
          onClose={() => setShowServiceModal(false)}
          usuarioId={usuario.id}
        />
      )}
      {showAsesorModal && (
        <AsesorModal
          asesor={editingAsesor}
          onSave={(a: Asesor) => {
            if (editingAsesor) actualizarAsesor(a);
            else agregarAsesor(a);
            setShowAsesorModal(false);
          }}
          onClose={() => setShowAsesorModal(false)}
          usuarioId={usuario.id}
        />
      )}
    </div>
  );
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatCOP(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

// ============ NAV ITEM ============
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============ OVERVIEW TAB ============
function OverviewTab({ reservasHoy, ingresosHoy, totalServicios, totalAsesores, reservas, servicios, asesores, publicUrl, onCopyUrl, copied }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Reservas hoy" value={String(reservasHoy)} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<CreditCard className="w-5 h-5" />} label="Ingresos hoy" value={formatCOP(ingresosHoy)} color="bg-green-50 text-green-600" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Servicios" value={String(totalServicios)} color="bg-purple-50 text-purple-600" />
        <StatCard icon={<UserCheck className="w-5 h-5" />} label="Asesores activos" value={String(totalAsesores)} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Share URL */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-2">Comparte tu enlace de reservas</h2>
        <p className="text-indigo-100 mb-4">Tus clientes pueden agendar directamente desde este link</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 font-mono text-sm">
            {publicUrl}
          </div>
          <button onClick={onCopyUrl} className="px-4 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
            <Copy className="w-4 h-4" />
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Reservas de hoy</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {reservas.filter((r: any) => r.fecha === getTodayStr() && r.estado !== 'cancelada').length === 0 ? (
            <div className="p-8 text-center text-gray-400">No hay reservas para hoy</div>
          ) : (
            reservas.filter((r: any) => r.fecha === getTodayStr() && r.estado !== 'cancelada')
              .sort((a: any, b: any) => a.hora_cliente_inicio.localeCompare(b.hora_cliente_inicio))
              .map((r: any) => {
                const s = servicios.find((sv: any) => sv.id === r.servicio_id);
                const a = asesores.find((as: any) => as.id === r.asesor_id);
                return (
                  <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: (s?.color || '#4c6ef5') + '20' }}>
                      {s?.icono || '📋'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{r.cliente_nombre}</p>
                      <p className="text-sm text-gray-500">{s?.nombre} • con {a?.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{r.hora_cliente_inicio}</p>
                      <p className={`text-xs px-2 py-0.5 rounded-full ${
                        r.estado === 'confirmada' ? 'bg-green-50 text-green-700' :
                        r.estado === 'completada' ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {r.estado}
                      </p>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ============ SERVICIOS TAB ============
function ServiciosTab({ servicios, onAdd, onEdit, onDelete, showModal, setShowModal, editing, usuarioId, asesores }: any) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500">{servicios.length} servicios configurados</p>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 gradient-brand text-white rounded-xl font-semibold hover:opacity-90 shadow-md">
          <Plus className="w-4 h-4" /> Nuevo servicio
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicios.map((s: Servicio) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: s.color + '20' }}>
                {s.icono}
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(s)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{s.nombre}</h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.descripcion}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold" style={{ color: s.color }}>
                {s.precio > 0 ? formatCOP(s.precio) : 'Gratis'}
              </span>
              <span className="text-sm text-gray-500">{s.duracion_minutos} min</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
              <span>⏱ Pre: {s.buffer_antes_minutos}min</span>
              <span>⏱ Post: {s.buffer_despues_minutos}min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SERVICE MODAL ============
function ServiceModal({ servicio, onSave, onClose, usuarioId }: any) {
  const [form, setForm] = useState<Servicio>(servicio || {
    id: 'serv-' + Date.now(),
    usuario_id: usuarioId,
    nombre: '',
    descripcion: '',
    duracion_minutos: 60,
    buffer_antes_minutos: 10,
    buffer_despues_minutos: 10,
    precio: 0,
    moneda: 'COP',
    color: '#4c6ef5',
    icono: '📋',
    activo: true,
    mostrar_precio: true,
    mostrar_buffer_cliente: false,
  });

  const iconos = ['💆', '🏥', '💑', '🌿', '📋', '💅', '✂️', '🧖', '🎨', '🔧', '⚡', '📸', '🎵', '🧘', '💪'];
  const colores = ['#4c6ef5', '#7950f2', '#e64980', '#20c997', '#fd7e14', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{servicio ? 'Editar' : 'Nuevo'} Servicio</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
              <input type="number" value={form.duracion_minutos} onChange={e => setForm({ ...form, duracion_minutos: +e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer antes (min)</label>
              <input type="number" value={form.buffer_antes_minutos} onChange={e => setForm({ ...form, buffer_antes_minutos: +e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer después (min)</label>
              <input type="number" value={form.buffer_despues_minutos} onChange={e => setForm({ ...form, buffer_despues_minutos: +e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
            <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: +e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
            <div className="flex flex-wrap gap-2">
              {iconos.map(i => (
                <button key={i} onClick={() => setForm({ ...form, icono: i })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${form.icono === i ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {colores.map(c => (
                <button key={c} onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.mostrar_precio} onChange={e => setForm({ ...form, mostrar_precio: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600" />
              <span className="text-sm text-gray-700">Mostrar precio al cliente</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.mostrar_buffer_cliente} onChange={e => setForm({ ...form, mostrar_buffer_cliente: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600" />
              <span className="text-sm text-gray-700">Mostrar info de prep. al cliente</span>
            </label>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-6 py-2 gradient-brand text-white rounded-xl font-semibold hover:opacity-90">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ ASESORES TAB ============
function AsesoresTab({ asesores, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500">{asesores.filter((a: Asesor) => a.activo).length} asesores activos</p>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 gradient-brand text-white rounded-xl font-semibold hover:opacity-90 shadow-md">
          <Plus className="w-4 h-4" /> Nuevo asesor
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {asesores.map((a: Asesor) => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                  {a.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{a.nombre}</h3>
                  <p className="text-sm text-gray-500">{a.titulo}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(a)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(a.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{a.horario.hora_inicio} - {a.horario.hora_fin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{a.horario.dias_activos.length} días/semana</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${a.activo ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className={a.activo ? 'text-green-700' : 'text-gray-400'}>{a.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ASESOR MODAL ============
function AsesorModal({ asesor, onSave, onClose, usuarioId }: any) {
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const avatars = ['👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍⚕️', '👩‍⚕️', '👨‍🎨', '👩‍🎨'];

  const [form, setForm] = useState<Asesor>(asesor || {
    id: 'asesor-' + Date.now(),
    usuario_id: usuarioId,
    nombre: '',
    email: '',
    avatar: '👤',
    titulo: '',
    habilidades: [],
    horario: {
      dias_activos: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      hora_inicio: '09:00',
      hora_fin: '18:00',
      intervalo_minutos: 15,
    },
    activo: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{asesor ? 'Editar' : 'Nuevo'} Asesor</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título / Cargo</label>
            <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex gap-2">
              {avatars.map(a => (
                <button key={a} onClick={() => setForm({ ...form, avatar: a })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${form.avatar === a ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <input type="time" value={form.horario.hora_inicio}
                onChange={e => setForm({ ...form, horario: { ...form.horario, hora_inicio: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
              <input type="time" value={form.horario.hora_fin}
                onChange={e => setForm({ ...form, horario: { ...form.horario, hora_fin: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Días laborables</label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map(d => (
                <button key={d} onClick={() => {
                  const dias = form.horario.dias_activos.includes(d)
                    ? form.horario.dias_activos.filter(x => x !== d)
                    : [...form.horario.dias_activos, d];
                  setForm({ ...form, horario: { ...form.horario, dias_activos: dias } });
                }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    form.horario.dias_activos.includes(d)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600" />
            <span className="text-sm text-gray-700">Asesor activo</span>
          </label>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-6 py-2 gradient-brand text-white rounded-xl font-semibold hover:opacity-90">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ RESERVAS TAB ============
function ReservasTab({ reservas, servicios, asesores, onCancelar, onCompletar }: any) {
  const [filtro, setFiltro] = useState<'todas' | 'hoy' | 'semana'>('hoy');
  
  const filtered = reservas.filter((r: any) => {
    if (filtro === 'hoy') return r.fecha === getTodayStr();
    if (filtro === 'semana') {
      const hoy = new Date();
      const hace7 = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
      return new Date(r.fecha) >= hace7;
    }
    return true;
  }).sort((a: any, b: any) => {
    if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
    return a.hora_cliente_inicio.localeCompare(b.hora_cliente_inicio);
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        {(['hoy', 'semana', 'todas'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filtro === f ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}>
            {f === 'hoy' ? 'Hoy' : f === 'semana' ? 'Esta semana' : 'Todas'}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Servicio</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Asesor</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha/Hora</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r: any) => {
              const s = servicios.find((sv: any) => sv.id === r.servicio_id);
              const a = asesores.find((as: any) => as.id === r.asesor_id);
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.cliente_nombre}</p>
                    <p className="text-xs text-gray-500">{r.cliente_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{s?.icono}</span>
                      <span className="text-sm text-gray-700">{s?.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{a?.nombre}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{r.fecha}</p>
                    <p className="text-xs text-gray-500">{r.hora_cliente_inicio} - {r.hora_cliente_fin}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.estado === 'confirmada' ? 'bg-green-50 text-green-700' :
                      r.estado === 'completada' ? 'bg-blue-50 text-blue-700' :
                      r.estado === 'cancelada' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>{r.estado}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.estado === 'confirmada' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onCompletar(r.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Completar">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancelar(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Cancelar">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No hay reservas en este período</div>
        )}
      </div>
    </div>
  );
}

// ============ CALENDARIO TAB (Gantt) ============
function CalendarioTab({ reservas, servicios, asesores }: any) {
  const [fecha, setFecha] = useState(getTodayStr());
  const horas = Array.from({ length: 13 }, (_, i) => i + 7); // 7am a 7pm

  const reservasFecha = reservas.filter((r: any) => r.fecha === fecha && r.estado !== 'cancelada');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => {
            const d = new Date(fecha);
            d.setDate(d.getDate() - 1);
            setFecha(d.toISOString().split('T')[0]);
          }} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">←</button>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl" />
          <button onClick={() => {
            const d = new Date(fecha);
            d.setDate(d.getDate() + 1);
            setFecha(d.toISOString().split('T')[0]);
          }} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">→</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="flex border-b border-gray-100 bg-gray-50">
              <div className="w-40 p-3 font-semibold text-sm text-gray-700 border-r border-gray-100">Asesor</div>
              <div className="flex-1 flex">
                {horas.map(h => (
                  <div key={h} className="flex-1 text-center text-xs text-gray-500 py-3 border-r border-gray-50">
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {asesores.filter((a: Asesor) => a.activo).map((asesor: Asesor) => {
              const reservasAsesor = reservasFecha.filter((r: any) => r.asesor_id === asesor.id);
              return (
                <div key={asesor.id} className="flex border-b border-gray-50 hover:bg-gray-50/50">
                  <div className="w-40 p-3 border-r border-gray-100 flex items-center gap-2">
                    <span className="text-lg">{asesor.avatar}</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{asesor.nombre}</span>
                  </div>
                  <div className="flex-1 relative h-16">
                    {/* Hour grid */}
                    {horas.map(h => (
                      <div key={h} className="absolute top-0 bottom-0 border-r border-gray-50"
                        style={{ left: `${((h - 7) / 13) * 100}%`, width: `${100 / 13}%` }} />
                    ))}
                    {/* Reservations */}
                    {reservasAsesor.map((r: any) => {
                      const s = servicios.find((sv: any) => sv.id === r.servicio_id);
                      const [hIni, mIni] = r.hora_inicio.split(':').map(Number);
                      const [hFin, mFin] = r.hora_fin.split(':').map(Number);
                      const iniMin = hIni * 60 + mIni;
                      const finMin = hFin * 60 + mFin;
                      const jornadaIni = 7 * 60;
                      const jornadaFin = 20 * 60;
                      const left = ((iniMin - jornadaIni) / (jornadaFin - jornadaIni)) * 100;
                      const width = ((finMin - iniMin) / (jornadaFin - jornadaIni)) * 100;
                      const bufferIniPct = (s?.buffer_antes_minutos / (finMin - iniMin)) * 100;
                      const bufferFinPct = (s?.buffer_despues_minutos / (finMin - iniMin)) * 100;
                      const corePct = 100 - bufferIniPct - bufferFinPct;

                      return (
                        <div key={r.id} className="absolute top-2 bottom-2 rounded-lg overflow-hidden flex cursor-pointer group"
                          style={{ left: `${left}%`, width: `${width}%`, minWidth: '40px' }}
                          title={`${r.cliente_nombre} - ${s?.nombre}`}>
                          {/* Buffer antes */}
                          <div className="h-full opacity-40" style={{ width: `${bufferIniPct}%`, backgroundColor: s?.color || '#4c6ef5' }} />
                          {/* Core */}
                          <div className="h-full flex items-center px-1 overflow-hidden" style={{ width: `${corePct}%`, backgroundColor: s?.color || '#4c6ef5' }}>
                            <span className="text-white text-xs font-medium truncate">{r.cliente_nombre}</span>
                          </div>
                          {/* Buffer después */}
                          <div className="h-full opacity-40" style={{ width: `${bufferFinPct}%`, backgroundColor: s?.color || '#4c6ef5' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-500 opacity-40"></div>
          <span>Buffer (preparación/limpieza)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-500"></div>
          <span>Servicio (tiempo core)</span>
        </div>
      </div>
    </div>
  );
}

// ============ CONFIG TAB ============
function ConfigTab({ usuario }: any) {
  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Información del negocio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
              <input defaultValue={usuario.negocio_nombre} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea defaultValue={usuario.negocio_descripcion} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL pública</label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
                <span className="text-gray-400 text-sm">kronix.app/</span>
                <span className="ml-1 font-medium text-gray-900">{usuario.slug}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Plan actual</h3>
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
            <div className="w-10 h-10 gradient-brand rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-indigo-900 capitalize">{usuario.plan}</p>
              <p className="text-sm text-indigo-600">Hasta 3 asesores y servicios ilimitados</p>
            </div>
          </div>
        </div>
        <button className="w-full py-3 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 shadow-md">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
