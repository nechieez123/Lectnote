import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AudioPage from './pages/AudioPage';
import AuthPage from './pages/AuthPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotesPage from './pages/NotesPage';
import SharingPage from './pages/SharingPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:noteId" element={<NoteDetailPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/sharing" element={<SharingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
