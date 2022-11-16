import { Database, Statement } from 'bun:sqlite';
import { Logger, NoopLogger } from 'drizzle-orm';
import { Query, SQL } from 'drizzle-orm/sql';
import { SQLiteDialect } from '~/dialect';
import { PreparedQuery as PreparedQueryBase, SQLiteSyncSession } from '~/session';

export interface SQLiteBunSessionOptions {
	logger?: Logger;
}

type PreparedQuery = PreparedQueryBase<Statement<any>>;

export class SQLiteBunSession implements SQLiteSyncSession<Statement<any>, void> {
	private logger: Logger;

	constructor(
		private client: Database,
		private dialect: SQLiteDialect,
		options: SQLiteBunSessionOptions = {},
	) {
		this.logger = options.logger ?? new NoopLogger();
	}

	run(query: SQL | PreparedQuery): void {
		const { stmt, queryString, params } = query instanceof SQL
			? this.prepareQuery(this.dialect.sqlToQuery(query))
			: query;
		this.logger.logQuery(queryString, params);

		return stmt.run(...params);
	}

	all<T extends any[] = unknown[]>(query: SQL | PreparedQuery): T[] {
		const { stmt, queryString, params } = query instanceof SQL
			? this.prepareQuery(this.dialect.sqlToQuery(query))
			: query;
		this.logger.logQuery(queryString, params);

		return stmt.values(...params) as T[];
	}

	allObjects<T = unknown>(query: SQL | PreparedQuery): T[] {
		const { stmt, queryString, params } = query instanceof SQL
			? this.prepareQuery(this.dialect.sqlToQuery(query))
			: query;
		this.logger.logQuery(queryString, params);

		return stmt.all(...params);
	}

	prepareQuery(query: Query): PreparedQuery {
		const stmt = this.client.prepare(query.sql);
		return { stmt, queryString: query.sql, params: query.params };
	}
}
