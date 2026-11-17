import { useEffect, useRef, useState } from 'react';
import { entrar, pedirCodigo, useSessao, ErroApi } from '../api';

// Login sem senha: o aluno recebe um código de 6 dígitos no e-mail.
export default function Entrar({ irPara }: { irPara: (r: string) => void }) {
  const sessao = useSessao();
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [apelido, setApelido] = useState('');
  const [novo, setNovo] = useState(false);
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [espera, setEspera] = useState(0);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => { campo.current?.focus(); }, [etapa]);
  useEffect(() => { if (!espera) return; const t = setTimeout(() => setEspera(espera - 1), 1000); return () => clearTimeout(t); }, [espera]);
  useEffect(() => { if (sessao) irPara('painel'); }, [sessao]);

  async function enviarEmail(ev?: React.FormEvent) {
    ev?.preventDefault(); setErro('');
    const em = email.trim();
    if (!em) { setErro('Digite seu e-mail para receber o código.'); campo.current?.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(em)) { setErro('Esse e-mail parece incompleto. Confira, por exemplo: voce@gmail.com'); campo.current?.focus(); return; }
    setOcupado(true);
    try {
      const r = await pedirCodigo(email.trim().toLowerCase());
      setNovo(r.novo); setEtapa('codigo'); setEspera(45);
    } catch (x) { setErro(x instanceof ErroApi ? x.message : 'Não deu para enviar o código.'); } finally { setOcupado(false); }
  }
  async function confirmar(ev: React.FormEvent) {
    ev.preventDefault(); setErro(''); setOcupado(true);
    try { await entrar(email.trim().toLowerCase(), codigo.replace(/\D/g, ''), novo ? apelido.trim() : undefined); }
    catch (x) { setErro(x instanceof ErroApi ? x.message : 'Não deu para entrar.'); } finally { setOcupado(false); }
  }

  return (
    <div className="entrar">
      <div className="card">
        <h1>{etapa === 'email' ? 'Entre ou crie sua conta grátis' : 'Digite o código'}</h1>
        {etapa === 'email' ? (
          <form onSubmit={enviarEmail} noValidate>
            <p className="lead">Sem senha: digite seu e-mail e mandamos um código de 6 dígitos. Se você ainda não tem conta, ela é criada nesse momento.</p>
            <label className="campo">Seu e-mail
              <input ref={campo} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); if (erro) setErro(''); }} placeholder="voce@email.com" aria-invalid={!!erro} aria-describedby={erro ? 'erro-email' : undefined} />
            </label>
            {erro && <p className="msg-erro" role="alert" id="erro-email">{erro}</p>}
            <button className="btn btn-pri largo" disabled={ocupado}>{ocupado ? 'Enviando…' : 'Receber código no e-mail'}</button>
          </form>
        ) : (
          <form onSubmit={confirmar}>
            <p className="lead">Enviamos para <strong>{email}</strong>. Olhe também a caixa de spam e a aba Promoções. O código vale por 10 minutos.</p>
            <label className="campo">Código de 6 dígitos
              <input ref={campo} className="codigo" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </label>
            {novo && (
              <>
                <label className="campo">Apelido no ranking
                  <input type="text" autoComplete="nickname" minLength={3} maxLength={20} required value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder="Ex.: Ana Concurseira" />
                  <small>Só o apelido aparece para os outros. De 3 a 20 letras ou números.</small>
                </label>
                <label className="check"><input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} required /> Li e aceito a <a href="https://proftiagogomes.com.br/privacidade.html" target="_blank" rel="noopener">política de privacidade</a>.</label>
              </>
            )}
            {erro && <p className="msg-erro" role="alert">{erro}</p>}
            <button className="btn btn-pri largo" disabled={ocupado || codigo.replace(/\D/g, '').length !== 6 || (novo && (apelido.trim().length < 3 || !aceite))}>{ocupado ? 'Entrando…' : novo ? 'Criar conta' : 'Entrar'}</button>
            <p className="acoes-sec">
              <button type="button" className="link" disabled={espera > 0 || ocupado} onClick={() => void enviarEmail()}>{espera ? 'Reenviar código em ' + espera + ' s' : 'Reenviar código'}</button>
              <button type="button" className="link" onClick={() => { setEtapa('email'); setCodigo(''); setErro(''); }}>Usar outro e-mail</button>
            </p>
          </form>
        )}
      </div>
      <p className="nota centro">Prefere continuar sem conta? <button type="button" className="link" onClick={() => irPara('')}>Voltar para a trilha</button>. Seu progresso continua salvo neste aparelho.</p>
    </div>
  );
}
