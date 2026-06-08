import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

//  Tipos
interface Transaction {
  id: string;
  plan: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "refunded";
  date: string; // data de emissão
  dueDate: string; // data de vencimento
  invoiceNumber: string;
}

interface DashboardMetrics {
  totalInvoicesValue: number;
  totalCustomers: number;
  paidInvoicesValue: number;
  pendingInvoicesValue: number;
}

//  Dados Mockados
const mockMetrics: DashboardMetrics = {
  totalInvoicesValue: 187450.0,
  totalCustomers: 342,
  paidInvoicesValue: 142300.0,
  pendingInvoicesValue: 45150.0,
};

const monthlyData = [
  { month: "Jan", faturas: 12500, clientes: 12 },
  { month: "Fev", faturas: 18900, clientes: 18 },
  { month: "Mar", faturas: 15200, clientes: 15 },
  { month: "Abr", faturas: 22100, clientes: 22 },
  { month: "Mai", faturas: 19800, clientes: 20 },
  { month: "Jun", faturas: 24200, clientes: 25 },
  { month: "Jul", faturas: 27800, clientes: 28 },
  { month: "Ago", faturas: 23400, clientes: 24 },
  { month: "Set", faturas: 28900, clientes: 30 },
  { month: "Out", faturas: 31200, clientes: 32 },
  { month: "Nov", faturas: 29800, clientes: 31 },
  { month: "Dez", faturas: 34500, clientes: 35 },
];

const statusData = [
  { name: "Pagas", value: 142300, color: "#10b981" },
  { name: "Pendentes", value: 45150, color: "#f59e0b" },
  { name: "Vencidas", value: 12400, color: "#ef4444" },
];

const activityData = [
  { day: "Seg", transacoes: 23 },
  { day: "Ter", transacoes: 32 },
  { day: "Qua", transacoes: 28 },
  { day: "Qui", transacoes: 35 },
  { day: "Sex", transacoes: 41 },
  { day: "Sáb", transacoes: 18 },
  { day: "Dom", transacoes: 12 },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    plan: "Plano Pro",
    customerName: "NÓS Comunicações",
    amount: 299.9,
    status: "paid",
    date: "2025-04-01",
    dueDate: "2025-04-01",
    invoiceNumber: "FAT-001",
  },
  {
    id: "2",
    plan: "Plano Business",
    customerName: "GALP Energias",
    amount: 599.9,
    status: "pending",
    date: "2025-04-02",
    dueDate: "2025-04-15",
    invoiceNumber: "FAT-002",
  },
  {
    id: "3",
    plan: "Plano Basic",
    customerName: "Tranpostes Duarte",
    amount: 99.9,
    status: "paid",
    date: "2025-04-03",
    dueDate: "2025-04-03",
    invoiceNumber: "FAT-003",
  },
  {
    id: "4",
    plan: "Plano Pro",
    customerName: "Texeira Duarte",
    amount: 299.9,
    status: "overdue",
    date: "2025-03-25",
    dueDate: "2025-04-05",
    invoiceNumber: "FAT-004",
  },
  {
    id: "5",
    plan: "Plano Enterprise",
    customerName: "Supermercado Continente",
    amount: 1299.9,
    status: "paid",
    date: "2025-04-05",
    dueDate: "2025-04-05",
    invoiceNumber: "FAT-005",
  },
  {
    id: "6",
    plan: "Plano Pro",
    customerName: "Netflix S.A.",
    amount: 299.9,
    status: "pending",
    date: "2025-04-06",
    dueDate: "2025-04-20",
    invoiceNumber: "FAT-006",
  },
  {
    id: "7",
    plan: "Plano Basic",
    customerName: "Dcaprio Transportes",
    amount: 99.9,
    status: "paid",
    date: "2025-04-07",
    dueDate: "2025-04-07",
    invoiceNumber: "FAT-007",
  },
  {
    id: "8",
    plan: "Plano Business",
    customerName: "Inovações SA",
    amount: 599.9,
    status: "refunded",
    date: "2025-04-08",
    dueDate: "2025-04-22",
    invoiceNumber: "FAT-008",
  },
  {
    id: "9",
    plan: "Plano Pro",
    customerName: "LS-Car Control LDA",
    amount: 299.9,
    status: "paid",
    date: "2025-04-09",
    dueDate: "2025-04-09",
    invoiceNumber: "FAT-009",
  },
  {
    id: "10",
    plan: "Plano Enterprise",
    customerName: "Costrução César LDA",
    amount: 1299.9,
    status: "pending",
    date: "2025-04-10",
    dueDate: "2025-04-25",
    invoiceNumber: "FAT-010",
  },
];

