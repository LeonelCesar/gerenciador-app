// src/pages/Members.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  X,
  Loader2,
  Mail,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// ---------- Tipos ----------
interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

// Lista de cargos disponíveis
const ROLES = ['Administrador', 'Gerente de Vendas', 'Desenvolvedor', 'Suporte ao Cliente', 'Designer', 'Marketing', 'Financeiro'];

// ---------- Dados Mockados ----------
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@saas.com',
    role: 'Administrador',
    avatar: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=João+Silva',
    department: 'Tecnologia',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@saas.com',
    role: 'Gerente de Vendas',
    avatar: 'https://ui-avatars.com/api/?background=10b981&color=fff&name=Maria+Oliveira',
    department: 'Vendas',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@saas.com',
    role: 'Desenvolvedor',
    avatar: 'https://ui-avatars.com/api/?background=f59e0b&color=fff&name=Carlos+Mendes',
    department: 'Tecnologia',
    status: 'active',
    joinedAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@saas.com',
    role: 'Suporte ao Cliente',
    avatar: 'https://ui-avatars.com/api/?background=ef4444&color=fff&name=Ana+Costa',
    department: 'Suporte',
    status: 'inactive',
    joinedAt: '2023-12-05',
  },
  {
    id: '5',
    name: 'Pedro Santos',
    email: 'pedro.santos@saas.com',
    role: 'Designer',
    avatar: 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=Pedro+Santos',
    department: 'Design',
    status: 'active',
    joinedAt: '2024-01-25',
  },
];

// ---------- API Simulada ----------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchMembers = async (): Promise<Member[]> => {
  await delay(600);
  return [...mockMembers];
};

const createMember = async (data: Omit<Member, 'id' | 'avatar'>): Promise<Member> => {
  await delay(700);
  const nameEncoded = encodeURIComponent(data.name);
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    avatar: `https://ui-avatars.com/api/?background=${randomColor}&color=fff&name=${nameEncoded}`,
  };
};

const updateMember = async (id: string, data: Partial<Member>): Promise<Member> => {
  await delay(500);
  return { id, ...data } as Member;
};

const deleteMember = async (id: string): Promise<void> => {
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
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
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
  memberName: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, memberName, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja remover <strong>{memberName}</strong> da equipe? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Card de Membro ----------
interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
}

const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-PT');

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={member.avatar}
          alt={member.name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{member.role}</span>
                <span className="mx-1">•</span>
                <span>{member.department}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-3.5 w-3.5" />
                <span>{member.email}</span>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onEdit(member)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(member.id, member.name)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                member.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {member.status === 'active' ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {member.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
            <span>Entrou em {formatDate(member.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Componente Principal Members ----------
export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Formulário (corrigido: status tipado corretamente)
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    role: ROLES[0],
    department: '',
    status: 'active',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar membros
  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Toast automático
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handlers CRUD
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setFormLoading(true);
    try {
      const newMember = await createMember({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        joinedAt: new Date().toISOString().split('T')[0],
      });
      setMembers(prev => [newMember, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', role: ROLES[0], department: '', status: 'active' });
      setToastMessage({ type: 'success', text: 'Membro adicionado com sucesso!' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao adicionar membro' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !formData.name.trim()) return;
    setFormLoading(true);
    try {
      const updated = await updateMember(selectedMember.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
      });
      setMembers(prev => prev.map(m => (m.id === selectedMember.id ? { ...m, ...updated } : m)));
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setToastMessage({ type: 'success', text: 'Membro atualizado!' });
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
      await deleteMember(deleteTarget.id);
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      setToastMessage({ type: 'success', text: 'Membro removido!' });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Erro ao excluir' });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      status: member.status, // agora funciona sem erro
    });
    setIsEditModalOpen(true);
  };

  // Filtros
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase()) && !m.email.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      if (roleFilter !== 'all' && m.role !== roleFilter) return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      return true;
    });
  }, [members, searchTerm, roleFilter, statusFilter]);

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
          <button onClick={loadMembers} className="mt-3 rounded bg-red-100 px-4 py-2 text-sm">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${
              toastMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {toastMessage.text}
          </div>
        )}

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Equipe</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Gerencie os membros da sua organização</p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', email: '', role: ROLES[0], department: '', status: 'active' });
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            Adicionar Membro
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Todos os cargos</option>
              {ROLES.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {/* Lista de membros */}
        {filteredMembers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Nenhum membro encontrado</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente outros filtros'
                : 'Adicione o primeiro membro à sua equipe'}
            </p>
            {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                <UserPlus className="h-4 w-4" /> Adicionar Membro
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} onEdit={openEditModal} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de criação */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar Membro">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              {ROLES.map(role => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departamento</label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Ex: Tecnologia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Adicionar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de edição */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Membro">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">E-mail *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cargo</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              {ROLES.map(role => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Departamento</label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de exclusão */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        memberName={deleteTarget?.name || ''}
        isLoading={deleteLoading}
      />
    </div>
  );
}