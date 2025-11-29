import { useState, useMemo, useEffect } from "react";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";

// --- STATUS BADGES ---
const statusStyles: Record<Status, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

// --- TYPE DEFINITIONS ---
type Status = "paid" | "pending" | "failed";

type TransactionItem = {
  id: string;
  name: string;
  avatar: string;
  sku: string;
  date: string;
  price: number;
  status: Status;
};

// --- CLIENT GENERATOR ---
const names = [
  "Adão Domingos Costa",
  "Henriqueta César",
  "Eloa César",
  "Patrick Neves Pio",
  "Rafael Neves Pio",
  "Esteveny Sofecia",
  "Alberto Costa César",
  "Lanira Neves",
  "Henriques Dionisio",
  "António Liquini",
];
const skus = ["Pro 1 Month", "Pro 4 Month", "Pro 8 Month"];
const statuses: Status[] = ["paid", "pending", "failed"];

const generateClients = (count: number): TransactionItem[] => {
  return Array.from({ length: count }, () => ({
    id: `#${Math.floor(10000 + Math.random() * 90000)}`,
    name: names[Math.floor(Math.random() * names.length)],
    avatar: `https://i.pravatar.cc/40?img=${Math.floor(
      1 + Math.random() * 70
    )}`,
    sku: skus[Math.floor(Math.random() * skus.length)],
    date: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(1 + Math.random() * 28)
    ).toISOString(),
    price: parseFloat((Math.random() * 20).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

// --- CONFIG ---
const ITEMS_PER_PAGE = 5; // pode ajustar conforme o design

const baseData = generateClients(50); // gera 50 clientes

// --- COMPONENTE ---
export default function RecentTransactions() {
  const [priceFilter, setPriceFilter] = useState<"all" | "low" | "high">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "new" | "old">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [priceFilter, dateFilter]);

  // --- FILTROS ---
  const filteredData = useMemo(() => {
    return baseData
      .filter((item) => {
        // Preço
        if (priceFilter === "low") return item.price < 5;
        if (priceFilter === "high") return item.price >= 5;
        return true;
      })
      .filter((item) => {
        // Data
        const itemDate = new Date(item.date);
        const cutoffDate = new Date("2024-06-01"); // referência para recent/old

        if (dateFilter === "new") return itemDate >= cutoffDate;
        if (dateFilter === "old") return itemDate < cutoffDate;
        return true;
      });
  }, [priceFilter, dateFilter]);

  // --- PAGINAÇÃO ---
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // --- TABLE HEADER ---
  const TableHeader = () => (
    <thead>
      <tr className="text-xs font-semibold text-stone-600 border-b border-stone-300">
        <th className="text-left p-2">Customer</th>
        <th className="text-left p-2">Plan</th>
        <th className="text-left p-2">Date</th>
        <th className="text-left p-2">Price</th>
        <th className="text-left p-2">Status</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );

  // --- TABLE ROW ---
  const TableRow = ({ item }: { item: TransactionItem }) => (
    <tr className="text-sm hover:bg-stone-200/40 transition-colors">
      <td className="p-2 flex items-center gap-2">
        <img
          src={item.avatar}
          className="w-8 h-8 rounded-full border border-stone-300"
          alt={item.name}
        />
        <div>
          <p className="font-semibold text-stone-800">{item.name}</p>
          <a
            href="#"
            className="text-violet-600 underline flex items-center gap-1 text-xs"
          >
            {item.id}
            <FiArrowUpRight />
          </a>
        </div>
      </td>

      <td className="p-2">
        <span className="px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-700 font-semibold">
          {item.sku}
        </span>
      </td>

      <td className="p-2 text-stone-600">
        {new Date(item.date).toLocaleDateString("en-US")}
      </td>

      <td className="p-2 font-semibold text-stone-800">${item.price}</td>

      <td className="p-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            statusStyles[item.status]
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="p-2">
        <button className="hover:bg-stone-300 rounded-md grid place-content-center transition-colors text-stone-700 w-8 h-8">
          <FiMoreHorizontal />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 bg-white">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium text-stone-800">
          <FiDollarSign />
          Recent Transactions
        </h3>
        <button className="text-sm text-violet-600 hover:underline font-medium">
          See All
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-4 text-sm">
        <select
          value={priceFilter}
          onChange={(e) =>
            setPriceFilter(e.target.value as "all" | "low" | "high")
          }
          className="px-3 py-2 text-sm rounded-lg border border-stone-300  bg-stone-100 text-stone-800 transition-all focus:outline-none focus:ring-2  focus:ring-violet-500 focus:border-violet-500 hover:bg-stone-200"
        >
          <option value="all">All Prices</option>
          <option value="low">Below $5</option>
          <option value="high">Above $5</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(e.target.value as "all" | "new" | "old")
          }
          className=" px-3 py-2 
              text-sm 
              rounded-lg
              border border-stone-300 
              bg-stone-100
              text-stone-800
              transition-all
              focus:outline-none 
              focus:ring-2 
              focus:ring-violet-500
              focus:border-violet-500
              hover:bg-stone-200"
        >
          <option value="all">All Dates</option>
          <option value="new">Recent (after Jun)</option>
          <option value="old">Older (before Jun)</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full table-auto">
        <TableHeader />
        <tbody>
          {paginatedData.map((item) => (
            <TableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>

      {/* PAGINAÇÃO */}
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-4 py-1 text-stone-700">
          Page {page} / {totalPages === 0 ? 1 : totalPages}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
