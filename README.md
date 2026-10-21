# Lectnote

Academic knowledge management platform: students upload lecture audio, get a transcription, write shared notes in blocks, and comment on each other's work.

*Платформа для управления академическими знаниями: аудиозаписи лекций, расшифровки, общие конспекты и комментарии.*

## What the application does

1. A student registers, logs in, and creates a note for a lesson.
2. The student uploads a lecture recording. The system creates a transcription job (`Pending`, `Completed` or `Failed`).
3. The finished transcription is split into blocks that the student edits and highlights.
4. The author shares the note with classmates (read, comment or edit permission).
5. Classmates comment on individual blocks.
6. The system sends notifications: transcription ready, a classmate edited the note.

## Team

| Name | Role |
|------|------|
| Илока Чинаечерем Самваль | Team Lead, Database Engineer, Backend, System Analyst |
| Лукомбу Жеовани Эдуарду | Business Analyst, System Analyst |
| Деронвиль Шеника | Project Manager, DevOps, Backend |
| Эгамбердиев Манучехр | Frontend, UX/UI Designer |

## Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript |
| Backend | ASP.NET Core 9, Entity Framework Core |
| Database | PostgreSQL |
| Deployment | Docker, docker-compose, Nginx |
| Documentation and design | Markdown, Mermaid, Swagger (OpenAPI), Figma |

## Repository structure

```
Lectnote/
├── api/            ASP.NET Core backend (Lectnote.Api)
├── web/            React frontend
├── docs/           Requirements, use cases, ERD, API contracts, task documents
├── docker-compose.yml
├── .env.example    Example environment variables (copy to .env)
└── README.md
```

## Running the project

### Requirements

- [Git](https://git-scm.com/)
- [.NET SDK 9](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/) or [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js (LTS)](https://nodejs.org/) for the frontend

### Whole project with Docker (database, API and web)

```
cp .env.example .env
```

Open `.env` and replace `change_me` with a password (the `.env` file is never committed). Then:

```
docker compose up --build
```

This starts three containers: `lectnote-db` (PostgreSQL, creates the tables from `docs/schema.sql` on the first start), `lectnote-api` (ASP.NET Core) and `lectnote-web` (React behind Nginx).

Open `http://localhost:8080`. The API answers at `http://localhost:8080/api/hello`.

To stop the project, run `docker compose down`. To also delete the database data (for example after changing the password in `.env`), run `docker compose down -v`.

### API without Docker

1. Create an empty database, for example `lectnote_dev`, in your local PostgreSQL.
2. Open a terminal in `api/Lectnote.Api` and store the connection string (it stays on your computer, outside the repository):

```
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=lectnote_dev;Username=postgres;Password=YOUR_PASSWORD"
```

Use the port of your PostgreSQL server (the default is 5432).

3. Install the EF Core tool once, apply the migration, and start the API:

```
dotnet tool install --global dotnet-ef --version "9.*"
dotnet ef database update
dotnet run --urls http://localhost:5000
```

4. Open `http://localhost:5000/api/hello`. The answer is `{"message":"Hello from Lectnote API","studyGroups":0}`.

### Frontend

```
cd web
npm install
npm run dev
```

The page opens at `http://localhost:5173` and calls the API at `http://localhost:5000`.

## Documentation

| File | Content |
|------|---------|
| [docs/requirements.md](docs/requirements.md) | Functional and non-functional requirements |
| [docs/use-cases.md](docs/use-cases.md) | Use cases UC-01 to UC-10 |
| [docs/business-rules.md](docs/business-rules.md) | Business rules RN-01 to RN-10 and open decisions |
| [docs/erd.md](docs/erd.md) | ERD (Mermaid); picture in `docs/erd.png` |
| [docs/schema.sql](docs/schema.sql) | Draft database schema |
| [docs/api-contracts.md](docs/api-contracts.md) | API contracts |
| [docs/git-guide.md](docs/git-guide.md) | How to work with Git in this project |
| [docs/tasks/](docs/tasks/) | Task documents for each team member |

Figma mockups: link to be added.

## Working rules

- Branches: `main` (stable), `develop` (integration), `feature/<name>` (one task each).
- Changes reach `develop` and `main` only through a pull request reviewed by another team member.
- Commit messages start with `feat:`, `fix:` or `docs:`.
- Passwords, keys and `.env` files are never committed.
