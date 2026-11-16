-- Trilha do RLM: contas, login por código, sessões e ranking semanal (Cloudflare D1 / SQLite)
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  apelido TEXT NOT NULL,
  apelido_min TEXT NOT NULL UNIQUE,
  criado TEXT NOT NULL,
  progresso TEXT,
  atualizado INTEGER NOT NULL DEFAULT 0,
  comprador INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS codigos (
  email TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  expira INTEGER NOT NULL,
  tentativas INTEGER NOT NULL DEFAULT 0,
  enviados INTEGER NOT NULL DEFAULT 0,
  janela INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessoes (
  hash TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  expira INTEGER NOT NULL,
  criado INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessoes_usuario ON sessoes (usuario_id);
CREATE TABLE IF NOT EXISTS xp_semana (
  usuario_id TEXT NOT NULL,
  semana TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  atualizado INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (usuario_id, semana)
);
CREATE INDEX IF NOT EXISTS xp_semana_rank ON xp_semana (semana, xp DESC);
CREATE TABLE IF NOT EXISTS xp_dia (
  usuario_id TEXT NOT NULL,
  dia TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  ultimo INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (usuario_id, dia)
);
CREATE TABLE IF NOT EXISTS limites_ip (
  ip TEXT NOT NULL,
  janela INTEGER NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, janela)
);
