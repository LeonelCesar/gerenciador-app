// src/pages/FolderIndex.tsx
import { useState, useEffect } from 'react';
import {
  FolderPlus,
  Search,
  ArrowUpDown,
  Trash2,
  Edit,
  FolderOpen,
  X,
  Loader2,
  ChevronRight,
  Home,
  Eye,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Mail,
  Phone,
} from 'lucide-react';

//  Tipos 
interface Folder {
  id: string;
  name: string;
  description: string;
  invoiceCount: number;
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalInvoices: number;
  totalPaid: number;
}

type SortField = 'name' | 'createdAt' | 'invoiceCount';
type SortOrder = 'asc' | 'desc';

// Dados mockados para faturas e clientes por pasta 

const mockInvoicesByFolder: Record<string, Invoice[]> = {
  '1': [
    { id: 'FT_1', number: 'FAT-2025-001', customerName: 'Sonangol Angola', amount: 1250.00, status: 'paid', dueDate: '2025-02-15' },
    { id: 'FT_2', number: 'FAT-2025-002', customerName: 'Odebrestch Brasil', amount: 890.50, status: 'pending', dueDate: '2025-03-20' },
    { id: 'FT_3', number: 'FAT-2025-003', customerName: 'Endiaama Alemanha', amount: 2340.00, status: 'paid', dueDate: '2025-03-10' },
    { id: 'FT_4', number: 'FAT-2025-004', customerName: 'Prado Restaurante', amount: 560.75, status: 'overdue', dueDate: '2025-02-28' },
  ],
  '2': [
    { id: 'FT_5', number: 'FAT-2025-005', customerName: 'Primafrio Múrcia', amount: 5000.00, status: 'paid', dueDate: '2025-01-10' },
    { id: 'FT_6', number: 'FAT-2025-006', customerName: 'MEO Comunicações', amount: 3200.00, status: 'paid', dueDate: '2025-02-05' },
  ],
  '3': [
    { id: 'FT_7', number: 'FAT-2025-007', customerName: 'LS-Car Control', amount: 450.00, status: 'pending', dueDate: '2025-04-01' },
    { id: 'FT_8', number: 'FAT-2025-008', customerName: 'Tecnologias S.A', amount: 1200.00, status: 'overdue', dueDate: '2025-03-15' },
  ],
  '4': [
    { id: 'FT_9', number: 'REC-2024-001', customerName: 'Transpotes Edigar', amount: 300.00, status: 'paid', dueDate: '2024-12-20' },
    { id: 'FT_10', number: 'REC-2024-002', customerName: 'Abreu Logisticas', amount: 450.00, status: 'pending', dueDate: '2024-12-25' },
  ],
};

const mockCustomersByFolder: Record<string, Customer[]> = {
  '1': [
    { id: 'cust1', name: 'Sonangol Angola', email: 'contato@sonangol.com', phone: '(11) 99999-1111', totalInvoices: 2, totalPaid: 1250.00 },
    { id: 'cust2', name: 'Odebrestch Brasil', email: 'financeiro@debrestch.com', phone: '(11) 98888-2222', totalInvoices: 1, totalPaid: 0 },
    { id: 'cust3', name: 'Endiaama Alemanha', email: 'faturaalemanha@g.com', phone: '(21) 97777-3333', totalInvoices: 1, totalPaid: 2340.00 },
  ],
  '2': [
    { id: 'cust4', name: 'Primafrio Múrcia', email: 'contato@primafrio.com', phone: '(31) 96666-4444', totalInvoices: 1, totalPaid: 5000.00 },
    { id: 'cust5', name: 'LS-Car Control', email: 'financeiro@lscarcontrol.com', phone: '(41) 95555-5555', totalInvoices: 1, totalPaid: 3200.00 },
  ],
  '3': [
    { id: 'cust6', name: 'Transpotes Edigar', email: 'contato@edigar.com', phone: '(51) 94444-6666', totalInvoices: 1, totalPaid: 0 },
    { id: 'cust7', name: 'Inovações S.A Lda', email: 'financeiro@inovacoes.com', phone: '(61) 93333-7777', totalInvoices: 1, totalPaid: 0 },
  ],
  '4': [
    { id: 'cust8', name: 'MEO Comunicações', email: 'antiga@meocomunicacao.com', phone: '(71) 92222-8888', totalInvoices: 2, totalPaid: 750.00 },
  ],
};

