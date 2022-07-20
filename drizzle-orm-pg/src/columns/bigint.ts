import { ColumnData, ColumnDriverParam, ColumnHasDefault, ColumnNotNull, TableName } from 'drizzle-orm/branded-types';

import { AnyPgTable } from '~/table';
import { PgColumn, PgColumnBuilder } from './common';

export class PgBigInteger53Builder<
	TNotNull extends ColumnNotNull = ColumnNotNull<false>,
	THasDefault extends ColumnHasDefault = ColumnHasDefault<false>,
> extends PgColumnBuilder<ColumnData<number>, ColumnDriverParam<number | string>, TNotNull, THasDefault> {
	/** @internal */
	override build<TTableName extends TableName>(
		table: AnyPgTable<TTableName>,
	): PgBigInteger53<TTableName, TNotNull, THasDefault> {
		return new PgBigInteger53<TTableName, TNotNull, THasDefault>(table, this);
	}
}

export class PgBigInteger53<
	TTableName extends TableName,
	TNotNull extends ColumnNotNull,
	THasDefault extends ColumnHasDefault,
> extends PgColumn<TTableName, ColumnData<number>, ColumnDriverParam<number | string>, TNotNull, THasDefault> {
	brand!: 'PgBigInteger53';

	getSQLType(): string {
		return 'bigint';
	}

	override mapFromDriverValue(value: ColumnDriverParam<number | string>): ColumnData<number> {
		if (typeof value === 'number') {
			return value as ColumnData<any>;
		}
		return parseInt(value) as ColumnData<number>;
	}
}

export class PgBigInteger64Builder<
	TNotNull extends ColumnNotNull = ColumnNotNull<false>,
	THasDefault extends ColumnHasDefault = ColumnHasDefault<false>,
> extends PgColumnBuilder<ColumnData<bigint>, ColumnDriverParam<string>, TNotNull, THasDefault> {
	/** @internal */
	override build<TTableName extends TableName>(
		table: AnyPgTable<TTableName>,
	): PgBigInteger64<TTableName, TNotNull, THasDefault> {
		return new PgBigInteger64<TTableName, TNotNull, THasDefault>(table, this);
	}
}

export class PgBigInteger64<
	TTableName extends TableName,
	TNotNull extends ColumnNotNull,
	THasDefault extends ColumnHasDefault,
> extends PgColumn<TTableName, ColumnData<bigint>, ColumnDriverParam<string>, TNotNull, THasDefault> {
	brand!: 'PgBigInteger64';

	getSQLType(): string {
		return 'bigint';
	}

	override mapFromDriverValue(value: ColumnDriverParam<string>): ColumnData<bigint> {
		return BigInt(value) as ColumnData<bigint>;
	}
}

export function bigint(name: string, maxBytes: 'max_bytes_53' | 'max_bytes_64') {
	if (maxBytes === 'max_bytes_53') {
		return new PgBigInteger53Builder(name);
	}
	return new PgBigInteger64Builder(name);
}
