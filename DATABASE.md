# Database Setup

This project now uses [TypeORM](https://typeorm.io/) to access a MySQL-compatible
database from NestJS. The connection is configured in
`src/database/database.module.ts` and is available application-wide.

## 1. Environment Variables

Copy `.env.example` to `.env` and adjust the values to match your environment.

```
cp .env.example .env
```

| Key          | Description                                    | Default               |
|--------------|------------------------------------------------|-----------------------|
| `DB_HOST`    | MySQL host name                                | `127.0.0.1`           |
| `DB_PORT`    | MySQL port                                     | `3306`                |
| `DB_USER`    | Connection user name                           | `root`                |
| `DB_PASSWORD`| Connection password                            | —                     |
| `DB_NAME`    | Database name                                  | `fgo_servant_quiz`    |
| `DB_TIMEZONE`| Timezone passed to TypeORM                     | `Z`                   |
| `DB_CHARSET` | Character set used for the connection          | `utf8mb4_unicode_ci`  |
| `DB_LOGGING` | Set to `true` to enable SQL logging in console | `false`               |

`NODE_ENV=production` automatically disables TypeORM schema synchronization.
Keep it `development` locally so entities sync automatically while prototyping.

## 2. Local MySQL With Docker

```bash
docker run --name fgq-mysql \
  -e MYSQL_ROOT_PASSWORD=example-password \
  -e MYSQL_DATABASE=fgo_servant_quiz \
  -p 3306:3306 \
  -d mysql:8
```

After the container is running, update `.env` with the same credentials.

## 3. Using the Repository

`QuizResultEntity` (defined in `src/database/entities/quiz-result.entity.ts`)
shows how domain data is stored. The repository class
`QuizResultRepository` offers helper methods to persist quiz results or read
recent ones. Inject the repository into an interactor/service as needed:

```ts
constructor(private readonly quizResultRepository: QuizResultRepository) {}

await this.quizResultRepository.saveQuizResult({
  servantId: 102600,
  quizType: 'skill',
  isCorrect: true,
});
```

Because `autoLoadEntities` is enabled in the TypeORM configuration, new
entities become available as soon as you add them to a feature module with
`TypeOrmModule.forFeature([YourEntity])`.

## 4. Cloud Run / Production Notes

- Set the same environment variables in Cloud Run or your secret manager.
- Use a managed MySQL instance (e.g., Cloud SQL) and configure `DB_HOST`,
  `DB_PORT`, and credentials accordingly.
- Disable schema synchronization by keeping `NODE_ENV=production` in Cloud Run
  and manage schema changes with migrations.
- See `DEPLOY.md` for a Cloud SQL provisioning guide and examples on how to run
  `npm run migrate:run` during deployment.