// API simulada

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Faturas de 2025',
    description: 'Todas as faturas do primeiro trimestre de 2025',
    invoiceCount: 4,
    customerCount: 3,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-03-31T14:30:00Z',
  },
  {
    id: '2',
    name: 'Clientes VIP',
    description: 'Clientes com contrato anual',
    invoiceCount: 2,
    customerCount: 2,
    createdAt: '2025-01-15T09:20:00Z',
    updatedAt: '2025-04-01T11:15:00Z',
  },
  {
    id: '3',
    name: 'Pagamentos Pendentes',
    description: 'Faturas vencidas ou a vencer',
    invoiceCount: 2,
    customerCount: 2,
    createdAt: '2025-02-10T08:45:00Z',
    updatedAt: '2025-04-05T16:20:00Z',
  },
  {
    id: '4',
    name: 'Recibos 2024',
    description: 'Recibos emitidos no ano passado',
    invoiceCount: 2,
    customerCount: 1,
    createdAt: '2024-12-01T12:00:00Z',
    updatedAt: '2024-12-31T23:59:00Z',
  },
];

const fetchFolders = async (): Promise<Folder[]> => {
  await delay(800);
  return [...mockFolders];
};

const createFolderAPI = async (data: { name: string; description: string }): Promise<Folder> => {
  await delay(600);
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    description: data.description,
    invoiceCount: 0,
    customerCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateFolderAPI = async (id: string, data: Partial<Folder>): Promise<Folder> => {
  await delay(500);
  return { id, ...data } as Folder;
};

const deleteFolderAPI = async (id: string): Promise<void> => {
  await delay(400);
};

// Componente Modal Base
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-500">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 border border-stone-400 text-stone-400  hover:bg-stone-400 hover:text-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modal de Detalhes da Pasta (com abas)
interface FolderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

const FolderDetailsModal = ({ isOpen, onClose, folder }: FolderDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (folder && isOpen) {
      setLoading(true);
      // Simular carregamento dos dados
      setTimeout(() => {
        setInvoices(mockInvoicesByFolder[folder.id] || []);
        setCustomers(mockCustomersByFolder[folder.id] || []);
        setLoading(false);
      }, 300);
    }
  }, [folder, isOpen]);

  if (!folder) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Pago', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      overdue: { label: 'Vencido', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes: ${folder.name}`} size="lg">
      <div className="space-y-4">
        {/* Informações gerais */}
        <div className="bg-gray-50 p-4">
          <p className="text-stone-400 ">{folder.description || 'Sem descrição'}</p>
          <div className="mt-3 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1 text-stone-400"><Calendar className="h-4 w-4" /> Criado: {new Date(folder.createdAt).toLocaleDateString('pt-BR')}</span>
            <span className="flex items-center gap-1 text-stone-400"><Calendar className="h-4 w-4" /> Atualizado: {new Date(folder.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Abas */}
        <div className="">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition ${
                activeTab === 'invoices'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-stone-400 hover:text-stone-500'
              }`}
            >
              <FileText className="h-4 w-4" /> Faturas ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition ${
                activeTab === 'customers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-stone-400 hover:text-stone-500'
              }`}
            >
              <Users className="h-4 w-4" /> Clientes ({customers.length})
            </button>
          </nav>
        </div>

        {/* Conteúdo da aba */}
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
          ) : activeTab === 'invoices' ? (
            invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Nenhuma fatura nesta pasta</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-stone-400">
                    <tr className="text-left text-stone-500">
                      <th className="pb-2">Número</th>
                      <th className="pb-2">Cliente</th>
                      <th className="pb-2 text-right">Valor</th>
                      <th className="pb-2">Vencimento</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-400">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-100">
                        <td className="py-2 font-medium">{inv.number}</td>
                        <td className="py-2">{inv.customerName}</td>
                        <td className="py-2 text-right">{formatCurrency(inv.amount)}</td>
                        <td className="py-2">{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</td>
                        <td className="py-2">{getStatusBadge(inv.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            customers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Nenhum cliente nesta pasta</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="rounded-lg border border-stone-400 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-stone-500">{customer.name}</h4>
                        <div className="mt-1 space-y-1 text-sm text-stone-400">
                          <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {customer.email}</div>
                          <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {customer.phone}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-stone-400">Total faturas: {customer.totalInvoices}</div>
                        <div className="font-medium text-green-600 dark:text-green-400">Total pago: {formatCurrency(customer.totalPaid)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

// Componente Card (sem Link, com botão)
interface FolderCardProps {
  folder: Folder;
  onEdit: (folder: Folder) => void;
  onDelete: (id: string) => void;
  onViewDetails: (folder: Folder) => void;
}

const FolderCard = ({ folder, onEdit, onDelete, onViewDetails }: FolderCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="group relative rounded-xl border border-stone-400 p-5 transition-all hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-stone-500">{folder.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(folder)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-300 hover:text-stone-400"
            aria-label="Editar pasta"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(folder.id)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-300 hover:text-red-600"
            aria-label="Excluir pasta"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-stone-400 line-clamp-2">{folder.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">📄 {folder.invoiceCount} faturas</span>
          <span className="flex items-center gap-1">👥 {folder.customerCount} clientes</span>
        </div>
        <span>Atualizado {formatDate(folder.updatedAt)}</span>
      </div>

      <button
        onClick={() => onViewDetails(folder)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg  py-2 text-sm font-medium text-blue-600 transition border border-stone-400"
      >
        <Eye className="h-4 w-4" /> Ver detalhes
      </button>
    </div>
  );
};

// Componente Principal

export default function FolderIndex() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await fetchFolders();
      setFolders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pastas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setFormLoading(true);
    try {
      const newFolder = await createFolderAPI(formData);
      setFolders((prev) => [newFolder, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      alert('Falha ao criar pasta');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolder || !formData.name.trim()) return;

    setFormLoading(true);
    try {
      const updated = await updateFolderAPI(selectedFolder.id, {
        name: formData.name,
        description: formData.description,
        updatedAt: new Date().toISOString(),
      });
      setFolders((prev) =>
        prev.map((f) => (f.id === selectedFolder.id ? { ...f, ...updated } : f))
      );
      setIsEditModalOpen(false);
      setSelectedFolder(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      alert('Falha ao atualizar pasta');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pasta? Esta ação não pode ser desfeita.')) return;

    const previousFolders = folders;
    setFolders((prev) => prev.filter((f) => f.id !== id));

    try {
      await deleteFolderAPI(id);
    } catch (err) {
      setFolders(previousFolders);
      alert('Falha ao excluir pasta');
    }
  };

  const openEditModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setFormData({ name: folder.name, description: folder.description });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsDetailsModalOpen(true);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortField === 'invoiceCount') comparison = a.invoiceCount - b.invoiceCount;
    else if (sortField === 'createdAt') comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-stone-500">
          <a href="/dashboard" className="flex items-center gap-1 hover:text-stone-400">
            <Home className="h-4 w-4" />
            Dashboard
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-stone-500">Pastas</span>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-500">Pastas</h1>
            <p className="mt-1 text-stone-400 ">
              Organize suas faturas e clientes em pastas personalizadas
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', description: '' });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FolderPlus className="h-4 w-4" />
            Nova Pasta
          </button>
        </div>

        {/* Busca e ordenação */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pastas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stone-400 py-2 pl-10 bg-stone-100 pr-4 text-sm focus:outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 ">
            <span className="text-sm text-stone-400">Ordenar por:</span>
            <div className="flex gap-1 rounded-lg border border-stone-400 p-1 ">
              {(['name', 'invoiceCount', 'createdAt'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    sortField === field
                      ? 'bg-stone-200 text-stone-400'
                      : 'text-stone-400 hover:bg-stone-300'
                  }`}
                >
                  {field === 'name' && 'Nome'}
                  {field === 'invoiceCount' && 'Nº Faturas'}
                  {field === 'createdAt' && 'Data'}
                  {sortField === field && (
                    <ArrowUpDown className={`h-3 w-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando suas pastas...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={loadFolders}
              className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              Tentar novamente
            </button>
          </div>
        ) : sortedFolders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Nenhuma pasta encontrada</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Tente outro termo de busca' : 'Crie sua primeira pasta para organizar suas faturas e clientes'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                <FolderPlus className="h-4 w-4" />
                Criar primeira pasta
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onViewDetails={openDetailsModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modais btn principal abre essa modal*/}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Pasta">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400">Nome da pasta *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">Descrição (opcional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg border border-stone-400 px-4 py-2 text-sm font-medium text-stone-400  hover:bg-stone-400 hover:text-stone-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar Pasta
            </button>
          </div>
        </form>
      </Modal>

         {/* Modal de editar btn_editar */}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Pasta">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400">Nome da pasta *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">Descrição</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-stone-400 px-4 py-2 text-sm font-medium text-stone-400  hover:bg-stone-400 hover:text-stone-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de detalhes */}
      <FolderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        folder={selectedFolder}
      />
    </div>
  );
}