import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, User, Settings, LogOut, Shield, HelpCircle } from 'lucide-react';

interface AccountToggleProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const AccountToggle = ({ 
  user = {
    name: 'Leonel H.C César',
    email: 'leonelcesar62@gmail.com',
    role: 'CEO - LC FlowBanck',
    avatar: 'https://avatars.githubusercontent.com/u/149327611?v=4'
  },
  onLogout 
}: AccountToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4 mt-2 border-stone-200 pb-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-stone-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 object-cover shadow-md"
        />
        <div className="flex-1 text-left">
          <span className="block text-sm font-semibold text-stone-500 ">
            {user.name}
          </span>
          <span className="block text-xs text-stone-400 ">
            {user.email}
          </span>
          <span className="block text-xs text-stone-400 ">
            {user.role}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-stone-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-stone-400" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-stone-100 px-3 py-2">
            <p className="text-xs font-medium text-stone-500">Logado como</p>
            <p className="text-sm font-semibold text-stone-400 ">{user.email}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {/* navegar para perfil */}}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <User className="h-4 w-4" />
              Meu Perfil
            </button>
            <button
              onClick={() => {/* navegar para configurações */}}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </button>
            <button
              onClick={() => {/* navegar para ajuda */}}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <HelpCircle className="h-4 w-4" />
              Ajuda e Suporte
            </button>
            <hr className="my-1 border-stone-100 dark:border-stone-800" />
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else console.log('Logout');
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountToggle;