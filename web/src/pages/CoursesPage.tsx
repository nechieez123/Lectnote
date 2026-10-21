import { useState, type FormEvent } from 'react';
import { BookOpen, CalendarDays, Plus, PlusCircle } from 'lucide-react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useDemoStore } from '../state/DemoStore';

export default function CoursesPage() {
  const { courses, addCourse, addLesson } = useDemoStore();
  const [courseModal, setCourseModal] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState<number | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [lessonDate, setLessonDate] = useState(new Date().toISOString().slice(0, 10));

  const saveCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCourse(courseTitle);
    setCourseTitle('');
    setCourseModal(false);
  };

  const saveLesson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lessonCourseId === null) return;
    addLesson(lessonCourseId, topic, lessonDate);
    setTopic('');
    setLessonCourseId(null);
  };

  return (
    <>
      <PageHeader eyebrow="RF-02 · UC-02" title="Disciplinas e aulas" description="Organiza os conteúdos do teu grupo de estudo." action={<button className="button button-primary" onClick={() => setCourseModal(true)}><Plus size={17} />Nova disciplina</button>} />
      <div className="info-banner"><span className="info-banner-mark">i</span><p>Este espaço está em modo de demonstração. As alterações ficam apenas neste navegador e ainda não são enviadas à API.</p></div>
      {courses.length ? <div className="course-grid">{courses.map((course, index) => <article className="course-card" key={course.id}><div className={`course-card-top course-top-${(index % 3) + 1}`}><span className="course-card-icon"><BookOpen size={20} /></span><span className="course-count">{course.lessons.length} {course.lessons.length === 1 ? 'aula' : 'aulas'}</span></div><div className="course-card-body"><p className="section-eyebrow">DISCIPLINA</p><h2>{course.title}</h2><div className="course-lessons">{course.lessons.length ? course.lessons.map((lesson) => <div className="course-lesson" key={lesson.id}><span className="lesson-bullet" /><span>{lesson.topic}</span><time>{new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(new Date(`${lesson.lessonDate}T12:00:00`))}</time></div>) : <p className="inline-empty">Ainda sem aulas.</p>}</div><button className="course-add-lesson" onClick={() => setLessonCourseId(course.id)}><PlusCircle size={16} />Adicionar aula</button></div></article>)}</div> : <EmptyState icon={<BookOpen size={24} />} title="Ainda sem disciplinas" description="Cria uma disciplina para organizar as aulas do teu grupo." />}

      {courseModal && <Modal title="Nova disciplina" onClose={() => setCourseModal(false)}><form className="form-stack" onSubmit={saveCourse}><label className="field-label" htmlFor="course-title">Nome da disciplina</label><input id="course-title" className="text-input" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} placeholder="Ex.: Bases de Dados" required maxLength={200} /><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setCourseModal(false)}>Cancelar</button><button className="button button-primary"><Plus size={16} />Criar disciplina</button></div></form></Modal>}

      {lessonCourseId !== null && <Modal title="Adicionar aula" onClose={() => setLessonCourseId(null)}><form className="form-stack" onSubmit={saveLesson}><label className="field-label" htmlFor="lesson-course">Disciplina</label><select id="lesson-course" className="text-input" value={lessonCourseId} onChange={(event) => setLessonCourseId(Number(event.target.value))}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><label className="field-label" htmlFor="lesson-topic">Tema da aula</label><input id="lesson-topic" className="text-input" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ex.: Normalização" required maxLength={255} /><label className="field-label" htmlFor="lesson-date">Data</label><input id="lesson-date" className="text-input" type="date" value={lessonDate} onChange={(event) => setLessonDate(event.target.value)} required /><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setLessonCourseId(null)}>Cancelar</button><button className="button button-primary"><CalendarDays size={16} />Guardar aula</button></div></form></Modal>}
    </>
  );
}
