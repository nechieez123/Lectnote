import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock3, Eye, Highlighter, MessageCircle, Pencil, Send, Share2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import PermissionBadge from '../components/PermissionBadge';
import { useDemoStore } from '../state/DemoStore';
import type { NoteBlock } from '../types';

const formatDate = (value: string) => new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const { courses, notes, updateBlock, addComment } = useDemoStore();
  const note = notes.find((item) => item.id === Number(noteId));
  const lesson = note && courses.flatMap((course) => course.lessons.map((item) => ({ ...item, courseTitle: course.title }))).find((item) => item.id === note.lessonId);
  const canEdit = note?.myPermission === 'author' || note?.myPermission === 'edit';
  const canComment = canEdit || note?.myPermission === 'comment';
  const navigate = useNavigate();

  if (!note) return <><Link to="/notes" className="back-link"><ArrowLeft size={16} />Voltar às notas</Link><EmptyState icon={<Eye size={24} />} title="Nota não encontrada" description="Esta nota não existe nos dados de demonstração deste navegador." /></>;

  return (
    <>
      <Link to="/notes" className="back-link"><ArrowLeft size={16} />Todas as notas</Link>
      <PageHeader eyebrow={`UC-06 · UC-07 · ${lesson?.courseTitle ?? 'NOTA'}`} title={note.title} description={`${lesson?.topic ?? 'Aula'} · ${lesson?.courseTitle ?? 'Disciplina'}`} action={<><PermissionBadge permission={note.myPermission} /><button className="button button-outline" onClick={() => navigate('/sharing')}><Share2 size={16} />Partilha</button></>} />
      <div className="note-detail-meta"><span><Clock3 size={14} />Atualizada em {formatDate(note.updatedAt)}</span><span>Autora: {note.authorName}</span><span className="demo-inline-label">Conteúdo demonstrativo</span></div>
      <div className="editor-layout">
        <section className="editor-main">
          {note.blocks.length ? note.blocks.map((block) => <BlockEditor key={block.id} block={block} noteId={note.id} canEdit={Boolean(canEdit)} canComment={Boolean(canComment)} onSave={updateBlock} onComment={addComment} />) : <EmptyState icon={<Pencil size={23} />} title="Nota criada" description="A nota está ligada à aula. Os blocos aparecem aqui quando o fluxo UC-06 estiver implementado." />}
          <div className="editor-footnote"><span className="footnote-mark">i</span><p>A edição, os destaques e os comentários são guardados apenas nos dados de demonstração deste navegador.</p></div>
        </section>
        <aside className="editor-aside"><div className="surface-card aside-card"><p className="section-eyebrow">ESTRUTURA</p><h3>Nesta nota</h3>{note.blocks.map((block) => <a className="outline-row" href={`#block-${block.id}`} key={block.id}><span>{String(block.position).padStart(2, '0')}</span><span>{block.content.slice(0, 44)}{block.content.length > 44 ? '…' : ''}</span></a>)}<div className="aside-divider" /><div className="aside-stat"><strong>{note.blocks.length}</strong><span>blocos</span></div><div className="aside-stat"><strong>{note.blocks.reduce((sum, block) => sum + block.comments.length, 0)}</strong><span>comentários</span></div></div><div className="permission-help"><span><Eye size={15} /> Leitura</span><span><MessageCircle size={15} /> Comentário</span><span><Pencil size={15} /> Edição</span><small>As permissões reais são sempre validadas pelo backend.</small></div></aside>
      </div>
    </>
  );
}

function BlockEditor({ block, noteId, canEdit, canComment, onSave, onComment }: {
  block: NoteBlock;
  noteId: number;
  canEdit: boolean;
  canComment: boolean;
  onSave: (noteId: number, blockId: number, content: string, isHighlighted: boolean) => void;
  onComment: (noteId: number, blockId: number, text: string) => void;
}) {
  const [content, setContent] = useState(block.content);
  const [highlighted, setHighlighted] = useState(block.isHighlighted);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setContent(block.content); setHighlighted(block.isHighlighted); }, [block.content, block.isHighlighted]);

  const save = () => {
    onSave(noteId, block.id, content, highlighted);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComment(noteId, block.id, comment);
    setComment('');
  };

  return <article className={`block-card ${highlighted ? 'block-highlighted' : ''}`} id={`block-${block.id}`}><div className="block-heading"><span className="block-number">BLOCO {String(block.position).padStart(2, '0')}</span><div className="block-tools">{canEdit && <button className={`icon-button ${highlighted ? 'highlight-active' : ''}`} aria-label={highlighted ? 'Remover destaque' : 'Destacar bloco'} title={highlighted ? 'Remover destaque' : 'Destacar bloco'} onClick={() => setHighlighted((value) => !value)}><Highlighter size={16} /></button>}{canEdit && <button className="button button-small button-quiet" onClick={save}>{saved ? <Check size={15} /> : <Pencil size={14} />}{saved ? 'Guardado' : 'Guardar'}</button>}</div></div>{canEdit ? <textarea className="block-textarea" value={content} onChange={(event) => setContent(event.target.value)} rows={Math.max(3, Math.ceil(content.length / 72))} aria-label={`Conteúdo do bloco ${block.position}`} /> : <p className="block-readonly">{block.content}</p>}<div className="block-history"><span><Pencil size={13} />{block.changedBy}</span><span>·</span><span>{formatDate(block.changedAt)}</span></div><div className="comments-area"><div className="comments-title"><MessageCircle size={15} /><strong>Comentários</strong><span>{block.comments.length}</span></div>{block.comments.map((item) => <div className="comment-row" key={item.id}><span className="avatar avatar-tiny">{item.authorName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><p><strong>{item.authorName}</strong><span>{formatDate(item.createdAt)}</span></p><div className="comment-text">{item.text}</div></div></div>)}{canComment ? <form className="comment-form" onSubmit={submitComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreve um comentário…" aria-label="Escreve um comentário" required maxLength={2000} /><button className="send-button" aria-label="Enviar comentário" disabled={!comment.trim()}><Send size={15} /></button></form> : <p className="permission-hint">A tua permissão atual não permite comentar.</p>}</div></article>;
}
