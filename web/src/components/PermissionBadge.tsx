import { Eye, MessageCircle, Pencil, ShieldCheck } from 'lucide-react';
import type { Permission } from '../types';

const labels: Record<Permission, string> = {
  author: 'Autora',
  read: 'Leitura',
  comment: 'Comentário',
  edit: 'Edição',
};

const icons = {
  author: ShieldCheck,
  read: Eye,
  comment: MessageCircle,
  edit: Pencil,
};

export default function PermissionBadge({ permission }: { permission: Permission }) {
  const Icon = icons[permission];
  return <span className={`permission-badge permission-${permission}`}><Icon size={13} />{labels[permission]}</span>;
}
