import { useState, useEffect } from 'react';
import { TopNav, MainLayout } from '@farutech/design-system';
import { Card } from '@farutech/design-system/components/ui';

interface Campaign {
  id: number;
  title: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_for: string | null;
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

export default function NewslettersPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetchCampaigns();
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    }
  }, [activeTab]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleSendCampaign = async (id: number) => {
    if (!confirm('¿Estás seguro de enviar esta campaña ahora?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        alert('Campaña encolada para envío');
        fetchCampaigns();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Error al enviar la campaña');
    }
  };

  const handleUnsubscribe = async (id: number) => {
    if (!confirm('¿Dar de baja a este suscriptor?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error reactivating:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona campañas de email marketing y suscriptores
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campañas
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suscriptores ({subscribers.length})
            </button>
          </nav>
        </div>

        {/* Campañas Tab */}
        {activeTab === 'campaigns' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Campañas</h2>
              <button
                onClick={() => {
                  setEditingCampaign(null);
                  setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Nueva Campaña
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{campaign.title}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    {campaign.scheduled_for && (
                      <p>Programada: {new Date(campaign.scheduled_for).toLocaleDateString()}</p>
                    )}
                    {campaign.sent_at && (
                      <p>Enviada: {new Date(campaign.sent_at).toLocaleDateString()}</p>
                    )}
                    <p>Destinatarios: {campaign.recipients_count}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCampaign(campaign);
                        setShowModal(true);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200"
                    >
                      Editar
                    </button>
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        className="flex-1 bg-primary text-white px-3 py-1.5 rounded text-sm hover:bg-primary-dark"
                      >
                        Enviar
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {campaigns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay campañas creadas aún</p>
              </div>
            )}
          </div>
        )}

        {/* Suscriptores Tab */}
        {activeTab === 'subscribers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Suscriptores</h2>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subscriber.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {subscriber.is_active ? (
                          <button
                            onClick={() => handleUnsubscribe(subscriber.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Dar de baja
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(subscriber.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {subscribers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay suscriptores registrados</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar campaña */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Implementar lógica de guardado
              setShowModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    required
                    defaultValue={editingCampaign?.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Asunto del email</label>
                  <input
                    type="text"
                    required
                    defaultValue={editingCampaign?.subject}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenido HTML</label>
                  <textarea
                    rows={8}
                    required
                    defaultValue={editingCampaign?.content_html}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="<html>...</html>"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Puedes usar un editor WYSIWYG como TinyMCE aquí
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
