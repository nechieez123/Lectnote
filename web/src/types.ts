export type Permission = 'author' | 'read' | 'comment' | 'edit';
export type TranscriptionStatus = 'Pending' | 'Completed' | 'Failed';

export interface Lesson {
  id: number;
  courseId: number;
  topic: string;
  lessonDate: string;
}

export interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface NoteComment {
  id: number;
  authorId: number;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface NoteBlock {
  id: number;
  position: number;
  content: string;
  isHighlighted: boolean;
  changedBy: string;
  changedAt: string;
  comments: NoteComment[];
}

export interface NoteCollaborator {
  userId: number;
  fullName: string;
  permission: Exclude<Permission, 'author'>;
}

export interface StudyNote {
  id: number;
  lessonId: number;
  title: string;
  authorId: number;
  authorName: string;
  myPermission: Permission;
  createdAt: string;
  updatedAt: string;
  collaborators: NoteCollaborator[];
  blocks: NoteBlock[];
}

export interface DemoNotification {
  id: number;
  type: 'TranscriptionCompleted' | 'NoteEdited';
  message: string;
  noteId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface DemoAudioJob {
  id: number;
  lessonTitle: string;
  fileName: string;
  status: TranscriptionStatus;
  createdAt: string;
  errorMessage: string | null;
}

export interface HelloResponse {
  message: string;
  studyGroups: number;
}
