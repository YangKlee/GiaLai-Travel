# Backend conventions

- Runtime data access uses **Sequelize 6 and the scaffold models in `src/db/models/`**. Use model APIs (`findOne`, `findAll`, `create`, `update`, associations, scopes and Sequelize transactions). Do not write manual SQL queries in business modules or shared business services.
- `createDatabase()` owns one Sequelize instance/pool and initializes the scaffold models. Pass its transaction object into every model call participating in a transaction. Do not create a separate pool per feature.
- SQL schema/migration files and dedicated migration metadata checks are maintained separately. Never call `sync()`, `sync({ alter: true })`, or auto-import a schema at application startup.
- Preserve runtime preparation when regenerating models: per-instance model subclasses, UTC timestamp defaults, generated-column write protection and reviewed composite foreign-key associations. The scaffold command invokes `prepare-generated-models.js` and excludes the migration ledger.
- Generated columns are read-only. Keep BIGINT money as strings; public DTOs use camelCase, canonical GUID strings and ISO UTC timestamps.
- Keep SQL, query parameters, tokens, passwords and raw driver errors out of application logs/HTTP errors.
- Verify with Node 20.20.2: `npm test` and `npm run test:integration` at the repository root. Integration tests use loopback-only, randomly named disposable databases, not the configured hosting `.env`.
