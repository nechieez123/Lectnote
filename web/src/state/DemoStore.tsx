import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { demoCourses, demoNotifications, demoNotes } from '../data/demo';
import type { Course, DemoNotification, Lesson, NoteComment, StudyNote } from '../types';

interface DemoState {
  courses: Course[];
  notes: StudyNote[];
  notifications: DemoNotification[];
}

interface DemoStoreValue extends DemoState {
  addCourse: (title: string) => void;
  addLesson: (courseId: number, topic: string, lessonDate: string) => void;
  addNote: (lessonId: number, title: string) => number | null;
  updateBlock: (noteId: number, blockId: number, content: string, isHighlighted: boolean) => void;
  addComment: (noteId: number, blockId: number, text: string) => void;
  markNotificationRead: (notificationId: number) => void;
}

const STORAGE_KEY = 'lectnote.demo.v1';
const StoreContext = createContext<DemoStoreValue | null>(null);
const now = () => new Date().toISOString();
const createId = () => Date.now() + Math.floor(Math.random() * 1000);

function initialState(): DemoState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as DemoState;
  } catch {
    // Ignore corrupt or unavailable local storage and load the sample data.
  }
  return {
    courses: demoCourses,
    notes: demoNotes,
    notifications: demoNotifications,
  };
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // The app remains usable for the current browser session if storage is blocked.
    }
  }, [state]);

  const value = useMemo<DemoStoreValue>(() => ({
    ...state,
    addCourse: (title) => {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      setState((current) => ({
        ...current,
        courses: [...current.courses, { id: createId(), title: cleanTitle, lessons: [] }],
      }));
    },
    addLesson: (courseId, topic, lessonDate) => {
      const cleanTopic = topic.trim();
      if (!cleanTopic) return;
      const lesson: Lesson = { id: createId(), courseId, topic: cleanTopic, lessonDate };
      setState((current) => ({
        ...current,
        courses: current.courses.map((course) =>
          course.id === courseId ? { ...course, lessons: [...course.lessons, lesson] } : course,
        ),
      }));
    },
    addNote: (lessonId, title) => {
      const cleanTitle = title.trim();
      if (!cleanTitle) return null;
      const id = createId();
      const timestamp = now();
      const note: StudyNote = {
        id,
        lessonId,
        title: cleanTitle,
        authorId: 1,
        authorName: 'Ana Silva',
        myPermission: 'author',
        createdAt: timestamp,
        updatedAt: timestamp,
        collaborators: [],
        blocks: [],
      };
      setState((current) => ({ ...current, notes: [note, ...current.notes] }));
      return id;
    },
    updateBlock: (noteId, blockId, content, isHighlighted) => {
      const changedAt = now();
      setState((current) => ({
        ...current,
        notes: current.notes.map((note) => note.id !== noteId ? note : {
          ...note,
          updatedAt: changedAt,
          blocks: note.blocks.map((block) => block.id !== blockId ? block : {
            ...block,
            content,
            isHighlighted,
            changedBy: 'Ana Silva',
            changedAt,
          }),
        }),
      }));
    },
    addComment: (noteId, blockId, text) => {
      const cleanText = text.trim();
      if (!cleanText) return;
      const comment: NoteComment = {
        id: createId(),
        authorId: 1,
        authorName: 'Ana Silva',
        text: cleanText,
        createdAt: now(),
      };
      setState((current) => ({
        ...current,
        notes: current.notes.map((note) => note.id !== noteId ? note : {
          ...note,
          blocks: note.blocks.map((block) => block.id !== blockId ? block : {
            ...block,
            comments: [...block.comments, comment],
          }),
        }),
      }));
    },
    markNotificationRead: (notificationId) => {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      }));
    },
  }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDemoStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useDemoStore deve ser usado dentro de DemoStoreProvider.');
  return context;
}
