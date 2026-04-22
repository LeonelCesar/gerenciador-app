import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Loader2,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

// Tipos
interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerId: string;
  total: number;
  status: "paid" | "pending" | "overdue" | "canceled";
  issueDate: string;
  dueDate: string;
  description: string;
}

const STATUS_OPTIONS = [
  { value: "paid", label: "Pago", color: "green" },
  { value: "pending", label: "Pendente", color: "yellow" },
  { value: "overdue", label: "Vencido", color: "red" },
  { value: "canceled", label: "Cancelado", color: "gray" },
];

// Dados Mockados
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "FAT-2025-001",
    customerName: "Telecom Portugal",
    customerId: "c1",
    total: 1250.0,
    status: "paid",
    issueDate: "2025-03-01",
    dueDate: "2025-03-15",
    description: "Serviços de consultoria",
  },
  {
    id: "2",
    invoiceNumber: "FAT-2025-002",
    customerName: "Nistru Transports LDA",
    customerId: "c2",
    total: 890.5,
    status: "pending",
    issueDate: "2025-03-10",
    dueDate: "2025-03-25",
    description: "Plano Pro - Mensal",
  },
  {
    id: "3",
    invoiceNumber: "FAT-2025-003",
    customerName: "MEO Comunicações",
    customerId: "c3",
    total: 2340.0,
    status: "paid",
    issueDate: "2025-02-20",
    dueDate: "2025-03-05",
    description: "Implementação de sistema",
  },
  {
    id: "4",
    invoiceNumber: "FAT-2025-004",
    customerName: "Abreu Logistics",
    customerId: "c4",
    total: 560.75,
    status: "overdue",
    issueDate: "2025-02-01",
    dueDate: "2025-02-15",
    description: "Suporte mensal",
  },
  {
    id: "5",
    invoiceNumber: "FAT-2025-005",
    customerName: "Energias Renováveis SA",
    customerId: "c5",
    total: 1299.9,
    status: "paid",
    issueDate: "2025-03-05",
    dueDate: "2025-03-20",
    description: "Plano Enterprise",
  },
  {
    id: "6",
    invoiceNumber: "FAT-2025-006",
    customerName: "Unitel Angola",
    customerId: "c6",
    total: 299.9,
    status: "pending",
    issueDate: "2025-03-12",
    dueDate: "2025-03-27",
    description: "Plano Pro",
  },
  {
    id: "7",
    invoiceNumber: "FAT-2025-007",
    customerName: "Indiama Angola",
    customerId: "c7",
    total: 99.9,
    status: "paid",
    issueDate: "2025-03-08",
    dueDate: "2025-03-22",
    description: "Plano Basic",
  },
  {
    id: "8",
    invoiceNumber: "FAT-2025-008",
    customerName: "Transporte Marítimo LDA",
    customerId: "c8",
    total: 599.9,
    status: "canceled",
    issueDate: "2025-02-28",
    dueDate: "2025-03-14",
    description: "Plano Business",
  },
  {
    id: "9",
    invoiceNumber: "FAT-2025-009",
    customerName: "Industrias Metalúrgicas SA",
    customerId: "c9",
    total: 299.9,
    status: "paid",
    issueDate: "2025-03-15",
    dueDate: "2025-03-30",
    description: "Plano Pro",
  },
  {
    id: "10",
    invoiceNumber: "FAT-2025-010",
    customerName: "LS-Car Control LDA",
    customerId: "c10",
    total: 1299.9,
    status: "pending",
    issueDate: "2025-03-18",
    dueDate: "2025-04-02",
    description: "Plano Enterprise",
  },
  {
    id: "11",
    invoiceNumber: "FAT-2025-011",
    customerName: "DSTV Angola",
    customerId: "c1",
    total: 450.0,
    status: "paid",
    issueDate: "2025-02-10",
    dueDate: "2025-02-25",
    description: "Consultoria adicional",
  },
  {
    id: "12",
    invoiceNumber: "FAT-2025-012",
    customerName: "Clinica Sagrada Esperança",
    customerId: "c2",
    total: 1200.0,
    status: "overdue",
    issueDate: "2025-01-15",
    dueDate: "2025-01-30",
    description: "Implementação",
  },
];

//  API Simulada
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchInvoices = async (): Promise<Invoice[]> => {
  await delay(600);
  return [...mockInvoices];
};

const createInvoiceAPI = async (
  data: Omit<Invoice, "id" | "invoiceNumber">,
): Promise<Invoice> => {
  await delay(700);
  const newId = (Math.random() * 1000).toFixed(0);
  return {
    id: newId,
    invoiceNumber: `FAT-2025-${String(newId).padStart(3, "0")}`,
    ...data,
  };
};

const updateInvoiceAPI = async (
  id: string,
  data: Partial<Invoice>,
): Promise<Invoice> => {
  await delay(500);
  return { id, ...data } as Invoice;
};

