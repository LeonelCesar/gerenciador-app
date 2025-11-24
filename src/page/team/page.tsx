import { useState, useEffect } from "react";
import TeamFilterBar from "./TeamFilterBar";
import { TeamList } from "./TeamList";
/* import axios from "axios"; */

// Tipagem do membro
type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  createdAt: string;
};

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [teamData, setTeamData] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulação de API (você pode trocar pelo seu endpoint real)
  useEffect(() => {
    async function fetchTeam() {
      try {
        setIsLoading(true);
        setError(null);

    
        // Mock de dados
        const mockData: Member[] = [
          {
            id: "1",
            name: "Leonel Helder",
            role: "Front-End Developer",
            email: "leonel@example.com",
            avatar: "https://i.pravatar.cc/150?img=1",
            createdAt: "2025-05-10",
          },
          {
            id: "2",
            name: "Eloa César",
            role: "UI/UX Designer",
            email: "madalena@example.com",
            avatar: "https://i.pravatar.cc/150?img=2",
            createdAt: "2025-02-20",
          },
          {
            id: "3",
            name: "Adão Costa",
            role: "Backend Developer",
            email: "carlos@example.com",
            avatar: "https://i.pravatar.cc/150?img=3",
            createdAt: "2025-03-15",
          },
          {
            id: "4",
            name: "Alberto César",
            role: "QA Engineer",
            email: "ana@example.com",
            avatar: "https://i.pravatar.cc/150?img=4",
            createdAt: "2025-04-01",
          },
          {
            id: "5",
            name: "Henriqueta César",
            role: "DevOps Engineer",
            email: "joao@example.com",
            avatar: "https://i.pravatar.cc/150?img=5",
            createdAt: "2025-01-12",
          },
          {
            id: "6",
            name: "Esteveny Sofecia",
            role: "DevOps Engineer",
            email: "joao@example.com",
            avatar: "https://i.pravatar.cc/150?img=5",
            createdAt: "2025-01-12",
          },
        ];

        // Simula delay
        setTimeout(() => {
          setTeamData(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Falha ao carregar membros da equipe.");
        setIsLoading(false);
      }
    }

    fetchTeam();
  }, []);

  // Filtrar e ordenar
  const filteredTeam = teamData
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "recent")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Equipe</h1>

      <TeamFilterBar
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <TeamList team={filteredTeam} isLoading={isLoading} />
      )}
    </div>
  );
}
