import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  AudioLines,
  Bell,
  BookOpenCheck,
  BookOpenText,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Network,
  UserRound,
  X,
} from 'lucide-react';
import { useDemoStore } from '../state/DemoStore';
import { getHello } from '../api/client';
import type { HelloResponse } from '../types';

const links = [
  { to: '/', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/courses', label: 'Disciplinas', icon: GraduationCap },
  { to: '/notes', label: 'Notas', icon: BookOpenText },
  { to: '/audio', label: 'Áudio e transcrições', icon: AudioLines },
  { to: '/sharing', label: 'Partilha', icon: Network },
  { to: '/notifications', label: 'Notificações', icon: Bell },
];

const titleByPath: Record<string, string> = {
  '/': 'Visão geral',
  '/courses': 'Disciplinas e aulas',
  '/notes': 'As minhas notas',
  '/audio': 'Áudio e transcrições',
  '/sharing': 'Partilha e permissões',
  '/notifications': 'Notificações',
};

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hello, setHello] = useState<{ data?: HelloResponse; error?: string; loading: boolean }>({ loading: true });
  const location = useLocation();
  const { notifications } = useDemoStore();
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const pageTitle = location.pathname.startsWith('/notes/') ? 'Nota' : titleByPath[location.pathname] ?? 'Lectnote';

  useEffect(() => {
    let current = true;
    getHello()
      .then((data) => current && setHello({ data, loading: false }))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'API indisponível';
        if (current) setHello({ error: message, loading: false });
      });
    return () => { current = false; };
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="app-frame">
      {menuOpen && <button className="mobile-scrim" aria-label="Fechar navegação" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <span className="brand-mark"><BookOpenCheck size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">lectnote<span>.</span></span>
          <button className="icon-button sidebar-close" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <div className="workspace-label">ESPAÇO DE ESTUDO</div>
        <nav className="primary-nav" aria-label="Navegação principal">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {to === '/notifications' && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="study-group-card">
            <div className="group-icon"><GraduationCap size={17} /></div>
            <div><small>O MEU GRUPO</small><strong>Engenharia Informática</strong><span>2.º ano · Turma A</span></div>
          </div>
          <NavLink to="/login" className="profile-link">
            <span className="avatar avatar-small">AS</span>
            <span className="profile-copy"><strong>Ana Silva</strong><small>Estudante · modo demo</small></span>
            <ChevronRight size={16} />
          </NavLink>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Lectnote</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <span className="demo-pill"><span className="demo-dot" /> Modo demonstração</span>
            <NavLink to="/notifications" className="top-icon-link" aria-label={`Notificações, ${unreadCount} por ler`}>
              <Bell size={19} />{unreadCount > 0 && <span className="notification-dot" />}
            </NavLink>
            <NavLink to="/login" className="top-avatar" aria-label="Conta de demonstração"><UserRound size={17} /></NavLink>
          </div>
        </header>

        <div className="demo-notice">
          <span className="notice-icon"><Network size={15} /></span>
          <span><strong>Ambiente de demonstração.</strong> As alterações ficam guardadas neste navegador; só a verificação da API é real.</span>
          <span className={`api-status ${hello.loading ? 'api-status-loading' : hello.data ? 'api-status-online' : 'api-status-offline'}`} title={hello.error}>
            <span />{hello.loading ? 'A verificar API' : hello.data ? 'API ligada' : 'API indisponível'}
          </span>
        </div>
        <div className="page-content"><Outlet /></div>
        <footer className="app-footer"><span>Lectnote · plataforma de conhecimento académico</span><span>Dados de demonstração</span></footer>
      </main>
    </div>
  );
}
