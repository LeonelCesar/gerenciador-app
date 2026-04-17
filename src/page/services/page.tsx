// src/pages/Services.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

// ---------- Tipos ----------
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // ex: "Mensal", "Anual", "Trimestral"
  status: 'active' | 'inactive';
  createdAt: string;
}

// Opções de duração
const DURATIONS = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];

// ---------- Dados Mockados ----------
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Plano Básico',
    description: 'Acesso a funcionalidades essenciais para pequenas empresas.',
    price: 49.90,
    duration: 'Mensal',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Plano Pro',
    description: 'Recursos avançados, relatórios e suporte prioritário.',
    price: 99.90,
    duration: 'Mensal',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Plano Enterprise',
    description: 'Solução completa com API dedicada e gerente de conta.',
    price: 299.90,
    duration: 'Mensal',
    status: 'active',
    createdAt: '2024-02-15',
  },
  {
    id: '4',
    name: 'Suporte Avançado',
    description: 'Suporte 24/7 com SLA de 1 hora.',
    price: 199.90,
    duration: 'Anual',
    status: 'inactive',
    createdAt: '2024-03-01',
  },
  {
    id: '5',
    name: 'Consultoria Personalizada',
    description: 'Sessões de consultoria para otimização de processos.',
    price: 499.90,
    duration: 'Trimestral',
    status: 'active',
    createdAt: '2024-03-20',
  },
];

// ---------- API Simulada ----------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchServices = async (): Promise<Service[]> => {
  await delay(600);
  return [...mockServices];
};

const createService = async (data: Omit<Service, 'id'>): Promise<Service> => {
  await delay(700);
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
  };
};

const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  await delay(500);
  return { id, ...data } as Service;
};

const deleteService = async (id: string): Promise<void> => {
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
  serviceName: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, serviceName, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja excluir o serviço <strong>{serviceName}</strong>? Esta ação não pode ser desfeita.
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

// ---------- Card de Serviço ----------
interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string, name: string) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-PT');

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(service)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(service.id, service.name)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
            <DollarSign className="h-4 w-4 text-green-600" />
            {formatCurrency(service.price)}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            {service.duration}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
          service.status === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {service.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {service.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">Criado em {formatDate(service.createdAt)}</div>
    </div>
  );
};

// ---------- Componente Principal Services ----------
export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Formulário
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    duration: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    description: '',
    price: 0,
    duration: DURATIONS[0],
    status: 'active',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar serviços
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Métricas rápidas
  const metrics = useMemo(() => {
    const total = services.length;
    const active = services.filter(s => s.status === 'active').length;
    const totalMonthlyRevenue = services
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        let multiplier = 1;
        if (s.duration === 'Trimestral') multiplier = 1/3;
        if (s.duration === 'Semestral') multiplier = 1/6;
        if (s.duration === 'Anual') multiplier = 1/12;
        return sum + (s.price * multiplier);
      }, 0);
    return { total, active, totalMonthlyRevenue };
  }, [services]);

  // Handlers CRUD
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) return;
    setFormLoading(true);
    try {
      const newService = await createService({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0],
      });
      setServices(prev => [newService, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', price: 0, duration: DURATIONS[0], status: 'active' });
      setToastMessage({ type: 'success', text: 'Serviço adicionado com sucesso!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao adicionar serviço' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !formData.name.trim()) return;
    setFormLoading(true);
    try {
      const updated = await updateService(selectedService.id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        status: formData.status,
      });
      setServices(prev => prev.map(s => (s.id === selectedService.id ? { ...s, ...updated } : s)));
      setIsEditModalOpen(false);
      setSelectedService(null);
      setToastMessage({ type: 'success', text: 'Serviço atualizado!' });
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
      await deleteService(deleteTarget.id);
      setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
      setToastMessage({ type: 'success', text: 'Serviço removido!' });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao excluir' });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      status: service.status,
    });
    setIsEditModalOpen(true);
  };

  // Filtros
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (durationFilter !== 'all' && s.duration !== durationFilter) return false;
      return true;
    });
  }, [services, searchTerm, statusFilter, durationFilter]);

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
          <button onClick={loadServices} className="mt-3 rounded bg-red-100 px-4 py-2 text-sm">Tentar novamente</button>
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Serviços</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Gerencie os serviços e planos oferecidos</p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', description: '', price: 0, duration: DURATIONS[0], status: 'active' });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Novo Serviço
          </button>
        </div>

        {/* Cards de métricas rápidas */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">Total de Serviços</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.total}</p></div>
              <Package className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">Serviços Ativos</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.active}</p></div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">Receita Mensal Potencial</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(metrics.totalMonthlyRevenue)}</p></div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-70" />
            </div>
          </div>
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
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
            <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="all">Todas as durações</option>
              {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Lista de serviços */}
        {filteredServices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Nenhum serviço encontrado</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || durationFilter !== 'all' ? 'Tente outros filtros' : 'Adicione o primeiro serviço'}
            </p>
            {!searchTerm && statusFilter === 'all' && durationFilter === 'all' && (
              <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" /> Novo Serviço
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} onEdit={openEditModal} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de criação */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Novo Serviço">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-sm font-medium">Nome do serviço *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Descrição</label><textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Preço (€) *</label><input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Duração</label><select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800">{DURATIONS.map(d => <option key={d}>{d}</option>)}</select></div>
          <div><label className="block text-sm font-medium">Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800"><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={formLoading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />} Criar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de edição */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Serviço">
        <form onSubmit={handleEdit} className="space-y-4">
          <div><label className="block text-sm font-medium">Nome do serviço *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Descrição</label><textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Preço (€) *</label><input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800" /></div>
          <div><label className="block text-sm font-medium">Duração</label><select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800">{DURATIONS.map(d => <option key={d}>{d}</option>)}</select></div>
          <div><label className="block text-sm font-medium">Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-800"><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={formLoading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de exclusão */}
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} serviceName={deleteTarget?.name || ''} isLoading={deleteLoading} />
    </div>
  );
}
