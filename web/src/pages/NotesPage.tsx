import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpenText, FilePlus2, Plus, Sparkles } from 'lucide-react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import PermissionBadge from '../components/PermissionBadge';
import { useDemoStore } from '../state/DemoStore';

export default function NotesPage() {
  const { courses, notes, addNote } = useDemoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const firstLesson = courses.flatMap((course) => course.lessons)[0];
  const [lessonId, setLessonId] = useState<number>(firstLesson?.id ?? 0);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const lessons = courses.flatMap((course) => course.lessons.map((lesson) => ({ ...lesson, courseTitle: course.title })));

  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = addNote(lessonId, title);
    if (id) navigate(`/notes/${id}`);
  };

  const openModal = () => {
    setLessonId(lessons[0]?.id ?? 0);
    setModalOpen(true);
  };

  return (
    <>
      <PageHeader eyebrow="RF-03 · UC-03" title="As minhas notas" description="Apontamentos ligados às aulas do teu grupo." action={<button className="button button-primary" onClick={openModal}><FilePlus2 size={17} />Criar nota</button>} />
      <div className="info-banner"><span className="info-banner-mark">i</span><p>As notas abaixo são dados demonstrativos guardados localmente neste browser.</p></div>
      {notes.length ? <div className="notes-grid">{notes.map((note, index) => {
        const lesson = lessons.find((item) => item.id === note.lessonId);
        return <article className="note-card" key={note.id}><div className={`note-card-cover cover-${(index % 4) + 1}`}><span className="cover-shape cover-shape-a" /><span className="cover-shape cover-shape-b" /><BookOpenText className="cover-book" size={27} strokeWidth={1.5} /><span className="note-card-blocks">{note.blocks.length.toString().padStart(2, '0')} blocos</span></div><div className="note-card-content"><div className="note-card-meta"><span>{lesson?.courseTitle ?? 'Disciplina'}</span><PermissionBadge permission={note.myPermission} /></div><h2>{note.title}</h2><p className="note-card-lesson">{lesson?.topic ?? 'Aula'}</p><p className="note-excerpt">{note.blocks[0]?.content ?? 'Nota recém-criada, pronta para receber conteúdo.'}</p><div className="note-card-footer"><span className="avatar avatar-tiny">AS</span><span>Atualizada em {new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(new Date(note.updatedAt))}</span><button className="round-link" aria-label={`Abrir nota ${note.title}`} onClick={() => navigate(`/notes/${note.id}`)}><ArrowUpRight size={17} /></button></div></div></article>;
      })}</div> : <EmptyState icon={<BookOpenText size={24} />} title="As tuas notas começam aqui" description="Cria uma nota para uma aula e organiza as ideias em blocos." />}
      {modalOpen && <Modal title="Criar uma nota" onClose={() => setModalOpen(false)}><form className="form-stack" onSubmit={saveNote}><p className="form-help">Escolhe uma aula e dá um título ao apontamento.</p><label className="field-label" htmlFor="note-lesson">Aula</label><select id="note-lesson" className="text-input" value={lessonId} onChange={(event) => setLessonId(Number(event.target.value))} required disabled={!lessons.length}>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.courseTitle} · {lesson.topic}</option>)}</select><label className="field-label" htmlFor="note-title">Título</label><input id="note-title" className="text-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Ideias principais da aula" required maxLength={255} /><div className="modal-note"><Sparkles size={15} /> Esta ação é demonstrativa; a API de notas ainda não está implementada.</div><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button button-primary" disabled={!lessons.length}><Plus size={16} />Criar nota</button></div></form></Modal>}
    </>
  );
}
