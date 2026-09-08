import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '@farutech/design-system/components/navigation'
import { Card } from '@farutech/design-system/components/ui'
import { Button } from '@farutech/design-system/components/ui'
import { Badge } from '@farutech/design-system/components/ui'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  status: 'new' | 'read' | 'archived'
  admin_note: string | null
  created_at: string
}

interface MessagesResponse {
  success: boolean
  data: ContactMessage[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    unread_count: number
  }
}

export function ContactMessagesPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<{
    current_page: number
    last_page: number
    per_page: number
    total: number
    unread_count: number
  } | null>(null)
  const [noteText, setNoteText] = useState('')

  const fetchMessages = async (page = 1, status = '') => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '15',
        ...(status && { status }),
      })

      const response = await fetch(`/api/admin/contacts?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) throw new Error('Error al cargar mensajes')

      const result: MessagesResponse = await response.json()
      setMessages(result.data)
      setMeta(result.meta)
      setCurrentPage(result.meta.current_page)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages(currentPage, statusFilter)
  }, [currentPage, statusFilter])

  const handleStatusChange = async (id: number, action: 'read' | 'archive') => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/contacts/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        fetchMessages(currentPage, statusFilter)
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleUpdateNote = async () => {
    if (!selectedMessage) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/contacts/${selectedMessage.id}/note`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ note: noteText || null }),
      })

      if (response.ok) {
        fetchMessages(currentPage, statusFilter)
        setSelectedMessage({ ...selectedMessage, admin_note: noteText })
        setNoteText('')
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800'
      case 'read':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nuevo'
      case 'read':
        return 'Leído'
      case 'archived':
        return 'Archivado'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        currentPageName="Mensajes de Contacto"
        onMenuToggle={() => {}}
        userMenuConfig={{
          userName: 'Admin',
          userAvatarUrl: undefined,
        }}
        breadcrumbs={[{ label: 'Inicio', href: '/dashboard' }]}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header con filtros */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Mensajes de Contacto
              {meta?.unread_count !== undefined && meta.unread_count > 0 && (
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {meta.unread_count} nuevos
                </span>
              )}
            </h1>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="read">Leídos</option>
              <option value="archived">Archivados</option>
            </select>
          </div>

          {/* Tabla de mensajes */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando mensajes...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay mensajes de contacto registrados
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mensaje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messages.map((msg) => (
                        <tr
                          key={msg.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedMessage(msg)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {msg.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {msg.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {msg.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                msg.status
                              )}`}
                            >
                              {getStatusLabel(msg.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMessage(msg)
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {meta && meta.last_page > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Mostrando {meta.total > 0 ? (currentPage - 1) * meta.per_page + 1 : 0} a{' '}
                      {Math.min(currentPage * meta.per_page, meta.total)} de {meta.total} mensajes
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={currentPage === meta.last_page}
                        onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </main>

      {/* Modal de detalle */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detalle del Mensaje</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre</label>
                  <p className="mt-1 text-gray-900">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{selectedMessage.email}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-gray-900">{selectedMessage.phone}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500">Mensaje</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        selectedMessage.status
                      )}`}
                    >
                      {getStatusLabel(selectedMessage.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Nota interna */}
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nota Interna (opcional)
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Agrega una nota interna sobre este mensaje..."
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button onClick={handleUpdateNote} className="mt-2" size="sm">
                    Guardar Nota
                  </Button>
                </div>

                {selectedMessage.admin_note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Nota Interna Actual
                    </label>
                    <p className="mt-1 text-gray-900 bg-yellow-50 p-3 rounded-md">
                      {selectedMessage.admin_note}
                    </p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <div className="space-x-2">
                  {selectedMessage.status === 'new' && (
                    <Button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      variant="primary"
                    >
                      Marcar como Leído
                    </Button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <Button
                      onClick={() => handleStatusChange(selectedMessage.id, 'archive')}
                      variant="secondary"
                    >
                      Archivar
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                  variant="primary"
                >
                  Responder por Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
