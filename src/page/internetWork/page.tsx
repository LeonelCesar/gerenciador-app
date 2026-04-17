// src/pages/Integrations.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Puzzle,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Shield,
  Database,
  Mail as MailIcon,
  MessageSquare,
  Calendar,
  Globe,
  Webhook,
  Key,
} from 'lucide-react';

// ---------- Tipos ----------
interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'email' | 'payment' | 'webhook' | 'analytics' | 'other';
  status: 'active' | 'inactive';
  apiKey?: string;
  webhookUrl?: string;
  lastSyncAt?: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'crm', label: 'CRM', icon: Database },
  { value: 'email', label: 'E-mail', icon: MailIcon },
  { value: 'payment', label: 'Pagamentos', icon: Zap },
  { value: 'webhook', label: 'Webhook', icon: Webhook },
  { value: 'analytics', label: 'Analytics', icon: Globe },
  { value: 'other', label: 'Outros', icon: Puzzle },
];

// ---------- Dados Mockados ----------
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'HubSpot CRM',
    description: 'Sincroniza clientes e negociações com o HubSpot.',
    category: 'crm',
    status: 'active',
    apiKey: 'hs_••••••••••',
    lastSyncAt: '2025-04-10T14:30:00Z',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mailchimp',
    description: 'Envia newsletters e campanhas para seus clientes.',
    category: 'email',
    status: 'active',
    apiKey: 'mc_••••••••••',
    lastSyncAt: '2025-04-11T09:15:00Z',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Stripe',
    description: 'Processa pagamentos e assinaturas.',
    category: 'payment',
    status: 'active',
    apiKey: 'sk_••••••••••',
    lastSyncAt: '2025-04-11T16:45:00Z',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Zapier',
    description: 'Automatize tarefas entre apps.',
    category: 'webhook',
    status: 'inactive',
    webhookUrl: 'https://hooks.zapier.com/...',
    lastSyncAt: '2025-03-01T10:00:00Z',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'Google Analytics',
    description: 'Monitora tráfego e conversões.',
    category: 'analytics',
    status: 'active',
    apiKey: 'ga_••••••••••',
    lastSyncAt: '2025-04-11T23:00:00Z',
    createdAt: '2024-05-12',
  },
  {
    id: '6',
    name: 'Slack',
    description: 'Receba notificações de faturas e clientes.',
    category: 'other',
    status: 'active',
    webhookUrl: 'https://hooks.slack.com/...',
    lastSyncAt: '2025-04-10T08:00:00Z',
    createdAt: '2024-06-01',
  },
];

// ---------- API Simulada ----------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchIntegrations = async (): Promise<Integration[]> => {
  await delay(600);
  return [...mockIntegrations];
};

const createIntegration = async (data: Omit<Integration, 'id'>): Promise<Integration> => {
  await delay(700);
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
  };
};

const updateIntegration = async (id: string, data: Partial<Integration>): Promise<Integration> => {
  await delay(500);
  return { id, ...data } as Integration;
};

const deleteIntegration = async (id: string): Promise<void> => {
  await delay(400);
};

// ---------- Componente Modal Base ----------
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---------- Modal de Confirmação de Exclusão ----------
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  integrationName: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, integrationName, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja remover a integração <strong>{integrationName}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Card de Integração ----------
interface IntegrationCardProps {
  integration: Integration;
  onEdit: (integration: Integration) => void;
  onDelete: (id: string, name: string) => void;
}

