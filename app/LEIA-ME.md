# App Trilha do RLM (Android)

App Android da trilha de Raciocínio Lógico. Ele usa o mesmo código React da página https://proftiagogomes.com.br/trilha/ (pasta `trilha-app/` do repositório do site): lições, missões do dia, painel do aluno, login por código no e-mail e ranking semanal. As lições funcionam sem internet; login e ranking precisam de conexão.

- **Pacote:** `br.com.proftiagogomes.trilha` (não dá para mudar depois de publicar)
- **Nome na loja:** Trilha do RLM
- **Versão:** 1.0.0 (versionCode 1)

## O que tem nesta pasta

| Pasta / arquivo | Para que serve |
|---|---|
| `android/` | Projeto Android (o GitHub compila; o Android Studio é opcional). |
| `TrilhaDoRLM-teste.apk` | App de teste para instalar no celular. |
| `www/` | A trilha já compilada para o app. Não edite à mão: ela é gerada por `gerar-www.mjs`, que compila `../trilha-app` no modo app (sem links de compra). |
| `assets/` | Ícone, tela de abertura e imagens para a Play Store. |
| `assets/loja/` | 5 capturas de tela do celular para a página da loja. |
| `LOJA.md` | Textos prontos para a página da Play Store. |
| `node_modules/` | Bibliotecas do Capacitor que o projeto Android usa. Não apague. |

**A chave de assinatura nunca vai para o GitHub.** O `.gitignore` já bloqueia arquivos `.jks` e `.keystore`.

## Como o app é gerado (sem Android Studio)

O GitHub monta o app sozinho, a cada mudança na trilha (arquivo `.github/workflows/android.yml` do repositório do site).

- **APK de teste.** Instale direto no celular para testar:
  - Link fixo, sempre a versão mais nova: https://github.com/gomes310/proftiagogomes-site/releases/download/app-teste/TrilhaDoRLM.apk
  - No Android, abra o link, baixe e toque no arquivo.
  - Na primeira vez, o celular pede para permitir "instalar apps desta fonte". Permita para o navegador.
- **AAB da Play Store (assinado).** Só é gerado depois que a chave de envio for cadastrada no GitHub. Veja abaixo.
  - O arquivo aparece em: GitHub → aba **Actions** → última execução de "App Android" → **Artifacts** → `trilha-do-rlm-android`.

### Chave de envio (upload key): fazer uma vez só

A Play Store exige que todo AAB seja assinado com a mesma chave. Ela fica na pasta `chave/` desta pasta (nunca vai para o GitHub).

**Faça backup da pasta `chave/` num pendrive ou no Google Drive.** Se perder a chave, dá para pedir à Google para trocar, mas o processo demora alguns dias.

Para o GitHub assinar o app, cadastre 2 segredos em github.com/gomes310/proftiagogomes-site → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

1. `CHAVE_BASE64`: o conteúdo do arquivo `chave/trilha-rlm-upload.base64.txt`. Abra no Bloco de Notas, selecione tudo e cole.
2. `CHAVE_SENHA`: a senha que está em `chave/SENHA-DA-CHAVE.txt`.

Depois disso, vá em **Actions** → **App Android** → **Run workflow**. Em uns 5 minutos o AAB assinado aparece nos Artifacts.

A versão sobe sozinha a cada execução (1.0.1, 1.0.2…). A Play Store exige isso.

## Passo a passo: publicar no Play Console

1. **Crie o app:** em https://play.google.com/console, clique em *Criar app*. Use o nome "Trilha do RLM", idioma português (Brasil), tipo App, gratuito.
2. **Preencha *Configurar seu app*:**
   - Política de privacidade: https://proftiagogomes.com.br/privacidade.html
   - Acesso ao app: tudo liberado, sem login.
   - Anúncios: não.
   - Classificação de conteúdo: questionário, categoria Educação. Não há violência nem interação entre usuários.
   - Público-alvo: 18+ (concurseiros). Isso evita as regras de apps para crianças.
   - Segurança dos dados: marque que o app **coleta e-mail e apelido** (informações pessoais) e **progresso no app**, apenas para funcionalidade do app e gerenciamento da conta. Os dados **não são compartilhados**, são **criptografados em trânsito** e o aluno **pode pedir a exclusão**. Criar conta é opcional.
   - Exclusão de conta: informe o link https://proftiagogomes.com.br/privacidade.html#apagar-conta (dentro do app, a opção fica em Painel → Sua conta → Apagar minha conta).
   - App de governo / notícias / saúde financeira: não.
3. **Monte a página da loja:** em *Presença na loja → Página principal*, cole os textos do `LOJA.md` e envie:
   - Ícone: `assets/play-icone-512.png`
   - Imagem de destaque: `assets/play-destaque-1024x500.png`
   - Capturas de celular: as 5 de `assets/loja/`
4. **Cumpra o teste fechado obrigatório.** Contas pessoais novas precisam de um teste fechado com **pelo menos 12 testadores por 14 dias seguidos** antes de liberar a produção.
   - Em *Testar → Teste fechado*, crie uma faixa.
   - Envie o arquivo `TrilhaDoRLM-loja-v….aab` baixado dos Artifacts do GitHub.
   - Adicione os e-mails dos testadores, que podem ser alunos ou amigos com Android.
   - Mande o link de participação para eles.
5. **Peça acesso à produção:** depois dos 14 dias, peça o acesso em *Painel*, envie para Produção e aguarde a revisão (normalmente de 1 a 7 dias).

## Para atualizar o app depois

Toda mudança na trilha gera automaticamente um APK de teste novo e, com a chave cadastrada, um AAB novo. Baixe o AAB nos Artifacts e envie no Play Console (Testes ou Produção → Criar nova versão).

Comandos, para quem tiver Node.js instalado:

```
npm install
npm run sync
```

A cada envio, aumente `versionCode` (2, 3, 4…) e `versionName` em `android/app/build.gradle`.

## Regras da Google Play que já foram respeitadas

- **Sem venda fora da loja:** a versão do app não tem botões de compra do Guia nem links para a Hotmart. A Google Play não permite levar o usuário a pagar fora dela por conteúdo digital.
  - Os links do Guia foram trocados pelo canal do YouTube.
  - Se um dia o app tiver parte paga, ela precisa usar o pagamento da Google Play.
- **Contato:** o botão do WhatsApp e o "Convidar um amigo" abrem fora do app.
