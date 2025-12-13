// InteractionsPage.tsx
import { useEffect, useMemo, useState, FormEvent } from "react";
import { formatCurrency } from "../../utils/formatters";

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
  createdAt: string; // ISO
}

/*  MOCK INTERACTIONS  */

const mockInteractions: Interaction[] = Array.from({ length: 46 }).map(
  (_, i) => {
    const types: InteractionType[] = ["payment", "transfer", "refund"];
    const statuses: InteractionStatus[] = ["pending", "completed", "failed"];
    const amount = Number((Math.random() * 2000 + 5).toFixed(2));
    const daysAgo = Math.floor(Math.random() * 60);

    return {
      id: `itx_${1000 + i}`,
      user: ["Leonel Helder", "Lanira Neves", "Eloa César", "Cristeen Patrick", "Elviess Rafael", "Alberto da Costa"][i % 5],
      description: `Interaction ${i + 1} - ${
        [
          "Invoice paid",
          "Subscription",
          "Refund issued",
          "Transfer to savings",
        ][i % 4]
      }`,
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      amount,
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    };
  }
);

/* SAFE DATE FORMATTER */

export const formatDate = (iso: string | number | null | undefined): string => {
  if (!iso) return "";

  const date = typeof iso === "number" ? new Date(iso) : new Date(String(iso));

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-PT");
};

