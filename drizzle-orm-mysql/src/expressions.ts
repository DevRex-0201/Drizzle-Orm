import { sql } from 'drizzle-orm';
import { param, SQL, SQLSourceParam } from 'drizzle-orm/sql';
import { AnyMySqlColumn } from './columns/common';

export * from 'drizzle-orm/expressions';

export function concat(column: AnyMySqlColumn, value: string): SQL {
	return sql`${column} || ${param(value, column)}`;
}

export function substring(column: AnyMySqlColumn, { from, for: _for }: { from?: number; for?: number }): SQL {
	const chunks: SQLSourceParam[] = [sql`substring(`, column];
	if (from !== undefined) {
		chunks.push(sql` from `, param(from, column));
	}
	if (_for !== undefined) {
		chunks.push(sql` for `, param(_for, column));
	}
	chunks.push(sql`)`);
	return sql.fromList(chunks);
}
