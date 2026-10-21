# Lectnote — frontend React + TypeScript

Frontend de demonstração minimalista e académico para abrir no StackBlitz. A estratégia é híbrida: dados locais demonstram os fluxos previstos enquanto os endpoints de produto não existem; o cliente real está preparado para o endpoint implementado `GET /api/hello`.

## Abrir no StackBlitz

1. Descarregue e extraia o ZIP deste projeto (ou crie um projeto Vite React + TypeScript e copie estes ficheiros).
2. Abra a pasta do projeto no StackBlitz.
3. Aguarde a instalação de pacotes. Se necessário, execute no terminal:

   ```bash
   npm install
   npm run dev
   ```

4. O preview abre a aplicação. O dashboard deverá mostrar o estado da API no topo; se a API não estiver acessível a partir do StackBlitz, o restante frontend continua utilizável em modo de demonstração.

## Execução local

Requer Node.js LTS. Para executar com o backend no próprio computador:

```bash
npm install
cp .env.example .env
npm run dev
```

O backend ASP.NET Core do snapshot configura `http://localhost:5157` em `launchSettings.json`; o `vite.config.ts` usa esta porta como destino padrão do proxy `/api`. Se a API estiver noutra URL, altere `API_PROXY_TARGET` no `.env` (por exemplo, `API_PROXY_TARGET=https://api.dev.exemplo.pt`). Não coloque segredos em variáveis `VITE_*` nem no código do browser.

O StackBlitz é executado num ambiente remoto: `localhost` no StackBlitz não é o mesmo localhost do seu computador. Para que `/api/hello` responda a partir do preview online, exponha a API de desenvolvimento por um endereço HTTPS autorizado e configure-o como `API_PROXY_TARGET`; a API também precisa aceitar tráfego dessa origem ou ser acessada pelo proxy do Vite.

## O que funciona nesta entrega

- Navegação responsiva para visão geral, disciplinas/aulas, notas, áudio/transcrições, partilha e notificações.
- Criação demonstrativa de disciplinas, aulas e notas, com persistência no `localStorage` do browser.
- Edição de blocos, destaques, comentários e marcação de notificações como lidas, sempre em dados locais de demonstração.
- Ecrãs de login/registo exclusivamente demonstrativos; não criam contas nem enviam palavra-passe.
- Chamada real a `GET /api/hello` com validação da forma `{ "message": string, "studyGroups": number }`.
- Estados de erro para API indisponível ou resposta incompatível.

## Limites de integração

No backend enviado, só `GET /api/hello` está implementado. Os outros contratos de `docs/api-contracts.md` são draft. A interface não afirma que as alterações demonstrativas foram persistidas no servidor.

Upload real está desativado porque D-01 (formatos e tamanho máximo) está pendente. Reenvio/notificação após falha dependem de D-02. A edição concorrente depende de D-04. O ecrã de partilha é só de leitura enquanto D-05 não for decidido. A política de idioma da transcrição e notificações por email/in-app também depende de D-06/D-07. Não foram acrescentados fluxos de exclusão.

## Validar e integrar no repositório

```bash
npm ci
npm run build
```

Para integrar, copie o conteúdo deste projeto para `web/` no repositório Lectnote, crie uma branch `feature/...` baseada em `develop` e abra pull request para `develop`, conforme `docs/git-guide.md`. O frontend ainda não depende de um serviço de banco de dados próprio.

## Docker e Nginx

O `Dockerfile` constrói os assets Vite e os serve com Nginx. `nginx/default.conf` encaminha `/api/...` para `http://api:8080`, assumindo que o serviço ASP.NET no Docker Compose se chama `api` e expõe a porta interna 8080. O ficheiro não altera o Compose atual; a integração do serviço `web` e a validação conjunta continuam a exigir atualização do `docker-compose.yml` pela equipa.