//  Componente Modal Base
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-400">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 border border-stone-400 text-gray-400  hover:bg-stone-400 hover:text-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

//  Modal de Confirmação de Exclusão (profissional)
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionName: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  transactionName,
  isLoading,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja excluir a transação de{" "}
          <strong>{transactionName}</strong>? Esta ação não pode ser desfeita.
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
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// Card de Métrica
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  const formattedValue = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
  return (
    <div className="rounded-xl p-6 shadow-sm border border-stone-400 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-stone-500">
            {formattedValue}
          </p>
          {trend !== undefined && (
            <p
              className={`mt-2 text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs mês anterior
            </p>
          )}
        </div>
        <div className="rounded-full bg-stone-200 p-3 text-stone-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

//  Tabela de Transações (com datas separadas)
interface TransactionsTableProps {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string, name: string) => void; // agora recebe nome do cliente para modal
}

const TransactionsTable = ({
  transactions,
  onView,
  onEdit,
  onDelete,
}: TransactionsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-PT");

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      paid: {
        label: "Pago",
        className: "bg-green-100 border border-lg text-green-600",
      },
      pending: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800 border border-lg",
      },
      overdue: {
        label: "Vencido",
        className: "bg-red-100 text-red-800 border border-lg",
      },
      refunded: {
        label: "Reembolsado",
        className: "bg-gray-200 text-stone-400 border border-lg",
      },
    };
    const c = config[status] || config.pending;
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium border border-stone-400 ${c.className}`}
      >
        {c.label}
      </span>
    );
  };

  return (
    <div className="bg-stone-100">
      <div className="overflow-x-auto ">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-400">
            <tr className="text-left text-stone-400">
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Plano</th>
              <th className="pb-3 font-medium text-right">Valor</th>
              <th className="pb-3 font-medium">Data Emissão</th>
              <th className="pb-3 font-medium">Vencimento</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300 ">
            {paginatedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-stone-200 transition">
                <td className="py-3 font-medium text-stone-400">
                  {tx.customerName}
                </td>
                <td className="py-3 text-stone-400">{tx.plan}</td>
                <td className="py-3 text-right font-medium text-stone-400 pr-6">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="py-3 text-stone-400">{formatDate(tx.date)}</td>
                <td className="py-3 text-stone-400 ">
                  {formatDate(tx.dueDate)}
                </td>
                <td className="py-3">{getStatusBadge(tx.status)}</td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(tx)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-gray-100 hover:text-blue-600"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(tx)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-gray-100 hover:text-green-600"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id, tx.customerName)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-gray-100 hover:text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-stone-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-stone-300 border border-stone-400"
          >
            {" "}
            <ChevronLeft className="h-4 w-4" /> Anterior{" "}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-stone-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-stone-300 border border-stone-400"
          >
            {" "}
            Próxima <ChevronRight className="h-4 w-4" />{" "}
          </button>
        </div>
      )}
    </div>
  );
};