/* MAIN COMPONENT PAGE */
export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<"all" | InteractionType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | InteractionStatus>(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "amount_desc" | "amount_asc"
  >("date_desc");

  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerItem, setDrawerItem] = useState<Interaction | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  /* FETCH */

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setInteractions(mockInteractions);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  /* FILTER + SEARCH + SORT */

  const filtered = useMemo(() => {
    let list = [...interactions];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (it) =>
          it.user.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all")
      list = list.filter((it) => it.type === typeFilter);
    if (statusFilter !== "all")
      list = list.filter((it) => it.status === statusFilter);

    switch (sortBy) {
      case "date_asc":
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "date_desc":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "amount_asc":
        list.sort((a, b) => a.amount - b.amount);
        break;
      case "amount_desc":
        list.sort((a, b) => b.amount - a.amount);
        break;
    }

    return list;
  }, [interactions, query, typeFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  /*  SELECTION  */

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

  /* BULK ACTIONS  */

  const archiveSelected = async () => {
    if (!selectedIds.size) return;

    const ids = [...selectedIds];
    setInteractions((prev) => prev.filter((it) => !ids.includes(it.id)));

    clearSelection();

    await new Promise((r) => setTimeout(r, 350)); // simulate request
  };

  const exportSelected = () => {
    if (!selectedIds.size) return;

    const rows = interactions.filter((it) => selectedIds.has(it.id));

    const csv = [
      "id,user,description,type,status,amount,createdAt",
      ...rows.map(
        (r) =>
          `${r.id},${r.user},"${r.description}",${r.type},${r.status},${r.amount},${r.createdAt}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `interactions_export_${Date.now()}.csv`;
    a.click();
  };

  /*  DRAWER  */

  const openDrawer = (it: Interaction) => setDrawerItem(it);
  const closeDrawer = () => setDrawerItem(null);

  /* CREATE ITEM */

  interface CreatePayload {
    user: string;
    description: string;
    type: InteractionType;
    status: InteractionStatus;
    amount: number;
  }

  const handleCreate = (payload: CreatePayload) => {
    const newItem: Interaction = {
      id: `itx_${Math.floor(Math.random() * 100000)}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    setInteractions((prev) => [newItem, ...prev]);
    setShowCreateModal(false);
  };

  /* RENDERING */

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Interactions</h1>
          <p className="text-sm text-slate-500">
            Monitor and manage user interactions on FlowBank.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-700"
        >
          New Interaction
        </button>
      </header>

      {/* CONTROLS */}
      <section className="bg-white p-4 rounded-md shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by user or description..."
          className="border rounded px-3 py-2 w-full text-sm"
        />

        <div className="flex gap-2 items-center">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as any);
              setPage(1);
            }}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="all">All types</option>
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="refund">Refund</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded px-2 py-2 text-sm"
        >
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
          <option value="amount_desc">Amount (High → Low)</option>
          <option value="amount_asc">Amount (Low → High)</option>
        </select>
      </section>

      {/* BULK ACTIONS */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={selectAllCurrentPage}
            className="text-sm px-2 py-1 border rounded"
          >
            Select page
          </button>
          <button
            onClick={clearSelection}
            className="text-sm px-2 py-1 border rounded"
          >
            Clear
          </button>
          <span className="text-sm text-slate-500">
            {selectedIds.size} selected
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={archiveSelected}
            className="text-sm px-3 py-1 border rounded"
          >
            Archive
          </button>
          <button
            onClick={exportSelected}
            className="text-sm px-3 py-1 border rounded"
          >
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((it) => selectedIds.has(it.id))
                  }
                  onChange={(e) =>
                    e.target.checked ? selectAllCurrentPage() : clearSelection()
                  }
                />
              </th>
              <th className="p-3">User</th>
              <th className="p-3">Description</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  No interactions found.
                </td>
              </tr>
            ) : (
              pageItems.map((it) => (
                <tr key={it.id} className="border-t text-sm">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(it.id)}
                      onChange={() => toggleSelect(it.id)}
                    />
                  </td>

                  <td className="p-3 font-medium">{it.user}</td>
                  <td className="p-3 text-slate-600">{it.description}</td>
                  <td className="p-3">{it.type}</td>

                  <td className="p-3">
                    <StatusBadge status={it.status} />
                  </td>

                  <td className="p-3 text-right font-medium">
                    {formatCurrency(it.amount)}
                  </td>

                  <td className="p-3">{formatDate(it.createdAt)}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDrawer(it)}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          setInteractions((prev) =>
                            prev.filter((p) => p.id !== it.id)
                          )
                        }
                        className="text-sm px-2 py-1 border rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <footer className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-500">
          Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <div className="px-3">Page</div>

          <input
            className="w-16 text-center border rounded px-2 py-1"
            value={page}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPage(isNaN(v) ? 1 : Math.max(1, Math.min(totalPages, v)));
            }}
          />

          <div>of {totalPages}</div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </footer>

      {/* DRAWER */}
      {drawerItem && (
        <InteractionDrawer item={drawerItem} onClose={closeDrawer} />
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <CreateInteractionModal
          onCreate={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

/* PRESENTATIONAL COMPONENTS  */

function StatusBadge({ status }: { status: InteractionStatus }) {
  const cls =
    {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }[status] || "bg-slate-100 text-slate-800";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function InteractionDrawer({
  item,
  onClose,
}: {
  item: Interaction;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex">
      <div className="ml-auto w-full md:w-2/5 bg-white h-full p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Interaction Details</h2>
          <button onClick={onClose} className="px-2 py-1 border rounded">
            Close
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">ID</dt>
            <dd className="font-mono">{item.id}</dd>
          </div>

          <div>
            <dt className="text-slate-500">User</dt>
            <dd>{item.user}</dd>
          </div>

          <div>
            <dt className="text-slate-500">Description</dt>
            <dd>{item.description}</dd>
          </div>

          <div>
            <dt className="text-slate-500">Type</dt>
            <dd>{item.type}</dd>
          </div>

          <div>
            <dt className="text-slate-500">Status</dt>
            <dd>
              <StatusBadge status={item.status} />
            </dd>
          </div>

          <div>
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-medium">{formatCurrency(item.amount)}</dd>
          </div>

          <div>
            <dt className="text-slate-500">Created</dt>
            <dd>{new Date(item.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function CreateInteractionModal({
  onCreate,
  onCancel,
}: {
  onCreate: (data: {
    user: string;
    description: string;
    type: InteractionType;
    status: InteractionStatus;
    amount: number;
  }) => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="bg-white rounded-md shadow-lg p-6 z-10 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Create Interaction</h3>
        <CreateInteractionForm onCreate={onCreate} onCancel={onCancel} />
      </div>
    </div>
  );
}

function CreateInteractionForm({
  onCreate,
  onCancel,
}: {
  onCreate: (data: {
    user: string;
    description: string;
    type: InteractionType;
    status: InteractionStatus;
    amount: number;
  }) => void;
  onCancel: () => void;
}) {
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<InteractionType>("payment");
  const [status, setStatus] = useState<InteractionStatus>("pending");
  const [amount, setAmount] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !description) return alert("Provide user and description");

    onCreate({
      user,
      description,
      type,
      status,
      amount: Number(amount) || 0,
    });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-sm text-slate-600">User</label>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as InteractionType)}
          className="border rounded px-2 py-2"
        >
          <option value="payment">Payment</option>
          <option value="transfer">Transfer</option>
          <option value="refund">Refund</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as InteractionStatus)}
          className="border rounded px-2 py-2"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-2 py-2"
          placeholder="Amount"
        />
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-3 py-2 bg-indigo-600 text-white rounded"
        >
          Create
        </button>
      </div>
    </form>
  );
}
