export type Member = {
  id: string;
  name: string;
  role?: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
};

type Props = {
  member: Member;
};

export default function TeamCard({ member }: Props) {
  if (!member) {
    return null; // ou um fallback visual
  }

  const {
    name = "Sem Nome",
    role = "Membro",
    email = "—",
    avatar,
    createdAt,
  } = member;

  const joined = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "Data indisponível";

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=7c3aed&color=fff&rounded=true`;

  return (
    <article className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <img
          src={avatar ?? fallbackAvatar}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
          onError={(e) => {
            // caso a imagem quebre, troca para fallback
            (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
          }}
        />

        <div className="min-w-0">
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          <p className="text-sm text-stone-500 truncate">{role}</p>
        </div>
      </div>

      <div className="mt-4 text-stone-600 text-sm space-y-1">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Joined:</strong> {joined}
        </p>
      </div>
    </article>
  );
}
