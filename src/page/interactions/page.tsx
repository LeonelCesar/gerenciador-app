// src/pages/InteractionsPage.tsx (com exclusão profissional)
import { useEffect, useMemo, useState, FormEvent, useRef } from "react";
import { formatCurrency } from "../../utils/formatters";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/* TYPES */
export type InteractionType = "payment" | "transfer" | "refund";
export type InteractionStatus = "pending" | "completed" | "failed";

export interface Interaction {
  id: string;
  user: string;
  description: string;
  type: InteractionType;
  status: InteractionStatus;
  amount: number;
  createdAt: string;
}

/* ---------- MOCK DATA MELHORADO (10 USUÁRIOS ÚNICOS) ---------- */
const USERS = [
  "Leonel Helder",
  "Lanira Neves",
  "Eloa César",
  "Cristeen Patrick",
  "Elviess Rafael",
  "Rita de Cássia Costa",
  "José César",
  "Alberto da Costa César",
  "Henriqueta Bengui César",
  "Adão Domingos Gonçalves Costa",
];

const DESCRIPTIONS = [
  "Pagamento de fatura", "Assinatura mensal", "Reembolso solicitado", "Transferência entre contas",
  "Compra de créditos", "Pagamento de serviço", "Taxa de manutenção", "Depósito garantia",
  "Estorno de pagamento", "Comissão recebida", "Investimento realizado", "Resgate de investimento",
];

const TYPES: InteractionType[] = ["payment", "transfer", "refund"];
const STATUSES: InteractionStatus[] = ["pending", "completed", "failed"];

