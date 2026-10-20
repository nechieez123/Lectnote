import type { Course, DemoAudioJob, DemoNotification, StudyNote } from '../types';

export const demoCourses: Course[] = [
  {
    id: 1,
    title: 'Introdução à Ciência da Computação',
    lessons: [
      { id: 11, courseId: 1, topic: 'Fundamentos de algoritmos', lessonDate: '2026-10-12' },
      { id: 12, courseId: 1, topic: 'Estruturas de dados', lessonDate: '2026-10-16' },
    ],
  },
  {
    id: 2,
    title: 'Bases de Dados',
    lessons: [
      { id: 21, courseId: 2, topic: 'Modelação relacional', lessonDate: '2026-10-14' },
      { id: 22, courseId: 2, topic: 'Normalização', lessonDate: '2026-10-19' },
    ],
  },
  {
    id: 3,
    title: 'Metodologia de Investigação',
    lessons: [{ id: 31, courseId: 3, topic: 'Formulação de perguntas', lessonDate: '2026-10-17' }],
  },
];

export const demoNotes: StudyNote[] = [
  {
    id: 101,
    lessonId: 11,
    title: 'Como decompor um problema',
    authorId: 1,
    authorName: 'Ana Silva',
    myPermission: 'author',
    createdAt: '2026-10-12T10:30:00Z',
    updatedAt: '2026-10-18T15:10:00Z',
    collaborators: [
      { userId: 2, fullName: 'Mateus Costa', permission: 'comment' },
      { userId: 3, fullName: 'Lia Fernandes', permission: 'read' },
    ],
    blocks: [
      {
        id: 1001,
        position: 1,
        content: 'Decompor é dividir um problema complexo em partes menores, independentes e mais fáceis de compreender.',
        isHighlighted: true,
        changedBy: 'Ana Silva',
        changedAt: '2026-10-18T15:10:00Z',
        comments: [
          { id: 1, authorId: 2, authorName: 'Mateus Costa', text: 'Este princípio também ajuda a planear os testes.', createdAt: '2026-10-18T15:25:00Z' },
        ],
      },
      {
        id: 1002,
        position: 2,
        content: 'Depois de resolver cada parte, os resultados são combinados para construir a solução completa.',
        isHighlighted: false,
        changedBy: 'Ana Silva',
        changedAt: '2026-10-16T09:40:00Z',
        comments: [],
      },
    ],
  },
  {
    id: 102,
    lessonId: 21,
    title: 'Entidades e relações',
    authorId: 1,
    authorName: 'Ana Silva',
    myPermission: 'author',
    createdAt: '2026-10-14T12:00:00Z',
    updatedAt: '2026-10-17T11:20:00Z',
    collaborators: [{ userId: 4, fullName: 'Rui Martins', permission: 'edit' }],
    blocks: [
      {
        id: 2001,
        position: 1,
        content: 'Uma entidade representa um conjunto de objetos com atributos comuns. A chave primária identifica cada ocorrência.',
        isHighlighted: false,
        changedBy: 'Ana Silva',
        changedAt: '2026-10-17T11:20:00Z',
        comments: [],
      },
    ],
  },
  {
    id: 103,
    lessonId: 22,
    title: 'Primeiras formas normais',
    authorId: 1,
    authorName: 'Ana Silva',
    myPermission: 'author',
    createdAt: '2026-10-19T08:15:00Z',
    updatedAt: '2026-10-19T08:15:00Z',
    collaborators: [],
    blocks: [
      {
        id: 3001,
        position: 1,
        content: 'A normalização organiza os dados para reduzir redundância e evitar anomalias de inserção, atualização e exclusão.',
        isHighlighted: true,
        changedBy: 'Ana Silva',
        changedAt: '2026-10-19T08:15:00Z',
        comments: [],
      },
    ],
  },
];

export const demoNotifications: DemoNotification[] = [
  { id: 501, type: 'TranscriptionCompleted', message: 'A transcrição de “Fundamentos de algoritmos” está pronta.', noteId: 101, isRead: false, createdAt: '2026-10-19T09:25:00Z' },
  { id: 502, type: 'NoteEdited', message: 'Mateus Costa comentou na nota “Como decompor um problema”.', noteId: 101, isRead: false, createdAt: '2026-10-18T15:25:00Z' },
  { id: 503, type: 'NoteEdited', message: 'Rui Martins atualizou “Entidades e relações”.', noteId: 102, isRead: true, createdAt: '2026-10-17T11:20:00Z' },
];

export const demoAudioJobs: DemoAudioJob[] = [
  { id: 901, lessonTitle: 'Fundamentos de algoritmos', fileName: 'aula-algoritmos-demo.mp3', status: 'Completed', createdAt: '2026-10-19T08:30:00Z', errorMessage: null },
  { id: 902, lessonTitle: 'Estruturas de dados', fileName: 'aula-estruturas-demo.wav', status: 'Pending', createdAt: '2026-10-19T10:15:00Z', errorMessage: null },
  { id: 903, lessonTitle: 'Normalização', fileName: 'aula-normalizacao-demo.m4a', status: 'Failed', createdAt: '2026-10-18T13:40:00Z', errorMessage: 'Falha simulada de demonstração.' },
];

export const demoStudent = {
  id: 1,
  fullName: 'Ana Silva',
  email: 'ana.silva@example.test',
  studyGroupName: 'Engenharia Informática · 2.º ano',
};