const IntegrationCard = ({ integration, onEdit, onDelete }: IntegrationCardProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Nunca';
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const CategoryIcon = CATEGORIES.find(c => c.value === integration.category)?.icon || Puzzle;

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{integration.description}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(integration)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(integration.id, integration.name)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {integration.apiKey && (
            <span className="flex items-center gap-1"><Key className="h-3 w-3" /> {integration.apiKey}</span>
          )}
          {integration.webhookUrl && (
            <span className="flex items-center gap-1"><Webhook className="h-3 w-3" /> Webhook</span>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
          integration.status === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {integration.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {integration.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      {integration.lastSyncAt && (
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">Última sincronização: {formatDate(integration.lastSyncAt)}</div>
      )}
      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">Criado em {formatDate(integration.createdAt)}</div>
    </div>
  );
};

// ---------- Componente Principal Integrations ----------
export default function InternetWork() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Formulário
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: 'crm' | 'email' | 'payment' | 'webhook' | 'analytics' | 'other';
    status: 'active' | 'inactive';
    apiKey: string;
    webhookUrl: string;
  }>({
    name: '',
    description: '',
    category: 'crm',
    status: 'active',
    apiKey: '',
    webhookUrl: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar integrações
  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await fetchIntegrations();
      setIntegrations(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Métricas rápidas
  const metrics = useMemo(() => {
    const total = integrations.length;
    const active = integrations.filter(i => i.status === 'active').length;
    const byCategory = CATEGORIES.map(cat => ({
      label: cat.label,
      count: integrations.filter(i => i.category === cat.value).length,
      icon: cat.icon,
    }));
    return { total, active, byCategory };
  }, [integrations]);

  // Handlers CRUD
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setFormLoading(true);
    try {
      const newIntegration = await createIntegration({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        apiKey: formData.apiKey || undefined,
        webhookUrl: formData.webhookUrl || undefined,
        createdAt: new Date().toISOString().split('T')[0],
        lastSyncAt: undefined,
      });
      setIntegrations(prev => [newIntegration, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', category: 'crm', status: 'active', apiKey: '', webhookUrl: '' });
      setToastMessage({ type: 'success', text: 'Integração adicionada com sucesso!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao adicionar integração' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegration || !formData.name.trim()) return;
    setFormLoading(true);
    try {
      const updated = await updateIntegration(selectedIntegration.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        apiKey: formData.apiKey || undefined,
        webhookUrl: formData.webhookUrl || undefined,
        lastSyncAt: new Date().toISOString(),
      });
      setIntegrations(prev => prev.map(i => (i.id === selectedIntegration.id ? { ...i, ...updated } : i)));
      setIsEditModalOpen(false);
      setSelectedIntegration(null);
      setToastMessage({ type: 'success', text: 'Integração atualizada!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao atualizar' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteIntegration(deleteTarget.id);
      setIntegrations(prev => prev.filter(i => i.id !== deleteTarget.id));
      setToastMessage({ type: 'success', text: 'Integração removida!' });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao excluir' });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const openEditModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormData({
      name: integration.name,
      description: integration.description,
      category: integration.category,
      status: integration.status,
      apiKey: integration.apiKey || '',
      webhookUrl: integration.webhookUrl || '',
    });
    setIsEditModalOpen(true);
  };

  // Filtros
  const filteredIntegrations = useMemo(() => {
    return integrations.filter(i => {
      if (searchTerm && !i.name.toLowerCase().includes(searchTerm.toLowerCase()) && !i.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      return true;
    });
  }, [integrations, searchTerm, categoryFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button onClick={loadIntegrations} className="mt-3 rounded bg-red-100 px-4 py-2 text-sm">Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {toastMessage.text}
          </div>
        )}

        {/* Cabeçalho e métricas */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trabalho na Internet</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Conecte seu SaaS com serviços externos</p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', description: '', category: 'crm', status: 'active', apiKey: '', webhookUrl: '' });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nova Integração
          </button>
        </div>

        {/* Cards de métricas rápidas */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">Total</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.total}</p></div>
              <Puzzle className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">Ativas</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.active}</p></div>
              <Zap className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </div>
          {metrics.byCategory.slice(0, 2).map(cat => (
            <div key={cat.label} className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600 dark:text-gray-400">{cat.label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{cat.count}</p></div>
                <cat.icon className="h-8 w-8 text-purple-500 opacity-70" />
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="all">Todas as categorias</option>
              {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="all">Todos os status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
          </div>
        </div>

        {/* Lista de integrações */}
        {filteredIntegrations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Puzzle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Nenhuma integração encontrada</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? 'Tente outros filtros' : 'Adicione a primeira integração'}
            </p>
            {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
              <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" /> Nova Integração
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} onEdit={openEditModal} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de criação */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Integração">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-sm font-medium">Nome *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Descrição</label><textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Categoria</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800">{CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}</select></div>
          <div><label className="block text-sm font-medium">API Key (opcional)</label><input type="text" value={formData.apiKey} onChange={e => setFormData({ ...formData, apiKey: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" placeholder="sk_..." /></div>
          <div><label className="block text-sm font-medium">Webhook URL (opcional)</label><input type="url" value={formData.webhookUrl} onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" placeholder="https://..." /></div>
          <div><label className="block text-sm font-medium">Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800"><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={formLoading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />} Criar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de edição */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Integração">
        <form onSubmit={handleEdit} className="space-y-4">
          <div><label className="block text-sm font-medium">Nome *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Descrição</label><textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Categoria</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800">{CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}</select></div>
          <div><label className="block text-sm font-medium">API Key</label><input type="text" value={formData.apiKey} onChange={e => setFormData({ ...formData, apiKey: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Webhook URL</label><input type="url" value={formData.webhookUrl} onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800"><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={formLoading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de exclusão */}
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} integrationName={deleteTarget?.name || ''} isLoading={deleteLoading} />
    </div>
  );
}
