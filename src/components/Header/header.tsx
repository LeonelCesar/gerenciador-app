import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

type HeaderProps = {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  locale?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
};

export default function Header({
  userName = "Leonel Helder Costa César",
  userEmail = "leonelcesar62@gmail.com",
  userAvatar,
  locale = "pt-PT",
  showSearch = true,
  onSearch,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "Nova fatura criada", time: "há 5 min", read: false },
    { id: 2, title: "Pagamento recebido", time: "há 1 hora", read: false },
    { id: 3, title: "Cliente adicionado", time: "há 3 horas", read: true },
  ]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fechar modais ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const now = new Date();
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-100 border-b border-stone-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo / Nome da empresa */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <span className="font-semibold text-stone-500 text-lg hidden sm:inline">
              Gestão de Faturas
            </span>
          </div>
        </div>

        {/* Saudação e data (centralizado) */}
        <div className="hidden md:block text-center">
          <p className="text-sm font-medium text-stone-500">
            Olá, <span className="font-semibold text-stone-500">{userName}</span>
          </p>
          <p className="text-xs text-stone-400 capitalize">{date}</p>
        </div>

        {/* Ações direitas: busca, notificações, perfil */}
        <div className="flex items-center gap-2">
          {/* Busca */}
          {showSearch && (
            <div ref={searchRef} className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-stone-200 p-2 z-20">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar faturas, clientes..."
                      className="flex-1 outline-none text-sm text-stone-700 bg-transparent"
                      autoFocus
                    />
                    <button type="submit" className="text-xs text-blue-600 hover:text-blue-700">
                      Buscar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Notificações */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-stone-100"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-stone-100">
                  <h3 className="font-semibold text-stone-500">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-stone-500 text-sm">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-stone-50 transition-colors cursor-pointer ${
                          !notif.read ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <p className="text-sm font-medium text-stone-400">{notif.title}</p>
                        <p className="text-xs text-stone-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-stone-100 text-center">
                  <button
                    onClick={onNotificationClick}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu do usuário */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-200 transition-colors"
              aria-label="Menu do usuário"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-stone-300"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-stone-500 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-sm font-semibold text-stone-500">{userName}</p>
                  <p className="text-xs text-stone-400">{userEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-400 hover:bg-stone-50 transition-colors"
                  >
                    <User className="h-4 w-4" /> Perfil
                  </button>
                  <button
                    onClick={() => {
                      onSettingsClick?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-400 hover:bg-stone-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" /> Configurações
                  </button>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile (sidebar simplificada) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-stone-100 border-r border-stone-200 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-stone-800 text-lg">FlowBanck</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-stone-500 hover:bg-stone-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-2">
              <a href="/dashboard" className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-200">Dashboard</a>
              <a href="/invoices" className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-200">Faturas</a>
              <a href="/clients" className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-200">Clientes</a>
              <a href="/services" className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-200">Serviços</a>
              <a href="/team" className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-200">Equipe</a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
