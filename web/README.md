# Lectnote Web

Frontend React + TypeScript + Vite do Lectnote. A aplicação utiliza exclusivamente a API REST configurada no cliente HTTP e não apresenta dados de demonstração como se fossem persistidos.

## Instalação

```bash
cd web
npm ci
```

## Configuração

Copie o exemplo de ambiente:

```bash
cp .env.example .env.local
```

`VITE_API_BASE_URL` pode ficar vazio quando o frontend usa o proxy `/api` do Vite ou do Nginx Docker. Quando a API estiver noutro domínio, defina, por exemplo:

```env
VITE_API_BASE_URL=http://localhost:5157
```

O frontend não contém segredos. Tokens de sessão são guardados apenas no armazenamento local do navegador para suportar o fluxo bearer documentado pela API.

## Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível no endereço indicado pelo Vite. Para desenvolvimento local com a API no backend, configure `API_PROXY_TARGET` no `.env.local` conforme o `vite.config.ts`.

## Produção

```bash
npm run build
npm run preview
```

No Docker Compose, o Nginx serve o bundle e encaminha `/api` para o serviço `api`, não sendo necessário definir `VITE_API_BASE_URL`.

## Funcionalidades integradas

A autenticação usa os endpoints de registo, login e logout, recupera grupos de estudo e reage a sessões expiradas. O dashboard, cursos, aulas, notas e blocos carregam dados reais da API. O editor permite criar e editar blocos, destacar conteúdo e comentar quando a permissão do utilizador o permite.

O fluxo de áudio valida MP3, WAV, M4A, WebM e OGG até 100 MiB, envia multipart sem definir manualmente o boundary, acompanha jobs `Pending`, `Completed` e `Failed` com polling e apresenta/copia a transcrição quando confirmada pelo servidor. A área de partilha permite escolher uma nota própria, adicionar colegas do grupo com permissões `read`, `comment` ou `edit` e remover acesso. As notificações podem ser marcadas individualmente ou em conjunto como lidas.

## Verificação

```bash
npm run build
```

Este comando executa o TypeScript em modo build e gera o bundle Vite de produção. Não há framework de testes instalado no projeto original; testes de componentes podem ser adicionados posteriormente sem alterar o contrato da API.

## Dependências e limites

Não foram adicionadas dependências novas. O frontend utiliza React, React DOM, React Router e Lucide já presentes no projeto. A autorização definitiva, a persistência e os conflitos de concorrência continuam a ser responsabilidade do backend; o frontend apenas reflete as respostas e permissões devolvidas pela API.
