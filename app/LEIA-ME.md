# App Trilha do RLM (Android)

App Android da trilha de Raciocínio Lógico. Ele usa o mesmo código da página https://proftiagogomes.com.br/trilha/ e funciona sem internet. O progresso fica salvo no celular.

- **Pacote:** `br.com.proftiagogomes.trilha` (não dá para mudar depois de publicar)
- **Nome na loja:** Trilha do RLM
- **Versão:** 1.0.0 (versionCode 1)

## O que tem nesta pasta

| Pasta / arquivo | Para que serve |
|---|---|
| `android/` | Projeto Android. É esta pasta que você abre no Android Studio. |
| `www/` | A trilha já adaptada para o app. Não edite à mão: ela é gerada por `gerar-www.mjs`. |
| `assets/` | Ícone, tela de abertura e imagens para a Play Store. |
| `assets/loja/` | 5 capturas de tela do celular para a página da loja. |
| `LOJA.md` | Textos prontos para a página da Play Store. |
| `node_modules/` | Bibliotecas do Capacitor que o projeto Android usa. Não apague. |

**A chave de assinatura nunca vai para o GitHub.** O `.gitignore` já bloqueia arquivos `.jks` e `.keystore`.

## Passo a passo: gerar o arquivo para a Play Store (.aab)

1. **Instale o Android Studio:** https://developer.android.com/studio (instalação padrão).
2. **Abra o projeto:** em *File → Open*, escolha a pasta `android` desta pasta e espere a sincronização do Gradle terminar. Na primeira vez ele baixa alguns arquivos e pode demorar uns minutos.
3. **Gere o pacote assinado:** *Build → Generate Signed App Bundle or APK → Android App Bundle → Next*.
4. **Crie a chave de envio (só na primeira vez):** clique em *Create new…*.
   - Caminho da chave: `trilhadoRLM\chave\trilha-rlm-upload.jks` (crie a pasta `chave`).
   - Crie uma senha forte e anote num lugar seguro, como um gerenciador de senhas.
   - Alias: `upload`.
   - Validade: 25 anos.
   - Preencha seu nome no certificado.
5. **Escolha o tipo de build:** variante **release**, depois *Create*. O arquivo sai em `android/app/release/app-release.aab`.
6. **Faça backup da chave:** copie a pasta `chave` para um pendrive ou para o Google Drive. Sem essa chave e a senha, você não consegue enviar atualizações. Se perder, dá para pedir à Google para trocar a chave, mas o processo é demorado.

## Passo a passo: publicar no Play Console

1. **Crie o app:** em https://play.google.com/console, clique em *Criar app*. Use o nome "Trilha do RLM", idioma português (Brasil), tipo App, gratuito.
2. **Preencha *Configurar seu app*:**
   - Política de privacidade: https://proftiagogomes.com.br/privacidade.html
   - Acesso ao app: tudo liberado, sem login.
   - Anúncios: não.
   - Classificação de conteúdo: questionário, categoria Educação. Não há violência nem interação entre usuários.
   - Público-alvo: 18+ (concurseiros). Isso evita as regras de apps para crianças.
   - Segurança dos dados: o app **não coleta nem compartilha dados**. O progresso fica só no aparelho.
   - App de governo / notícias / saúde financeira: não.
3. **Monte a página da loja:** em *Presença na loja → Página principal*, cole os textos do `LOJA.md` e envie:
   - Ícone: `assets/play-icone-512.png`
   - Imagem de destaque: `assets/play-destaque-1024x500.png`
   - Capturas de celular: as 5 de `assets/loja/`
4. **Cumpra o teste fechado obrigatório.** Contas pessoais novas precisam de um teste fechado com **pelo menos 12 testadores por 14 dias seguidos** antes de liberar a produção.
   - Em *Testar → Teste fechado*, crie uma faixa.
   - Envie o `app-release.aab`.
   - Adicione os e-mails dos testadores, que podem ser alunos ou amigos com Android.
   - Mande o link de participação para eles.
5. **Peça acesso à produção:** depois dos 14 dias, peça o acesso em *Painel*, envie para Produção e aguarde a revisão (normalmente de 1 a 7 dias).

## Para atualizar o app depois

Quando a trilha do site mudar, peça ao Claude para "atualizar o app". Ele gera o `www` de novo, sincroniza o projeto Android e aumenta a versão. Depois você só repete o passo 3 do primeiro passo a passo e envia o novo `.aab` no Play Console.

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
