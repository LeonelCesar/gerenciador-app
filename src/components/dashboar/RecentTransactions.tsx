import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import { useState, useMemo } from "react";

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

// Tipagem do status
type Status = "paid" | "pending" | "failed";

// Tipagem da transação
type TransactionItem = {
  id: string;
  name: string;
  avatar: string;
  sku: string;
  date: string;
  price: number;
  status: Status;
};

// Simulação de dados reais
const baseData: TransactionItem[] = [
  {
    id: "#48149",
    name: "Clinton Costa",
    avatar: "https://i.pravatar.cc/40?img=1",
    sku: "Pro 1 Month",
    date: "2024-12-03",
    price: 9.75,
    status: "paid",
  },
  {
    id: "#1942S",
    name: "Lanira Neves",
    avatar: "https://i.pravatar.cc/40?img=2",
    sku: "Pro 4 Month",
    date: "2024-08-02",
    price: 3.12,
    status: "pending",
  },
  {
    id: "#4192",
    name: "Esteveny Sofecia",
    avatar: "https://i.pravatar.cc/40?img=3",
    sku: "Pro 4 Month",
    date: "2024-07-01",
    price: 2.15,
    status: "failed",
  },
  {
    id: "#11330032",
    name: "Albert da Costa César",
    avatar: "https://i.pravatar.cc/40?img=4",
    sku: "Pro 1 Month",
    date: "2024-09-06",
    price: 5.75,
    status: "paid",
  },
  {
    id: "#99481",
    name: "Eloa César",
    avatar: "https://i.pravatar.cc/40?img=5",
    sku: "Pro 8 Month",
    date: "2024-03-09",
    price: 4.56,
    status: "paid",
  },
];

const ITEMS_PER_PAGE = 3;

function RecentTransactions() {
  const [priceFilter, setPriceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);

  // === FILTROS PRO ===
  const filteredData = useMemo(() => {
    return baseData
      .filter((item) => {
        if (priceFilter === "low") return item.price < 5;
        if (priceFilter === "high") return item.price >= 5;
        return true;
      })
      .filter((item) => {
        if (dateFilter === "new")
          return new Date(item.date) >= new Date("2024-06-01");
        if (dateFilter === "old")
          return new Date(item.date) < new Date("2024-06-01");
        return true;
      });
  }, [priceFilter, dateFilter]);

  // === PAGINAÇÃO PRO ===
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

  const TableRow = ({ item }: { item: any }) => (
    <tr className="text-sm hover:bg-stone-200/40 transition-colors">
      <td className="p-2 flex items-center gap-2">
        <img
          src={item.avatar}
          className="size-8 rounded-full border border-stone-300"
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
            statusStyles[item.status as keyof typeof statusStyles]
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="p-2">
        <button className="hover:bg-stone-300 rounded-md grid place-content-center transition-colors text-stone-700 size-8">
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

      {/* === FILTROS PRO === */}
      <div className="flex gap-4 mb-4 text-sm">
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border rounded p-1 text-sm"
        >
          <option value="all">All Prices</option>
          <option value="low">Below $5</option>
          <option value="high">Above $5</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded p-1 text-sm"
        >
          <option value="all">All Dates</option>
          <option value="new">Recent (after Jun)</option>
          <option value="old">Older (before Jun)</option>
        </select>
      </div>

      {/* === TABLE === */}
      <table className="w-full table-auto">
        <TableHeader />
        <tbody>
          {paginatedData.map((item) => (
            <TableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>

      {/* === PAGINAÇÃO === */}
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40 bg-violet-500"
        >
          Prev
        </button>

        <span className="px-4 py-1 text-stone-700">
          Page {page} / {totalPages === 0 ? 1 : totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40 bg-violet-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RecentTransactions;
