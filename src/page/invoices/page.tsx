import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiX,
} from "react-icons/fi";

import { Factura, getFacturas, updateFactura } from "./../../lib/fake-db";
import Modal from "./../../components/Modal/modal";

function Invoice() {
  const [data, setData] = useState<Factura[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "date-desc" | "date-asc" | "total-desc" | "total-asc"
  >("date-desc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "pending" | "late"
  >("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Factura | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const pageSize = 5;

  // Carregar facturas do mock
  useEffect(() => {
    setData(getFacturas());
  }, []);

  const isSkeleton = data.length === 0;

  // Dados processados (filtro, pesquisa, ordenação, paginação)
  const processed = useMemo(() => {
    if (!data) return [];

    let result = data.filter((f) => {
      const term = search.toLowerCase();

      return (
        String(f.id).includes(term) || f.client.toLowerCase().includes(term)
      );
    });

    if (statusFilter !== "all") {
      result = result.filter((f) => f.status === statusFilter);
    }

    result = result.sort((a, b) => {
      if (sort === "date-desc")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === "date-asc")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sort === "total-desc") return b.total - a.total;
      if (sort === "total-asc") return a.total - b.total;
      return 0;
    });

    return result.slice((page - 1) * pageSize, page * pageSize);
  }, [data, search, sort, statusFilter, page]);

  const totalPages = Math.ceil(
    data.filter((f) => statusFilter === "all" || f.status === statusFilter)
      .length / pageSize
  );

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Facturas</h2>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-stone-50">
          <FiSearch className="text-stone-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar factura ou cliente..."
            className="bg-transparent w-full focus:outline-none text-sm"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border rounded-xl px-3 py-2 text-sm bg-stone-50"
        >
          <option value="all">Todos os estados</option>
          <option value="paid">Pagas</option>
          <option value="pending">Pendentes</option>
          <option value="late">Atrasadas</option>
        </select>

        {/* Sort by date */}
        <button
          onClick={() =>
            setSort((prev) => (prev === "date-desc" ? "date-asc" : "date-desc"))
          }
          className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-stone-50 text-sm"
        >
          <FiFilter />
          {sort === "date-desc" ? (
            <span className="flex items-center gap-1">
              Data <FiArrowDown />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Data <FiArrowUp />
            </span>
          )}
        </button>

        {/* Sort by total */}
        <button
          onClick={() =>
            setSort((prev) =>
              prev === "total-desc" ? "total-asc" : "total-desc"
            )
          }
          className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-stone-50 text-sm"
        >
          Total
          {sort === "total-desc" ? <FiArrowDown /> : <FiArrowUp />}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-left">
            <tr>
              <th className="p-3">Factura</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>

          <tbody>
            {/* Skeleton */}
            {isSkeleton && (
              <>
                {[...Array(pageSize)].map((_, i) => (
                  <tr key={i} className="border-t animate-pulse">
                    <td className="p-3 bg-stone-100/60">&nbsp;</td>
                    <td className="p-3 bg-stone-100/60">&nbsp;</td>
                    <td className="p-3 bg-stone-100/60">&nbsp;</td>
                    <td className="p-3 bg-stone-100/60">&nbsp;</td>
                    <td className="p-3 bg-stone-100/60">&nbsp;</td>
                  </tr>
                ))}
              </>
            )}

            {/* Real rows */}
            {!isSkeleton &&
              processed.map((f) => (
                <motion.tr
                  layout
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className="border-t hover:bg-stone-50 cursor-pointer"
                >
                  <td className="p-3 font-medium">{f.id}</td>
                  <td className="p-3">{f.client}</td>

                  {/* Inline edit */}
                  <td className="p-3">
                    {editingId === f.id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        onBlur={() => {
                          updateFactura(f.id, { total: editValue });
                          setData(getFacturas());
                          setEditingId(null);
                        }}
                        className="border rounded px-2 py-1 text-sm w-24"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => {
                          setEditingId(f.id);
                          setEditValue(f.total);
                        }}
                      >
                        € {f.total.toFixed(2)}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${f.status === "paid" && "bg-green-100 text-green-700"}
                      ${
                        f.status === "pending" &&
                        "bg-yellow-100 text-yellow-700"
                      }
                      ${f.status === "late" && "bg-red-100 text-red-700"}
                    `}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3">{f.date}</td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-4 py-1">
          Página {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Factura {selected?.id}</h3>
          <button onClick={() => setSelected(null)}>✕</button>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Cliente:</strong> {selected?.client}
          </p>
          <p>
            <strong>Total:</strong> € {selected?.total.toFixed(2)}
          </p>
          <p>
            <strong>Estado:</strong> {selected?.status}
          </p>
          <p>
            <strong>Data:</strong> {selected?.date}
          </p>
          <p className="text-stone-500 text-xs">
            ID interno: {selected?.internalId || "-"}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setSelected(null)}
            className="px-3 py-1 border rounded"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Invoice;
