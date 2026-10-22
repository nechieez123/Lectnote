import { ArrowRight, BookOpenText, CalendarDays, CircleCheck, FilePlus2, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { demoStudent } from '../data/demo';
import { useDemoStore } from '../state/DemoStore';

const formatDate = (value: string) => new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(new Date(`${value}T12:00:00`));

export default function DashboardPage() {
  const { courses, notes, notifications } = useDemoStore();
  const unread = notifications.filter((item) => !item.isRead).length;
  const lessons = courses.flatMap((course) => course.lessons.map((lesson) => ({ ...lesson, courseTitle: course.title })))
    .sort((a, b) => a.lessonDate.localeCompare(b.lessonDate));
  const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="SEGUNDA-FEIRA, 19 DE OUTUBRO" title={`Bom estudo, ${demoStudent.fullName.split(' ')[0]}.`} description="O teu espaço de conhecimento está pronto para continuar." action={<Link to="/notes" className="button button-primary"><FilePlus2 size={17} />Nova nota</Link>} />

      <section className="welcome-card">
        <div className="welcome-copy"><span className="welcome-kicker"><Sparkles size={14} /> O TEU ESPAÇO DE ESTUDO</span><h2>Aprender fica mais fácil<br />quando as ideias se encontram.</h2><p>Reúne aulas, apontamentos e conversas num só lugar.</p><Link to="/courses" className="text-link text-link-light">Ver disciplinas <ArrowRight size={15} /></Link></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="book-illustration"><BookOpenText size={62} strokeWidth={1.1} /></div><span className="spark spark-a">✳</span><span className="spark spark-b">✦</span><span className="spark spark-c">·</span></div>
      </section>

      <div className="stat-grid">
        <article className="stat-card"><span className="stat-icon stat-lilac"><GraduationCap size={19} /></span><span className="stat-label">Disciplinas</span><strong>{courses.length.toString().padStart(2, '0')}</strong><small>no teu grupo de estudo</small></article>
        <article className="stat-card"><span className="stat-icon stat-peach"><BookOpenText size={18} /></span><span className="stat-label">Notas</span><strong>{notes.length.toString().padStart(2, '0')}</strong><small>apontamentos guardados</small></article>
        <article className="stat-card"><span className="stat-icon stat-green"><CircleCheck size={18} /></span><span className="stat-label">Por rever</span><strong>{unread.toString().padStart(2, '0')}</strong><small>notificações por ler</small></article>
      </div>

      <div className="dashboard-columns">
        <section className="surface-card">
          <div className="section-heading"><div><p className="section-eyebrow">CONTINUA DE ONDE FICASTE</p><h2>Notas recentes</h2></div><Link className="text-link" to="/notes">Ver todas <ArrowRight size={15} /></Link></div>
          {recentNotes.length ? <div className="recent-note-list">{recentNotes.map((note, index) => {
            const lesson = courses.flatMap((course) => course.lessons).find((item) => item.id === note.lessonId);
            const course = courses.find((item) => item.lessons.some((l) => l.id === note.lessonId));
            return <Link className="recent-note-row" to={`/notes/${note.id}`} key={note.id}><span className={`note-color note-color-${index + 1}`}><BookOpenText size={18} /></span><span className="recent-note-copy"><strong>{note.title}</strong><small>{course?.title ?? 'Disciplina'} · {lesson?.topic ?? 'Aula'}</small></span><span className="recent-note-date">{formatDate(note.updatedAt.slice(0, 10))}</span><ArrowRight className="row-arrow" size={16} /></Link>;
          })}</div> : <p className="inline-empty">Ainda não há notas neste espaço.</p>}
        </section>

        <section className="surface-card upcoming-card">
          <div className="section-heading"><div><p className="section-eyebrow">A SEGUIR</p><h2>Aulas</h2></div><CalendarDays size={19} className="muted-icon" /></div>
          {lessons.slice(0, 4).map((lesson) => <div className="lesson-row" key={lesson.id}><div className="lesson-date"><strong>{new Date(`${lesson.lessonDate}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('pt-PT', { month: 'short' }).format(new Date(`${lesson.lessonDate}T12:00:00`))}</span></div><div className="lesson-copy"><strong>{lesson.topic}</strong><small>{lesson.courseTitle}</small></div></div>)}
          {!lessons.length && <p className="inline-empty">Ainda não há aulas registadas.</p>}
        </section>
      </div>

      <section className="api-note"><span className="api-note-icon"><NetworkIcon /></span><p><strong>Ligação preparada para a API.</strong> O endpoint real `/api/hello` é consultado; os restantes dados desta experiência são de demonstração.</p><span className="api-note-label">HÍBRIDO</span></section>
    </>
  );
}

function NetworkIcon() {
  return <span className="network-glyph" aria-hidden="true">↗</span>;
}
