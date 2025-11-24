 import  TeamCard  from "./TeamCard"; 

type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  createdAt: string;
};

type TeamListProps = {
  team: Member[];
  isLoading: boolean;
};

export function TeamList({ team, isLoading }: TeamListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse border rounded-xl p-4 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!team || team.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm mt-12">
        No team members found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {team.map((m) => (
        <TeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}
