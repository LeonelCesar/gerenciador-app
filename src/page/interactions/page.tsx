import { useEffect, useState, FormEvent, useRef, useCallback } from "react";
import { formatCurrency } from "../../utils/formatters";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  invoiceService,
  Invoice,
  InvoiceStatus,
  mockClients,
} from "../../lib/invoiceMockData";

/*  COMPONENTES AUXILIARES (Modais, Badge, etc.) Mantêm a estilização original  */

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ">
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-400 px-4 py-2 text-stone-400 hover:bg-stone-300 hover:text-stone-400"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja excluir a fatura{" "}
          <strong>{invoiceNumber}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const config = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    overdue: "bg-rose-100 text-rose-800 border-rose-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const labels = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
    cancelled: "Cancelado",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${config[status]}`}
    >
      {labels[status]}
    </span>
  );
};

/*
   FORMULÁRIO DE CRIAÇÃO/EDIÇÃO DE FATURA (SIMPLES)
   Adaptado do formulário antigo, mas agora com cliente, itens, etc.
   Mantém a mesma estética
*/
interface InvoiceFormData {
  clientId: string;
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  onSubmit: (
    data: Omit<
      Invoice,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "invoiceNumber"
      | "subtotal"
      | "taxAmount"
      | "totalAmount"
      | "paymentReference"
    >,
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const InvoiceForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: InvoiceFormProps) => {
  const [clientId, setClientId] = useState(
    initialData?.client?.id || mockClients[0].id,
  );
  const [items, setItems] = useState(
    initialData?.items?.map((i) => ({
      description: i.description,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })) || [{ description: "", quantity: 1, unitPrice: 0 }],
  );
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate || new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [status, setStatus] = useState<InvoiceStatus>(
    initialData?.status || "pending",
  );

  const addItem = () =>
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) =>
    setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selectedClient = mockClients.find((c) => c.id === clientId);
    if (!selectedClient) return;
    const invoiceItems = items
      .filter((i) => i.description.trim() !== "")
      .map((i) => ({
        id: `temp_${Date.now()}`,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.quantity * i.unitPrice,
      }));
    if (invoiceItems.length === 0) return alert("Adicione pelo menos um item.");
    onSubmit({
      client: selectedClient,
      items: invoiceItems,
      issueDate,
      dueDate: dueDate || issueDate,
      status,
      notes: "",
      paymentMethod: "multibanco",
      taxRate: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-400">
          Cliente
        </label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none"
        >
          {mockClients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.taxId})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-400">
          Itens da fatura
        </label>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 mt-2 items-center">
            <input
              placeholder="Descrição"
              value={item.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              className="flex-1 border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Qtd"
              value={item.quantity}
              onChange={(e) =>
                updateItem(idx, "quantity", Number(e.target.value))
              }
              className="w-20 border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none"
            />
            <input
              type="number"
              step="0.01"
              placeholder="€"
              value={item.unitPrice}
              onChange={(e) =>
                updateItem(idx, "unitPrice", Number(e.target.value))
              }
              className="w-24 border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-sm text-blue-600"
        >
          + Adicionar item
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-400">
            Data de emissão
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="mt-1 w-full border border-stone-300 rounded px-3 py-2 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-400 focus:outline-none">
            Data de vencimento
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full border border-stone-300 rounded px-3 py-2 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-400">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          className="mt-1 w-full border border-stone-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="overdue">Vencido</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

/*  COMPONENTE PRINCIPAL – LISTAGEM DE FATURA */
export default function interactionsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>(
    "all",
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState<Invoice | null>(null);
  const [viewItem, setViewItem] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const viewDetailsRef = useRef<HTMLDivElement>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    number: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const PAGE_SIZE = 10;

  // Carregar dados do serviço mock
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    const result = await invoiceService.getInvoices({
      page,
      pageSize: PAGE_SIZE,
      search,
      status: statusFilter,
    });
    setInvoices(result.data);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Seleção em massa
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const selectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      invoices.forEach((inv) => copy.add(inv.id));
      return copy;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const archiveSelected = async () => {
    // Simula arquivamento (não implementado no serviço, mas podemos apenas limpar seleção)
    if (selectedIds.size === 0) return;
    alert("Funcionalidade em desenvolvimento");
    clearSelection();
  };
  const exportCSV = () => {
    if (selectedIds.size === 0) return;
    alert("Funcionalidade em desenvolvimento");
  };

  // CRUD com o serviço mock
  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newInvoice = await invoiceService.createInvoice(data);
      setInvoices((prev) => [newInvoice, ...prev]);
      setShowCreateModal(false);
      setToastMessage({ type: "success", text: "Fatura criada com sucesso!" });
    } catch (error) {
      setToastMessage({ type: "error", text: "Erro ao criar fatura." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editItem) return;
    setIsSubmitting(true);
    try {
      const updated = await invoiceService.updateInvoice(editItem.id, data);
      if (updated) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === editItem.id ? updated : inv)),
        );
        setEditItem(null);
        setToastMessage({ type: "success", text: "Fatura atualizada!" });
      }
    } catch (error) {
      setToastMessage({ type: "error", text: "Erro ao atualizar." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string, invoiceNumber: string) => {
    setDeleteTarget({ id, number: invoiceNumber });
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const success = await invoiceService.deleteInvoice(deleteTarget.id);
      if (success) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== deleteTarget.id));
        setSelectedIds((prev) => {
          const copy = new Set(prev);
          copy.delete(deleteTarget.id);
          return copy;
        });
        setToastMessage({ type: "success", text: "Fatura excluída!" });
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      setToastMessage({ type: "error", text: "Erro ao excluir." });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Exportar PDF profissional usando os dados reais da fatura
  const exportSinglePDF = async (invoice: Invoice) => {
    setIsExportingPDF(true);
    try {
      const element = document.createElement("div");
      element.style.width = "800px";
      element.style.padding = "20px";
      element.style.backgroundColor = "white";
      element.style.fontFamily = "sans-serif";

      const paymentRef = invoice.paymentReference
        ? `${invoice.paymentReference.entity} ${invoice.paymentReference.reference}`
        : "---";

      element.innerHTML = `
        <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #2563eb; margin: 0;">LC-Faturas</h1>
          <p style="color: #6b7280; margin: 4px 0 0;">Soluções financeiras integradas</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
          <div>
            <h2 style="font-size: 24px; font-weight: bold; margin: 0 0 8px;">FATURA</h2>
            <p style="margin: 2px 0;"><strong>Nº</strong> ${invoice.invoiceNumber}</p>
            <p style="margin: 2px 0;"><strong>Data de emissão:</strong> ${new Date(invoice.issueDate).toLocaleDateString("pt-PT")}</p>
            <p style="margin: 2px 0;"><strong>Data de vencimento:</strong> ${new Date(invoice.dueDate).toLocaleDateString("pt-PT")}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 2px 0;"><strong>Entidade:</strong> Leonel César, Lda.</p>
            <p style="margin: 2px 0;">NIPC: 923456780</p>
            <p style="margin: 2px 0;">Rua Miguel Bombarda Nº 225 Barreiro/Lisboa</p>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">Cliente</h3>
          <p style="margin: 4px 0;"><strong>Nome:</strong> ${invoice.client.name}</p>
          <p style="margin: 4px 0;"><strong>NIF/NIPC:</strong> ${invoice.client.taxId}</p>
          <p style="margin: 4px 0;">${invoice.client.address || ""} ${invoice.client.postalCode || ""} ${invoice.client.city || ""}</p>
          <p style="margin: 4px 0;">${invoice.client.email}</p>
        </div>
        <div style="background-color: #eff6ff; padding: 16px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="font-size: 12px; font-weight: bold; color: #1e40af;">REFERÊNCIA PARA PAGAMENTO</p>
              <p style="font-size: 20px; font-family: monospace; font-weight: bold;">${paymentRef}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 12px; color: #1e40af;">Valor a pagar</p>
              <p style="font-size: 24px; font-weight: bold; color: #166534;">${formatCurrency(invoice.totalAmount)}</p>
            </div>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead style="background-color: #f3f4f6;">
            <tr><th style="text-align: left; padding: 10px;">Descrição</th><th style="text-align: right;">Qtd</th><th style="text-align: right;">Preço unit.</th><th style="text-align: right;">Total</th></tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                <td style="text-align: right;">${formatCurrency(item.total)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div style="text-align: right; width: 300px; margin-left: auto;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0;"><span>Subtotal:</span><span>${formatCurrency(invoice.subtotal)}</span></div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0;"><span>IVA (${invoice.taxRate}%):</span><span>${formatCurrency(invoice.taxAmount)}</span></div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb;"><span>TOTAL:</span><span>${formatCurrency(invoice.totalAmount)}</span></div>
        </div>
        <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
          Documento gerado eletronicamente em ${new Date().toLocaleString("pt-PT")}
        </div>
      `;
      document.body.appendChild(element);
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      document.body.removeChild(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      pdf.save(`fatura_${invoice.invoiceNumber.replace(/\s/g, "_")}.pdf`);
      setToastMessage({ type: "success", text: "PDF gerado com sucesso!" });
    } catch (error) {
      console.error(error);
      setToastMessage({ type: "error", text: "Falha ao gerar PDF." });
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${toastMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {toastMessage.text}
        </div>
      )}

      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-500">Faturas</h1>
          <p className="text-sm text-stone-400">Gerencie as faturas emitidas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
        >
          + Nova Fatura
        </button>
      </header>

      {/* Filtros */}
      <section className="rounded-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por cliente, NIF ou número da fatura..."
          className="border border-stone-400 placeholder:text-stone-400 bg-stone-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setPage(1);
          }}
          className="border border-stone-400 bg-stone-100 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="overdue">Vencido</option>
          <option value="cancelled">Cancelado</option>
        </select>
        {/* Espaço vazio para manter o grid */}
        <div></div>
      </section>

      {/* Ações em massa */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={selectAllCurrentPage}
            className="text-sm px-3 py-1 border border-stone-400 rounded-lg"
          >
            Selecionar página
          </button>
          <button
            onClick={clearSelection}
            className="text-sm px-3 py-1 border border-stone-400 rounded-lg"
          >
            Limpar
          </button>
          <span className="text-sm text-stone-500">
            {selectedIds.size} selecionado(s)
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={archiveSelected}
            className="text-sm px-3 py-1 border border-stone-400 rounded-lg"
          >
            Arquivar
          </button>
          <button
            onClick={exportCSV}
            className="text-sm px-3 py-1 border border-stone-400 rounded-lg"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="shadow-sm rounded-md overflow-hidden border border-stone-400">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-stone-100 text-stone-400 border-b border-stone-200">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      invoices.length > 0 &&
                      invoices.every((inv) => selectedIds.has(inv.id))
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? selectAllCurrentPage()
                        : clearSelection()
                    }
                  />
                </th>
                <th className="p-3 text-left">Nº Fatura</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Data Emissão</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-stone-500">
                    Carregando...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-stone-500">
                    Nenhuma fatura encontrada.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                      />
                    </td>
                    <td className="p-3 font-medium text-stone-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3 text-stone-400">{inv.client.name}</td>
                    <td className="p-3 text-stone-400 truncate max-w-xs">
                      {inv.items.map((i) => i.description).join(", ")}
                    </td>
                    <td className="p-3 text-right font-semibold text-stone-400">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="p-3 text-stone-400">
                      {new Date(inv.issueDate).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewItem(inv)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => setEditItem(inv)}
                          className="text-amber-600 hover:text-amber-800 text-xs px-2 py-1 border border-amber-200 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal(inv.id, inv.invoiceNumber)
                          }
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-200 rounded"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <footer className="flex items-center justify-between mt-4">
        <div className="text-sm text-stone-500">
          Página {page} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Anterior
          </button>
          <span className="text-sm">Página</span>
          <input
            className="w-16 text-center border border-stone-300 rounded-lg px-2 py-1"
            value={page}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPage(isNaN(v) ? 1 : Math.min(totalPages, Math.max(1, v)));
            }}
          />
          <span className="text-sm">de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Próxima
          </button>
        </div>
      </footer>

      {/* Modais */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nova Fatura"
      >
        <InvoiceForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Editar Fatura"
      >
        {editItem && (
          <InvoiceForm
            initialData={editItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditItem(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Modal de visualização da fatura (com layout profissional pdf) */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Detalhes da Fatura"
        size="lg"
      >
        {viewItem && (
          <div>
            <div ref={viewDetailsRef} className="space-y-6 p-2">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-stone-500">FATURA</h3>
                  <p className="text-sm text-stone-500">
                    Nº {viewItem.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-500">Data de emissão</div>
                  <div className="font-medium">
                    {new Date(viewItem.issueDate).toLocaleDateString("pt-PT")}
                  </div>
                  <div className="text-sm text-stone-500 mt-1">
                    Data de vencimento
                  </div>
                  <div className="font-medium">
                    {new Date(viewItem.dueDate).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              </div>
              <div className="bg-stone-50 p-4 rounded-lg grid grid-cols-2 gap-3 text-sm">
                <div className="font-semibold">Cliente</div>
                <div>{viewItem.client.name}</div>
                <div className="font-semibold">NIF/NIPC</div>
                <div className="font-mono">{viewItem.client.taxId}</div>
                {viewItem.client.email && (
                  <>
                    <div className="font-semibold">Email</div>
                    <div>{viewItem.client.email}</div>
                  </>
                )}
                {viewItem.client.address && (
                  <>
                    <div className="font-semibold">Morada</div>
                    <div>
                      {viewItem.client.address}, {viewItem.client.city}
                    </div>
                  </>
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-blue-700">
                    Referência Multibanco
                  </div>
                  <div className="text-xl font-mono font-bold">
                    {viewItem.paymentReference?.entity}{" "}
                    {viewItem.paymentReference?.reference}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-700">Valor total</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(viewItem.totalAmount)}
                  </div>
                </div>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-right p-2">Qtd</th>
                    <th className="text-right p-2">Preço</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewItem.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.description}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="text-right p-2 font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t pt-4 text-right space-y-1">
                <div className="flex justify-end gap-8 text-sm">
                  <span>Subtotal</span>
                  <span className="w-32">
                    {formatCurrency(viewItem.subtotal)}
                  </span>
                </div>
                <div className="flex justify-end gap-8 text-sm">
                  <span>IVA ({viewItem.taxRate}%)</span>
                  <span className="w-32">
                    {formatCurrency(viewItem.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-end gap-8 text-lg font-bold">
                  <span>Total</span>
                  <span className="w-32 text-green-700">
                    {formatCurrency(viewItem.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => exportSinglePDF(viewItem)}
                disabled={isExportingPDF}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {isExportingPDF ? "Gerando PDF..." : "📄 Exportar Fatura (PDF)"}
              </button>
            </div>
          </div>
        )}
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
