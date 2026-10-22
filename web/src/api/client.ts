export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'lectnote.auth.token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string | null) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = 'ApiError'; }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_BASE}/api${path}`, { ...options, headers }); }
  catch { throw new ApiError('Não foi possível ligar à API Lectnote. Verifica se o backend está ativo.', 0); }
  if (response.status === 204) return undefined as T;
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
<<<<<<< HEAD
    if (response.status === 401) {
      setToken(null);
      window.dispatchEvent(new CustomEvent('lectnote:session-expired'));
    }
=======
>>>>>>> 937c6a0 (feat: implement complete backend API)
    const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
      ? body.error : response.status === 404 ? 'Endpoint não encontrado no backend. Confirma a implementação da API.' : `Erro da API (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export interface StudyGroup { id: number; name: string }
export interface User { id: number; fullName: string; email?: string; studyGroupId: number }
export interface Course { id: number; title: string }
export interface Lesson { id: number; courseId: number; topic: string; lessonDate: string }
export interface NoteSummary { id: number; lessonId: number; title: string; authorId: number; myPermission: 'author'|'read'|'comment'|'edit'; updatedAt: string }
export interface Note extends NoteSummary { createdAt: string }
export interface Block { id: number; position: number; content: string; isHighlighted: boolean; changedBy: number; changedAt: string }
export interface Comment { id: number; authorId: number; authorName: string; text: string; createdAt: string }
export interface Collaborator { userId: number; fullName: string; permission: 'read'|'comment'|'edit' }
export interface Notification { id: number; type: string; message: string; noteId?: number; isRead: boolean; createdAt: string }
export interface Job { id: number; audioRecordingId: number; status: 'Pending'|'Completed'|'Failed'; errorMessage: string|null; createdAt: string; finishedAt?: string; transcriptionId?: number }
export const endpoints = {
  hello: () => api<{message:string;studyGroups:number}>('/hello'),
  groups: () => api<StudyGroup[]>('/study-groups'),
  register: (data:{fullName:string;email:string;password:string;studyGroupId:number}) => api<User>('/auth/register',{method:'POST',body:JSON.stringify(data)}),
  login: (data:{email:string;password:string}) => api<{token:string;user:User}>('/auth/login',{method:'POST',body:JSON.stringify(data)}),
  logout: () => api<void>('/auth/logout',{method:'POST'}),
  courses: () => api<Course[]>('/courses'),
  createCourse: (title:string) => api<Course>('/courses',{method:'POST',body:JSON.stringify({title})}),
  lessons: (courseId:number) => api<Lesson[]>(`/courses/${courseId}/lessons`),
  createLesson: (courseId:number,data:{topic:string;lessonDate:string}) => api<Lesson>(`/courses/${courseId}/lessons`,{method:'POST',body:JSON.stringify(data)}),
  notes: () => api<NoteSummary[]>('/notes'),
  createNote: (lessonId:number,title:string) => api<Note>('/notes',{method:'POST',body:JSON.stringify({lessonId,title})}),
  note: (id:number) => api<Note>(`/notes/${id}`),
  blocks: (id:number) => api<Block[]>(`/notes/${id}/blocks`),
  createBlocks: (id:number,blocks:{content:string}[],transcriptionId?:number) => api<Block[]>(`/notes/${id}/blocks`,{method:'POST',body:JSON.stringify({blocks,...(transcriptionId ? {transcriptionId}: {})})}),
  updateBlock: (noteId:number,blockId:number,data:{content?:string;isHighlighted?:boolean}) => api<Block>(`/notes/${noteId}/blocks/${blockId}`,{method:'PUT',body:JSON.stringify(data)}),
  members: () => api<{id:number;fullName:string}[]>('/study-group/members'),
  collaborators: (id:number) => api<Collaborator[]>(`/notes/${id}/collaborators`),
  addCollaborator: (id:number,userId:number,permission:'read'|'comment'|'edit') => api<Collaborator>(`/notes/${id}/collaborators`,{method:'POST',body:JSON.stringify({userId,permission})}),
  removeCollaborator: (id:number,userId:number) => api<void>(`/notes/${id}/collaborators/${userId}`,{method:'DELETE'}),
  comments: (id:number) => api<Comment[]>(`/blocks/${id}/comments`),
  addComment: (id:number,text:string) => api<Comment>(`/blocks/${id}/comments`,{method:'POST',body:JSON.stringify({text})}),
  notifications: (unreadOnly=false) => api<Notification[]>(`/notifications${unreadOnly?'?unreadOnly=true':''}`),
  markRead: (id:number) => api<void>(`/notifications/${id}/read`,{method:'PATCH'}),
  markAllRead: () => api<void>('/notifications/read-all',{method:'PATCH'}),
  uploadAudio: (lessonId:number,file:File) => { const form = new FormData(); form.append('file',file); return api<{audioRecordingId:number;transcriptionJobId:number;status:string}>(`/lessons/${lessonId}/audio`,{method:'POST',body:form}); },
  job: (id:number) => api<Job>(`/transcription-jobs/${id}`),
  transcription: (id:number) => api<{id:number;text:string;language:string;createdAt:string}>(`/transcriptions/${id}`),
};

export const getHello = endpoints.hello;