const mockInteractions: Interaction[] = Array.from({ length: 46 }).map((_, i) => {
  const user = USERS[i % USERS.length];
  const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const amount = Number((Math.random() * 2000 + 5).toFixed(2));
  const daysAgo = Math.floor(Math.random() * 90);
  return {
    id: `itx_${1000 + i}`,
    user,
    description: `${desc} #${i + 1}`,
    type,
    status,
    amount,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
});

export const formatDate = (iso: string | number | null | undefined): string => {
  if (!iso) return "";
  
  const date = typeof iso === "number" ? new Date(iso) : new Date(String(iso));
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-PT");
};

/* ---------- MODAL BASE ---------- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal = ({ isOpen, onClose, title, children, size = "md" }: ModalProps) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ---------- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (PROFISSIONAL) ---------- */
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  interactionDescription: string;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, interactionDescription, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Tem certeza que deseja excluir a interação <strong>{interactionDescription}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 dark:border-gray-700 dark:hover:bg-gray-800">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70">
            {isLoading && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- STATUS BADGE ---------- */
function StatusBadge({ status }: { status: InteractionStatus }) {
  const config = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    failed: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${config[status]}`}>
      {status}
    </span>
  );
}

/* ---------- FORMULÁRIO ---------- */
interface InteractionFormProps {
  initialData?: Partial<Interaction>;
  onSubmit: (data: Omit<Interaction, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const InteractionForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: InteractionFormProps) => {
  const [user, setUser] = useState(initialData?.user || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState<InteractionType>(initialData?.type || "payment");
  const [status, setStatus] = useState<InteractionStatus>(initialData?.status || "pending");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !description.trim()) return alert("Preencha usuário e descrição");
    onSubmit({
      user: user.trim(),
      description: description.trim(),
      type,
      status,
      amount: parseFloat(amount) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700">Usuário *</label>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Descrição *</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-700">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value as InteractionType)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2">
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as InteractionStatus)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Valor (€)</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="0.00" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70">
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

/* ---------- COMPONENTE PRINCIPAL ---------- */
export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | InteractionType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | InteractionStatus>("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState<Interaction | null>(null);
  const [viewItem, setViewItem] = useState<Interaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const viewDetailsRef = useRef<HTMLDivElement>(null);

  // Estados para exclusão profissional
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; description: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carregar dados
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setInteractions(mockInteractions);
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Toast automático
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filtros + ordenação
  const filtered = useMemo(() => {
    let list = [...interactions];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((it) => it.user.toLowerCase().includes(q) || it.description.toLowerCase().includes(q));
    if (typeFilter !== "all") list = list.filter((it) => it.type === typeFilter);
    if (statusFilter !== "all") list = list.filter((it) => it.status === statusFilter);
    switch (sortBy) {
      case "date_asc": list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "date_desc": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "amount_asc": list.sort((a, b) => a.amount - b.amount); break;
      case "amount_desc": list.sort((a, b) => b.amount - a.amount); break;
    }
    return list;
  }, [interactions, query, typeFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

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
      pageItems.forEach((it) => copy.add(it.id));
      return copy;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const archiveSelected = async () => {
    if (!selectedIds.size) return;
    setInteractions((prev) => prev.filter((it) => !selectedIds.has(it.id)));
    clearSelection();
    setToastMessage({ type: "success", text: "Interações arquivadas com sucesso!" });
  };
  const exportCSV = () => {
    if (!selectedIds.size) return;

    const rows = interactions.filter((it) => selectedIds.has(it.id));
    const csv = ["id,user,description,type,status,amount,createdAt", ...rows.map((r) => `${r.id},${r.user},"${r.description}",${r.type},${r.status},${r.amount},${r.createdAt}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `interactions_export_${Date.now()}.csv`;
    a.click();
    setToastMessage({ type: "success", text: "CSV exportado com sucesso!" });
  };

  // Exportar PDF individual
  const exportSinglePDF = async (interaction: Interaction) => {
    setIsExportingPDF(true);
    try {
      const element = document.createElement("div");
      element.style.width = "800px";
      element.style.padding = "20px";
      element.style.backgroundColor = "white";
      element.style.fontFamily = "sans-serif";
      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb;">FlowBanck</h1>
          <h2>Detalhes da Interação / Fatura</h2>
        </div>
        <div style="border-top: 2px solid #ccc; margin: 10px 0;"></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div><strong>ID:</strong> ${interaction.id}</div>
          <div><strong>Data:</strong> ${new Date(interaction.createdAt).toLocaleString("pt-PT")}</div>
          <div><strong>Usuário:</strong> ${interaction.user}</div>
          <div><strong>Tipo:</strong> ${interaction.type}</div>
          <div><strong>Status:</strong> ${interaction.status}</div>
          <div><strong>Valor:</strong> ${formatCurrency(interaction.amount)}</div>
          <div style="grid-column: span 2;"><strong>Descrição:</strong> ${interaction.description}</div>
        </div>
        <div style="border-top: 2px solid #ccc; margin-top: 20px; padding-top: 10px; text-align: center; font-size: 12px; color: #666;">
          Documento gerado automaticamente em ${new Date().toLocaleString("pt-PT")}
        </div>
      `;
      document.body.appendChild(element);
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
      document.body.removeChild(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      pdf.save(`fatura_${interaction.id}_${Date.now()}.pdf`);
      setToastMessage({ type: "success", text: "PDF gerado com sucesso!" });
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      setToastMessage({ type: "error", text: "Falha ao gerar PDF." });
    } finally {
      setIsExportingPDF(false);
    }
  };

  // CRUD
  const handleCreate = (data: Omit<Interaction, "id" | "createdAt">) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newItem: Interaction = { id: `itx_${Math.floor(Math.random() * 100000)}`, ...data, createdAt: new Date().toISOString() };
      setInteractions((prev) => [newItem, ...prev]);
      setShowCreateModal(false);
      setIsSubmitting(false);
      setToastMessage({ type: "success", text: "Interação criada com sucesso!" });
    }, 500);
  };

  const handleUpdate = (data: Omit<Interaction, "id" | "createdAt">) => {
    if (!editItem) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setInteractions((prev) => prev.map((it) => (it.id === editItem.id ? { ...it, ...data, createdAt: it.createdAt } : it)));
      setEditItem(null);
      setIsSubmitting(false);
      setToastMessage({ type: "success", text: "Interação atualizada!" });
    }, 500);
  };

  // Exclusão profissional
  const openDeleteModal = (id: string, description: string) => {
    setDeleteTarget({ id, description });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setInteractions((prev) => prev.filter((it) => it.id !== deleteTarget.id));
      setSelectedIds((prev) => {
        const copy = new Set(prev);
        copy.delete(deleteTarget.id);
        return copy;
      });
      setToastMessage({ type: "success", text: "Interação excluída com sucesso!" });
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      setToastMessage({ type: "error", text: "Erro ao excluir interação." });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg p-3 text-sm font-medium shadow-lg ${toastMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {toastMessage.text}
        </div>
      )}

      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Interações</h1>
          <p className="text-sm text-stone-500">Monitore e gerencie as interações dos usuários.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">+ Nova Interação</button>
      </header>

      {/* Filtros */}
      <section className="rounded-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Buscar por usuário ou descrição..." className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <div className="flex gap-3">
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as any); setPage(1); }} className="border border-stone-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">Todos os tipos</option>
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="refund">Refund</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }} className="border border-stone-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">Todos os status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border border-stone-300 rounded-lg px-3 py-2 text-sm">
          <option value="date_desc">Mais recentes</option>
          <option value="date_asc">Mais antigas</option>
          <option value="amount_desc">Maior valor</option>
          <option value="amount_asc">Menor valor</option>
        </select>
      </section>

      {/* Ações em massa */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button onClick={selectAllCurrentPage} className="text-sm px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Selecionar página</button>
          <button onClick={clearSelection} className="text-sm px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Limpar</button>
          <span className="text-sm text-stone-500">{selectedIds.size} selecionado(s)</span>
        </div>
        <div className="flex gap-2">
          <button onClick={archiveSelected} className="text-sm px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Arquivar</button>
          <button onClick={exportCSV} className="text-sm px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Exportar CSV</button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white shadow-sm rounded-md overflow-hidden border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
              <tr>
                <th className="p-3 w-8"><input type="checkbox" checked={pageItems.length > 0 && pageItems.every(it => selectedIds.has(it.id))} onChange={(e) => e.target.checked ? selectAllCurrentPage() : clearSelection()} /></th>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={8} className="p-6 text-center text-stone-500">Carregando...</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-stone-500">Nenhuma interação encontrada.</td></tr>
              ) : (
                pageItems.map((it) => (
                  <tr key={it.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 text-center"><input type="checkbox" checked={selectedIds.has(it.id)} onChange={() => toggleSelect(it.id)} /></td>
                    <td className="p-3 font-medium text-stone-800">{it.user}</td>
                    <td className="p-3 text-stone-600 truncate max-w-xs">{it.description}</td>
                    <td className="p-3 capitalize">{it.type}</td>
                    <td className="p-3"><StatusBadge status={it.status} /></td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(it.amount)}</td>
                    <td className="p-3 text-stone-500">{formatDate(it.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewItem(it)} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded">Ver</button>
                        <button onClick={() => setEditItem(it)} className="text-amber-600 hover:text-amber-800 text-xs px-2 py-1 border border-amber-200 rounded">Editar</button>
                        <button onClick={() => openDeleteModal(it.id, it.description)} className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-200 rounded">Excluir</button>
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
        <div className="text-sm text-stone-500">Mostrando {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Anterior</button>
          <span className="text-sm">Página</span>
          <input className="w-16 text-center border border-stone-300 rounded-lg px-2 py-1" value={page} onChange={(e) => { const v = Number(e.target.value); setPage(isNaN(v) ? 1 : Math.max(1, Math.min(totalPages, v))); }} />
          <span className="text-sm">de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border border-stone-300 rounded-lg hover:bg-stone-50">Próxima</button>
        </div>
      </footer>

      {/* Modais */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nova Interação">
        <InteractionForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Interação">
        {editItem && <InteractionForm initialData={editItem} onSubmit={handleUpdate} onCancel={() => setEditItem(null)} isSubmitting={isSubmitting} />}
      </Modal>

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Detalhes da Fatura" size="md">
        {viewItem && (
          <div>
            <div ref={viewDetailsRef} className="space-y-4 p-2">
              <div className="border-b pb-2"><h3 className="text-lg font-semibold text-center text-stone-800">FlowBanck - Fatura</h3></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="font-semibold text-stone-600">ID da Interação:</div><div className="text-stone-800 font-mono">{viewItem.id}</div>
                <div className="font-semibold text-stone-600">Usuário:</div><div className="text-stone-800">{viewItem.user}</div>
                <div className="font-semibold text-stone-600">Descrição:</div><div className="text-stone-800">{viewItem.description}</div>
                <div className="font-semibold text-stone-600">Tipo:</div><div className="capitalize text-stone-800">{viewItem.type}</div>
                <div className="font-semibold text-stone-600">Status:</div><div><StatusBadge status={viewItem.status} /></div>
                <div className="font-semibold text-stone-600">Valor:</div><div className="font-bold text-lg text-green-700">{formatCurrency(viewItem.amount)}</div>
                <div className="font-semibold text-stone-600">Data de emissão:</div><div>{new Date(viewItem.createdAt).toLocaleString("pt-PT")}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => exportSinglePDF(viewItem)} disabled={isExportingPDF} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70">
                {isExportingPDF ? "Gerando PDF..." : "📄 Exportar Fatura (PDF)"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmação de exclusão profissional */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        interactionDescription={deleteTarget?.description || ""}
        isLoading={deleteLoading}
      />
    </div>
  );
}