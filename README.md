<div align="center">
<h1>Drizzle ORM <a href=""><img alt="npm" src="https://img.shields.io/npm/v/drizzle-orm?label="></a></h1>
<img alt="npm" src="https://img.shields.io/npm/dm/drizzle-orm">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/drizzle-orm">
<a href="https://discord.gg/yfjTbVXMW4"><img alt="Discord" src="https://img.shields.io/discord/1043890932593987624"></a>
<img alt="License" src="https://img.shields.io/npm/l/drizzle-orm">
<h6><i>If you know SQL, you know Drizzle ORM</i></h6>
<hr />
</div>

Drizzle ORM is a TypeScript ORM for SQL databases designed with maximum type safety in mind. It comes with a [drizzle-kit](https://github.com/drizzle-team/drizzle-kit-mirror) CLI companion for automatic SQL migrations generation. Drizzle ORM is meant to be a library, not a framework. It stays as an opt-in solution all the time at any levels.

The ORM main philosophy is "If you know SQL, you know Drizzle ORM". We follow the SQL-like syntax whenever possible, are strongly typed ground top and fail at compile time, not in runtime.

Drizzle ORM is being battle-tested on production projects by multiple teams 🚀 Give it a try and let us know if you have any questions or feedback on [Discord](https://discord.gg/yfjTbVXMW4).

## Feature list

- Full type safety
- [Smart automated migrations generation](https://github.com/drizzle-team/drizzle-kit-mirror)
- No ORM learning curve
- SQL-like syntax for table definitions and queries
- Best in class fully typed joins
- Fully typed partial and non-partial selects of any complexity
- Auto-inferring of TS types for DB models for selections and insertions separately
- Zero dependencies

## Database support status

| Database    | Support | |
|:------------|:-------:|:---|
| PostgreSQL  | ✅ | [Docs](./drizzle-orm/src/pg-core/README.md)|
| MySQL       | ✅      |[Docs](./drizzle-orm/src/mysql-core/README.md)|
| SQLite      | ✅      |[Docs](./drizzle-orm/src/sqlite-core/README.md)|
| DynamoDB    | ⏳      |            |
| MS SQL      | ⏳      |            |
| CockroachDB | ⏳      |            |

## Installation

```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

See [dialect-specific docs](#database-support-status) for more details.