const deleteInvoiceAPI = async (id: string): Promise<void> => {
  await delay(400);
};

// Componente Modal
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
        className={`w-full ${sizeClasses[size]} rounded-2xl bg-stone-100 p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-500">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-stone-400 p-4 py-2 text-stone-400 hover:bg-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modal de Confirmação
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceNumber: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  invoiceNumber,
  isLoading,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-stone-300 ">
          Tem certeza que deseja excluir a fatura{" "}
          <strong>{invoiceNumber}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

//  Componente Principal
export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros (sem datas)
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minTotal, setMinTotal] = useState<number | "">("");
  const [maxTotal, setMaxTotal] = useState<number | "">("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    number: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    total: 0,
    status: "pending" as Invoice["status"],
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Carregar dados
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar faturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Métricas
  const metrics = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalValue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidValue = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0);
    const pendingValue = invoices
      .filter((i) => i.status === "pending")
      .reduce((sum, i) => sum + i.total, 0);
    return { totalInvoices, totalValue, paidValue, pendingValue };
  }, [invoices]);

  // Filtragem (sem datas)
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (
        searchCustomer &&
        !inv.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
      )
        return false;
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (minTotal !== "" && inv.total < minTotal) return false;
      if (maxTotal !== "" && inv.total > maxTotal) return false;
      return true;
    });
  }, [invoices, searchCustomer, statusFilter, minTotal, maxTotal]);

  // Paginação
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchCustomer, statusFilter, minTotal, maxTotal]);

  // CRUD
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || formData.total <= 0) return;
    setFormLoading(true);
    try {
      const newInvoice = await createInvoiceAPI({
        customerName: formData.customerName,
        customerId: formData.customerId || `c${Date.now()}`,
        total: formData.total,
        status: formData.status,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        description: formData.description,
      });
      setInvoices((prev) => [newInvoice, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({
        customerName: "",
        customerId: "",
        total: 0,
        status: "pending",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 15 * 86400000)
          .toISOString()
          .split("T")[0],
        description: "",
      });
      setToastMessage({ type: "success", text: "Fatura criada com sucesso!" });
    } catch (err) {
      setToastMessage({ type: "error", text: "Erro ao criar fatura" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setFormLoading(true);
    try {
      const updated = await updateInvoiceAPI(selectedInvoice.id, {
        customerName: formData.customerName,
        customerId: formData.customerId,
        total: formData.total,
        status: formData.status,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        description: formData.description,
      });
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === selectedInvoice.id ? { ...i, ...updated } : i,
        ),
      );
      setIsEditModalOpen(false);
      setToastMessage({ type: "success", text: "Fatura atualizada!" });
    } catch (err) {
      setToastMessage({ type: "error", text: "Erro ao atualizar" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: string, invoiceNumber: string) => {
    setDeleteTarget({ id, number: invoiceNumber });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteInvoiceAPI(deleteTarget.id);
      setInvoices((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setToastMessage({ type: "success", text: "Fatura excluída!" });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setToastMessage({ type: "error", text: "Erro ao excluir" });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const openEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      customerId: invoice.customerId,
      total: invoice.total,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      description: invoice.description,
    });
    setIsEditModalOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-PT");

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { label: string; icon: React.ReactNode; className: string }
    > = {
      paid: {
        label: "Pago",
        icon: <CheckCircle className="h-3 w-3" />,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      pending: {
        label: "Pendente",
        icon: <Clock className="h-3 w-3" />,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      overdue: {
        label: "Vencido",
        icon: <AlertCircle className="h-3 w-3" />,
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
      canceled: {
        label: "Cancelado",
        icon: <X className="h-3 w-3" />,
        className:
          "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-400",
      },
    };
    const c = config[status];
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.className}`}
      >
        {c.icon} {c.label}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-14 w-14 animate-spin text-blue-500" />
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${toastMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {toastMessage.text}
          </div>
        )}

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-500">
              Faturas
            </h1>
            <p className="mt-1 text-stone-400">
              Gerencie todas as faturas emitidas
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Nova Fatura
          </button>
        </div>

        {/* Cards de Métricas com cores stone */}
        <div className="mb-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-xl p-5 shadow-sm border border-stone-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-400">
                  Total Faturas
                </p>
                <p className="text-2xl font-bold text-stone-400">
                  {metrics.totalInvoices}
                </p>
              </div>
              <FileText className="h-8 w-8 text-stone-400" />
            </div>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-stone-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-400">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-stone-400">
                  {formatCurrency(metrics.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-stone-400" />
            </div>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-stone-400 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-400 ">
                  Valor Pago
                </p>
                <p className="text-2xl font-bold text-stone-400">
                  {formatCurrency(metrics.paidValue)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-stone-400" />
            </div>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-stone-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Valor Pendente
                </p>
                <p className="text-2xl font-bold text-stone-400">
                  {formatCurrency(metrics.pendingValue)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-stone-400 " />
            </div>
          </div>
        </div>

        {/* Filtros (sem calendários) */}
        <div className="mb-6 rounded-xl  p-4 shadow-sm border border-stone-400">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-stone-400" />
            <span className="font-medium text-stone-400">Filtros</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Cliente..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="rounded-lg border border-stone-400 placeholder:text-stone-400 p-2 text-sm focus:outline-none bg-stone-100"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-stone-400 p-2 text-sm focus:outline-none bg-stone-100"
            >
              <option value="all">Todos os status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Total min (€)"
              value={minTotal}
              onChange={(e) =>
                setMinTotal(e.target.value ? Number(e.target.value) : "")
              }
              className="rounded-lg border border-stone-400 placeholder:text-stone-400 p-2 text-sm focus:outline-none bg-stone-100"
            />
            <input
              type="number"
              placeholder="Total max (€)"
              value={maxTotal}
              onChange={(e) =>
                setMaxTotal(e.target.value ? Number(e.target.value) : "")
              }
              className="rounded-lg border border-stone-400 placeholder:text-stone-400 p-2 text-sm focus:outline-none bg-stone-100"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-xl shadow-sm border border-stone-400 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-400 bg-stone-300">
                <tr className="text-left text-stone-400">
                  <th className="p-3 font-medium text-stone-500">Fatura Nº</th>
                  <th className="p-3 font-medium text-stone-500">Cliente</th>
                  <th className="p-3 font-medium text-right text-stone-500">Total</th>
                  <th className="p-3 font-medium text-stone-500">Status</th>
                  <th className="p-3 font-medium text-stone-500">Emissão</th>
                  <th className="p-3 font-medium text-stone-500">Vencimento</th>
                  <th className="p-3 font-medium text-center text-stone-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-stone-200 transition"
                  >
                    <td className="p-3 font-medium text-stone-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3 text-stone-400 ">
                      {inv.customerName}
                    </td>
                    <td className="p-3 text-right font-semibold text-stone-400">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="p-3">{getStatusBadge(inv.status)}</td>
                    <td className="p-3 text-stone-400 ">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="p-3 text-stone-400">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsViewModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(inv)}
                          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(inv.id, inv.invoiceNumber)
                          }
                          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-stone-500 dark:text-stone-400"
                    >
                      Nenhuma fatura encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-400 px-4 py-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-stone-400 disabled:opacity-50 hover:bg-stone-300 "
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <span className="text-sm text-stone-600 dark:text-stone-400">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-stone-400 disabled:opacity-50 hover:bg-stone-300"
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modais - cores stone */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Fatura"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Cliente *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100  text-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Total (€) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: parseFloat(e.target.value) })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
               "
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-400">
                Data Emissão
              </label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-400">
                Vencimento
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Descrição
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
               focus:bg-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg border border-stone-400 px-4 py-2 text-sm font-medium text-stone-400 hover:bg-stone-300 hover:text-stone-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
              Criar 
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes da Fatura"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold text-stone-400">Número:</div>
              <div className="text-stone-400">
                {selectedInvoice.invoiceNumber}
              </div>
              <div className="font-semibold text-stone-400">Cliente:</div>
              <div className="text-stone-400">
                {selectedInvoice.customerName}
              </div>
              <div className="font-semibold text-stone-400">Total:</div>
              <div className="text-stone-400">
                {formatCurrency(selectedInvoice.total)}
              </div>
              <div className="font-semibold text-stone-400">Status:</div>
              <div>{getStatusBadge(selectedInvoice.status)}</div>
              <div className="font-semibold text-stone-400">Emissão:</div>
              <div className="text-stone-400">
                {formatDate(selectedInvoice.issueDate)}
              </div>
              <div className="font-semibold text-stone-400">Vencimento:</div>
              <div className="text-stone-400">
                {formatDate(selectedInvoice.dueDate)}
              </div>
              <div className="font-semibold text-stone-400">Descrição:</div>
              <div className="col-span-1 text-stone-400">
                {selectedInvoice.description}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Fatura"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Cliente
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Total (€)
            </label>

            <input
              type="number"
              step="0.01"
              required
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: parseFloat(e.target.value) })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
               focus:bg-transparent "
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-stone-400">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-400">
                Data Emissão
              </label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
                focus:bg-transparent "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-400">
                Vencimento
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
                focus:bg-transparent "
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-400">
              Descrição
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full rounded-lg p-2 border border-stone-400 bg-stone-100 text-stone-400 focus:outline-none 
              focus:bg-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-stone-400 px-4 py-2 text-sm font-medium text-stone-400 hover:bg-stone-300 hover:text-stone-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        invoiceNumber={deleteTarget?.number || ""}
        isLoading={deleteLoading}
      />
    </div>
  );
}
