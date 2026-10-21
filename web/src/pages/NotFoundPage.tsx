import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';

export default function NotFoundPage() {
  return <main className="not-found"><span className="brand-mark"><BookOpenCheck size={22} /></span><p className="page-eyebrow">LECTNOTE</p><h1>Esta página não existe.</h1><p>O endereço pode estar incompleto ou não fazer parte desta demonstração.</p><Link to="/" className="button button-primary"><ArrowLeft size={16} />Voltar ao início</Link></main>;
}
