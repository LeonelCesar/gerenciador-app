import { useMemo } from "react";

export function useFilteredTeam(team: any[], search: string, sort: string) {
  return useMemo(() => {
    let filtered = team;

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(lower)
      );
    }

    if (sort === "az") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "za") {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sort === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [team, search, sort]);
}
