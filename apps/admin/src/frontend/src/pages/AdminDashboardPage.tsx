import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatsCard, StatsCardGroup } from '@farutech/design-system/components/ui';
import { DataTable } from '@farutech/design-system/components/ui';
import { Card, CardHeader } from '@farutech/design-system/components/ui';
import { EmptyState } from '@farutech/design-system/components/ui';
import { API_BASE_URL } from '../lib/api';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  activeProjects: number;
  conversionRate: number;
  recentLeads: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login', { replace: true });
          return;
        }
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        title="Error al cargar el dashboard"
        description={error}
        actionLabel="Reintentar"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Grid con StatsCard del Design System */}
      <StatsCardGroup>
        <StatsCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon="users"
          trend={{ value: stats?.newLeads || 0, label: 'nuevos este mes' }}
          color="blue"
        />
        <StatsCard
          title="Nuevos Leads"
          value={stats?.newLeads || 0}
          icon="user-plus"
          trend={{ value: '+15%', label: 'vs mes anterior' }}
          color="green"
        />
        <StatsCard
          title="Proyectos Activos"
          value={stats?.activeProjects || 0}
          icon="briefcase"
          trend={{ value: '85%', label: 'tasa de ocupación' }}
          color="purple"
        />
        <StatsCard
          title="Tasa de Conversión"
          value={`${stats?.conversionRate || 0}%`}
          icon="trending-up"
          trend={{ value: '+2.5%', label: 'mejora mensual' }}
          color="orange"
        />
      </StatsCardGroup>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Link to="/admin/leads" className="block">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestionar Leads</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Ver y administrar todos los leads del CRM
              </p>
            </Link>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Link to="/admin/blog" className="block">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blog</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gestionar publicaciones del blog
              </p>
            </Link>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Link to="/admin/settings" className="block">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Ajustes del sistema y notificaciones
              </p>
            </Link>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Leads Table con DataTable del Design System */}
      {stats?.recentLeads && stats.recentLeads.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leads Recientes</h3>
          </CardHeader>
          <DataTable
            columns={[
              { key: 'name', label: 'Nombre', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { 
                key: 'status', 
                label: 'Estado', 
                sortable: true,
                render: (value: string) => {
                  const colors: any = {
                    NEW: 'bg-green-100 text-green-800',
                    CONTACTED: 'bg-blue-100 text-blue-800',
                    QUALIFIED: 'bg-purple-100 text-purple-800',
                    CONVERTED: 'bg-yellow-100 text-yellow-800',
                  };
                  return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
                      {value}
                    </span>
                  );
                }
              },
              { 
                key: 'created_at', 
                label: 'Fecha', 
                sortable: true,
                render: (value: string) => new Date(value).toLocaleDateString()
              },
            ]}
            data={stats.recentLeads}
            pagination={{ pageSize: 5, showTotal: false }}
            searchable={false}
          />
        </Card>
      ) : (
        <EmptyState
          type="info"
          title="No hay leads recientes"
          description="Los leads nuevos aparecerán aquí"
          actionLabel="Crear lead manual"
          onAction={() => navigate('/admin/leads?action=create')}
        />
      )}
    </div>
  );
}
