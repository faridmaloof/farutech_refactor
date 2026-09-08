import { Calendar, Clock, Users, Zap, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { setPagina } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-gradient">Kronix</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPagina('login')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setPagina('register')}
                className="px-4 py-2 text-sm font-semibold text-white gradient-brand rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Comenzar Gratis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>La plataforma de reservas más inteligente</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-gray-900 mb-6 leading-tight">
              Tu tiempo,{' '}
              <span className="text-gradient">organizado</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Kronix elimina la complejidad de las reservas. Gestiona servicios, asesores y horarios 
              con algoritmos inteligentes que maximizan tu tiempo y el de tus clientes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPagina('register')}
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white gradient-brand rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Crear tu calendario gratis
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPagina('public-booking')}
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Ver demo en vivo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Sin tarjeta de crédito • Configuración en 2 minutos</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Todo lo que necesitas para gestionar tus reservas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Herramientas profesionales diseñadas para optimizar cada minuto de tu jornada
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Snapping Inteligente"
              description="Los horarios se alinean automáticamente a intervalos configurables (15, 30, 60 min). Sin espacios perdidos."
              color="from-amber-400 to-orange-500"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Pooling Dinámico"
              description="Asignación automática al asesor con menor carga. Balanceo inteligente de trabajo en tiempo real."
              color="from-blue-400 to-indigo-500"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Buffers Asimétricos"
              description="Gestiona tiempos de preparación y limpieza por separado. El cliente solo ve el tiempo del servicio."
              color="from-emerald-400 to-teal-500"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Cómo funciona Kronix
            </h2>
            <p className="text-lg text-gray-600">
              En 3 simples pasos tendrás tu sistema de reservas funcionando
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Configura tus servicios"
              description="Define duración, precios y tiempos de preparación. Kronix se encarga del resto."
              icon="⚙️"
            />
            <StepCard
              step={2}
              title="Comparte tu enlace"
              description="Obtén una URL única como kronix.app/tu-negocio y compártela con tus clientes."
              icon="🔗"
            />
            <StepCard
              step={3}
              title="Recibe reservas"
              description="Tus clientes eligen servicio, asesor y horario. Tú solo confirmas y trabajas."
              icon="✅"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
            ¿Listo para optimizar tu tiempo?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de profesionales que ya usan Kronix para gestionar sus reservas
          </p>
          <button
            onClick={() => setPagina('register')}
            className="px-8 py-4 text-lg font-semibold text-white gradient-brand rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            Comenzar ahora — Es gratis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gradient">Kronix</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Kronix. Tu tiempo, organizado.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description, icon }: { step: number; title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 gradient-brand text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