// Componente Principal Dashboard
export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    plan: "",
    amount: 0,
    status: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setMetrics(mockMetrics);
        setTransactions(mockTransactions);
      } catch (err) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterStatus !== "all" && tx.status !== filterStatus) return false;
      if (filterPlan !== "all" && tx.plan !== filterPlan) return false;
      if (
        searchTerm &&
        !tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [transactions, filterStatus, filterPlan, searchTerm]);

  const handleView = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsViewModalOpen(true);
  };
  const handleEdit = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setEditFormData({ plan: tx.plan, amount: tx.amount, status: tx.status });
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions((prev) => prev.filter((tx) => tx.id !== deleteTarget.id));
      setToastMessage({
        type: "success",
        text: "Transação excluída com sucesso!",
      });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToastMessage({ type: "error", text: "Erro ao excluir transação" });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;
    setFormLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === selectedTransaction.id
            ? {
                ...tx,
                plan: editFormData.plan,
                amount: editFormData.amount,
                status: editFormData.status as any,
              }
            : tx,
        ),
      );
      setIsEditModalOpen(false);
      setToastMessage({ type: "success", text: "Transação atualizada!" });
    } catch (err) {
      setToastMessage({ type: "error", text: "Erro ao atualizar" });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-14 w-14 animate-spin text-blue-500" />
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast simples (pode ser substituído por lib) */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${toastMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {toastMessage.text}
          </div>
        )}

        <h1 className="text-3xl font-bold text-stone-500">Dashboard</h1>
        <p className="mt-1 text-stone-400">Visão geral do seu negócio</p>

        {/* Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total em Faturas"
            value={metrics?.totalInvoicesValue || 0}
            icon={<DollarSign className="h-6 w-6" />}
            trend={12}
          />
          <MetricCard
            title="Total de Clientes"
            value={metrics?.totalCustomers || 0}
            icon={<Users className="h-6 w-6" />}
            trend={8}
          />
          <MetricCard
            title="Faturas Pagas"
            value={metrics?.paidInvoicesValue || 0}
            icon={<CreditCard className="h-6 w-6" />}
            trend={5}
          />
          <MetricCard
            title="Faturas Pendentes"
            value={metrics?.pendingInvoicesValue || 0}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={-3}
          />
        </div>

        {/* Gráficos */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl p-5 shadow-sm border border-stone-400">
            <h3 className="mb-4 text-lg font-semibold">Evolução de Faturas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip formatter={(v) => `€${v.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="faturas"
                  stroke="#3b82f6"
                  name="Faturas (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl  p-5 shadow-sm border border-stone-400">
            <h3 className="mb-4 text-lg font-semibold">
              Distribuição por Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `€${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl  p-5 shadow-sm border border-stone-400">
            <h3 className="mb-4 text-lg font-semibold">Transações por Dia</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="transacoes"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  name="Transações"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Transações */}
        <div className="mt-8 rounded-xl p-5 shadow-sm border border-stone-400">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-stone-400">
            <h2 className="text-xl font-semibold">Transações Recentes</h2>
            <div className="flex flex-wrap gap-3">
              <div className="relative focus:outline-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente ou fatura"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-stone-400 bg-stone-100 text-stone-400 py-1.5 pl-9 pr-3 text-sm focus:outline-none placeholder:text-stone-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-stone-400 bg-stone-100 text-stone-400 px-3 py-1.5 text-sm"
              >
                <option value="all">Todos os status</option>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
                <option value="overdue">Vencido</option>
                <option value="refunded">Reembolsado</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="rounded-lg border border-stone-400 bg-stone-100 text-stone-400 px-3 py-1.5 text-sm"
              >
                <option value="all">Todos os planos</option>
                <option value="Plano Basic">Basic</option>
                <option value="Plano Pro">Pro</option>
                <option value="Plano Business">Business</option>
                <option value="Plano Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              Nenhuma transação encontrada.
            </div>
          ) : (
            <TransactionsTable
              transactions={filteredTransactions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Modais */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes da Transação"
      >
        {selectedTransaction && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Fatura:</span>
              <span>{selectedTransaction.invoiceNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Cliente:</span>
              <span>{selectedTransaction.customerName}</span>
            </div>
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Plano:</span>
              <span>{selectedTransaction.plan}</span>
            </div>
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Valor:</span>
              <span>
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                }).format(selectedTransaction.amount)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Emissão:</span>
              <span>
                {new Date(selectedTransaction.date).toLocaleDateString("pt-PT")}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-stone-400">
              <span className="font-medium">Vencimento:</span>
              <span>
                {new Date(selectedTransaction.dueDate).toLocaleDateString(
                  "pt-PT",
                )}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span className="font-medium">Status:</span>
              <span>{selectedTransaction.status}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Transação"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Plano
            </label>
            <select
              value={editFormData.plan}
              onChange={(e) =>
                setEditFormData({ ...editFormData, plan: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400  text-stone-400 focus:outline-none"
            >
              <option>Plano Basic</option>
              <option>Plano Pro</option>
              <option>Plano Business</option>
              <option>Plano Enterprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Valor (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={editFormData.amount}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  amount: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400  text-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Status
            </label>
            <select
              value={editFormData.status}
              onChange={(e) =>
                setEditFormData({ ...editFormData, status: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400  text-stone-400 focus:outline-none"
            >
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="overdue">Vencido</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-stone-400 px-4 py-2 text-sm text-stone-400 hover:bg-stone-400 hover:text-stone-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
            >
              {formLoading && (
                <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
              )}{" "}
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão profissional */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        transactionName={deleteTarget?.name || ""}
        isLoading={deleteLoading}
      />
    </div>
  );
}
