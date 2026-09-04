import { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Card } from '@farutech/design-system/src/components/ui/Card';
import { DataTable } from '@farutech/design-system/src/components/ui/DataTable';
import { Badge } from '@farutech/design-system/src/components/ui/Badge';
import { Button } from '@farutech/design-system/src/components/ui/Button';
import { EmptyState } from '@farutech/design-system/src/components/ui/EmptyState';
import { Loading } from '@farutech/design-system/src/components/ui/Loading';
import { Notification } from '@farutech/design-system/src/components/basic/Notification';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building,
  MapPin,
  TrendingUp,
  UserCheck,
  Clock
} from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  quality: number;
  source: string;
  location: string;
  created_at: string;
  last_interaction?: string;
}

interface LeadStats {
  total: number;
  new: number;
  qualified: number;
  converted: number;
  avg_quality: number;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  // Stats calculadas
  const stats: LeadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    avg_quality: leads.length > 0 
      ? Math.round(leads.reduce((sum, l) => sum + l.quality, 0) / leads.length) 
      : 0
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('auth_user');
        navigate('/admin/login', { replace: true });
        return;
      }
      
      if (!response.ok) {
        throw new Error('Error al cargar leads');
      }

      const data = await response.json();
      const mockLeads: Lead[] = Array.isArray(data) ? data : data.data ?? [];
      
      setLeads(mockLeads);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Error al cargar leads. Intente nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este lead?')) {
      setLeads(leads.filter(l => l.id !== id));
      setNotification({
        type: 'success',
        message: 'Lead eliminado correctamente'
      });
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    const config = {
      new: { color: 'blue', label: 'Nuevo', icon: Clock },
      contacted: { color: 'yellow', label: 'Contactado', icon: Phone },
      qualified: { color: 'purple', label: 'Calificado', icon: UserCheck },
      converted: { color: 'green', label: 'Convertido', icon: TrendingUp },
      lost: { color: 'red', label: 'Perdido', icon: Trash2 }
    };
    
    const { color, label, icon: Icon } = config[status];
    return (
      <Badge color={color as any} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      title: 'Nombre',
      render: (lead: Lead) => (
        <div>
          <div className="font-medium text-gray-900">{lead.name}</div>
          <div className="text-sm text-gray-500">{lead.position}</div>
        </div>
      )
    },
    {
      key: 'company',
      title: 'Empresa',
      render: (lead: Lead) => (
        <div>
          <div className="font-medium">{lead.company}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {lead.location}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contacto',
      render: (lead: Lead) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="w-3 h-3 mr-2 text-gray-400" />
            {lead.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            {lead.phone}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Estado',
      render: (lead: Lead) => getStatusBadge(lead.status)
    },
    {
      key: 'quality',
      title: 'Calidad',
      render: (lead: Lead) => (
        <div className={`font-semibold ${getQualityColor(lead.quality)}`}>
          {lead.quality}/100
        </div>
      )
    },
    {
      key: 'source',
      title: 'Fuente',
      render: (lead: Lead) => (
        <Badge color="gray" variant="outline" size="sm">
          {lead.source}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (lead: Lead) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" title="Ver detalle">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Editar">
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(lead.id)}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  const statsCards = [
    {
      title: 'Total Leads',
      value: stats.total.toString(),
      icon: Building,
      color: 'blue'
    },
    {
      title: 'Nuevos',
      value: stats.new.toString(),
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Calificados',
      value: stats.qualified.toString(),
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Convertidos',
      value: stats.converted.toString(),
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Calidad Promedio',
      value: `${stats.avg_quality}%`,
      icon: TrendingUp,
      color: stats.avg_quality >= 70 ? 'green' : 'yellow'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Leads</h1>
            <p className="text-gray-600 mt-1">Administra y da seguimiento a tus oportunidades</p>
          </div>
          <Button color="blue">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Lead
          </Button>
        </div>

        {/* Notificación */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="contacted">Contactados</option>
                <option value="qualified">Calificados</option>
                <option value="converted">Convertidos</option>
                <option value="lost">Perdidos</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tabla de Leads */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loading />
            </div>
          ) : filteredLeads.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No hay leads"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No se encontraron leads con los filtros aplicados'
                  : 'Comienza agregando tu primer lead'
              }
              action={
                !searchTerm && statusFilter === 'all' && (
                  <Button color="blue">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Lead
                  </Button>
                )
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredLeads}
              onRowSelect={(ids) => setSelectedLeads(ids)}
              emptyMessage="No hay leads para mostrar"
            />
          )}
        </Card>

        {/* Acciones masivas */}
        {selectedLeads.length > 0 && (
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedLeads.length} lead(s) seleccionado(s)
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Exportar
                </Button>
                <Button variant="outline" size="sm" color="red">
                  Eliminar seleccionados
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
