import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpenCheck, LockKeyhole, Mail, UserRound } from 'lucide-react';

export default function AuthPage() {
  const [register, setRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/');
  };

  return <main className="auth-page"><Link to="/" className="auth-back"><ArrowLeft size={16} />Voltar à demonstração</Link><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><BookOpenCheck size={21} /></span><span className="brand-name">lectnote<span>.</span></span></div><p className="page-eyebrow">UC-01 · RF-01</p><h1>{register ? 'Cria o teu espaço.' : 'Continua a aprender.'}</h1><p className="auth-description">{register ? 'Registo de demonstração para apresentar o fluxo.' : 'Acede à demonstração local do Lectnote.'}</p><div className="auth-demo-warning"><span className="info-banner-mark">i</span><p>Este formulário não envia dados nem cria uma conta real. Os endpoints de autenticação ainda não estão implementados.</p></div><form className="form-stack auth-form" onSubmit={submit}>{register && <><label className="field-label" htmlFor="auth-name">Nome completo</label><div className="input-with-icon"><UserRound size={16} /><input id="auth-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="O teu nome" required maxLength={200} /></div></>}<label className="field-label" htmlFor="auth-email">Email</label><div className="input-with-icon"><Mail size={16} /><input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.pt" required /></div><label className="field-label" htmlFor="auth-password">Palavra-passe</label><div className="input-with-icon"><LockKeyhole size={16} /><input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required minLength={4} /></div>{register && <><label className="field-label" htmlFor="auth-group">Grupo de estudo</label><select id="auth-group" className="text-input" defaultValue="group-1"><option value="group-1">Engenharia Informática · 2.º ano</option><option value="group-2">Sistemas de Informação · 1.º ano</option></select></>}<button className="button button-primary auth-submit">{register ? 'Criar conta de demonstração' : 'Entrar na demonstração'}</button></form><p className="auth-toggle">{register ? 'Já tens uma conta?' : 'Ainda não tens conta?'} <button onClick={() => setRegister((value) => !value)}>{register ? 'Iniciar sessão' : 'Criar conta'}</button></p><p className="auth-contract-note">Campos segundo o contrato draft. A autenticação não é guardada nem enviada.</p></section><p className="auth-footer">Lectnote · apontamentos que crescem contigo</p></main>;
}
