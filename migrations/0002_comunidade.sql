-- Comunidade da Trilha: relatos dos testadores (erros, ideias, problemas) e votos nas ideias publicadas
CREATE TABLE IF NOT EXISTS relatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  criado INTEGER NOT NULL,
  usuario_id TEXT,
  tipo TEXT NOT NULL,            -- questao | explicacao | ideia | app
  onde TEXT NOT NULL DEFAULT '', -- ex.: licao 11 · passo 2, prova tec-66527
  texto TEXT NOT NULL,
  contexto TEXT,                 -- JSON: versão, plataforma, tela
  status TEXT NOT NULL DEFAULT 'novo', -- novo | votacao | fazendo | feito | arquivado
  titulo TEXT,                   -- título público escrito pelo professor (ideias e melhorias feitas)
  resposta TEXT,                 -- resposta do professor para quem enviou
  atualizado INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS relatos_status ON relatos (status, criado DESC);
CREATE INDEX IF NOT EXISTS relatos_usuario ON relatos (usuario_id, criado DESC);
CREATE TABLE IF NOT EXISTS votos (
  relato_id INTEGER NOT NULL,
  usuario_id TEXT NOT NULL,
  criado INTEGER NOT NULL,
  PRIMARY KEY (relato_id, usuario_id)
);
ALTER TABLE usuarios ADD COLUMN admin INTEGER NOT NULL DEFAULT 0;
