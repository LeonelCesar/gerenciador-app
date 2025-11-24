export type TeamFilterBarProps = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

export default function TeamFilterBar({ search, setSearch, sort, setSort }: TeamFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Pesquisar membro da equipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 border rounded px-3 py-2 bg-slate-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition"
        />
      </div>

      {/* Sort Select */}
      <div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition"
        >
          <option value="recent">Mais recentes</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>
    </div>
  );
}