import { Eye, MessageCircle, Network, Pencil, ShieldAlert, UsersRound } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PermissionBadge from '../components/PermissionBadge';
import { useDemoStore } from '../state/DemoStore';

const permissionDescription = { read: 'Pode consultar a nota e os blocos.', comment: 'Pode consultar e comentar nos blocos.', edit: 'Pode consultar, comentar e editar os blocos.' };
const permissionIcon = { read: Eye, comment: MessageCircle, edit: Pencil };

export default function SharingPage() {
  const { notes } = useDemoStore();
  const notesWithCollaborators = notes.filter((note) => note.collaborators.length > 0);
  return <><PageHeader eyebrow="RF-08 · UC-08 · RN-06" title="Partilha e permissões" description="Consulta de exemplo das permissões associadas às notas." /><div className="decision-card"><span className="decision-icon"><ShieldAlert size={19} /></span><div><strong>Gestão de partilha em modo de leitura</strong><p>A decisão D-05 sobre o alcance da partilha ainda está pendente. Os dados abaixo são simulados; não é possível convidar ou remover pessoas nesta versão.</p></div><span className="decision-tag">PENDENTE</span></div>{notesWithCollaborators.length ? <div className="sharing-list">{notesWithCollaborators.map((note) => <section className="surface-card sharing-card" key={note.id}><div className="sharing-note-heading"><span className="note-color note-color-2"><Network size={17} /></span><div><p className="section-eyebrow">NOTA PARTILHADA · DEMO</p><h2>{note.title}</h2></div><span className="sharing-people"><UsersRound size={15} />{note.collaborators.length}</span></div><div className="collaborator-list">{note.collaborators.map((person) => { const Icon = permissionIcon[person.permission]; return <div className="collaborator-row" key={person.userId}><span className="avatar avatar-small">{person.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div className="collaborator-name"><strong>{person.fullName}</strong><small>{permissionDescription[person.permission]}</small></div><PermissionBadge permission={person.permission} /><Icon className="collaborator-permission-icon" size={16} /></div>; })}</div></section>)}</div> : <div className="surface-card empty-sharing"><UsersRound size={24} /><h3>Sem notas partilhadas</h3><p>As notas partilhadas no modo de demonstração aparecerão aqui.</p></div>}</>;
}
