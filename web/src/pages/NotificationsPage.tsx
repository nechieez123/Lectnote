import { Bell, Check, CheckCheck, MessageCircle, Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useDemoStore } from '../state/DemoStore';

const formatDate = (value: string) => new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useDemoStore();
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  return <><PageHeader eyebrow="RF-10 · RF-11 · RF-12 · UC-10" title="Notificações" description="Atividade recente nas tuas aulas e notas." action={unreadCount > 0 ? <span className="unread-counter">{unreadCount} por ler</span> : <span className="all-read-label"><CheckCheck size={15} />Tudo lido</span>} />{notifications.length ? <div className="surface-card notification-card"><div className="notification-list">{notifications.map((item) => { const Icon = item.type === 'TranscriptionCompleted' ? Mic2 : MessageCircle; const note = item.noteId; return <article className={`notification-row ${item.isRead ? '' : 'notification-unread'}`} key={item.id}><span className={`notification-type-icon ${item.type === 'TranscriptionCompleted' ? 'notification-audio' : 'notification-comment'}`}><Icon size={17} /></span><div className="notification-copy"><p>{item.message}</p><time>{formatDate(item.createdAt)}</time>{note && <Link to={`/notes/${note}`} className="notification-open">Abrir nota</Link>}</div>{!item.isRead && <button className="mark-read-button" onClick={() => markNotificationRead(item.id)} aria-label="Marcar como lida" title="Marcar como lida"><Check size={16} /></button>}<span className={`unread-indicator ${item.isRead ? 'indicator-hidden' : ''}`} /> </article>; })}</div><div className="notification-footnote"><Bell size={14} />Notificações e alterações são apenas dados de demonstração neste navegador.</div></div> : <EmptyState icon={<Bell size={24} />} title="Tudo em dia" description="Quando houver atividade, as notificações serão apresentadas aqui." />}</>;
}
