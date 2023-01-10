import { Column, ColumnBaseConfig } from 'drizzle-orm';
import { ColumnBuilder, ColumnBuilderBaseConfig, UpdateCBConfig } from 'drizzle-orm/column-builder';
import { SQL } from 'drizzle-orm/sql';
import { Update } from 'drizzle-orm/utils';
import { Simplify } from 'drizzle-orm/utils';

import { ForeignKey, ForeignKeyBuilder, UpdateDeleteAction } from '~/foreign-keys';
import { AnyMySqlTable } from '~/table';

export interface ReferenceConfig {
	ref: () => AnyMySqlColumn;
	actions: {
		onUpdate?: UpdateDeleteAction;
		onDelete?: UpdateDeleteAction;
	};
}

export abstract class MySqlColumnBuilder<T extends Partial<ColumnBuilderBaseConfig>> extends ColumnBuilder<T> {
	private foreignKeyConfigs: ReferenceConfig[] = [];

	constructor(name: string) {
		super(name);
	}

	override notNull(): MySqlColumnBuilder<UpdateCBConfig<T, { notNull: true }>> {
		return super.notNull() as any;
	}

	override default(value: T['data'] | SQL): MySqlColumnBuilder<UpdateCBConfig<T, { hasDefault: true }>> {
		return super.default(value) as any;
	}

	override primaryKey(): MySqlColumnBuilder<UpdateCBConfig<T, { notNull: true }>> {
		return super.primaryKey() as any;
	}

	references(
		ref: ReferenceConfig['ref'],
		actions: ReferenceConfig['actions'] = {},
	): this {
		this.foreignKeyConfigs.push({ ref, actions });
		return this;
	}

	/** @internal */
	buildForeignKeys(column: AnyMySqlColumn, table: AnyMySqlTable): ForeignKey[] {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return ((ref, actions) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref();
					return { columns: [column], foreignColumns: [foreignColumn] };
				});
				if (actions.onUpdate) {
					builder.onUpdate(actions.onUpdate);
				}
				if (actions.onDelete) {
					builder.onDelete(actions.onDelete);
				}
				return builder.build(table);
			})(ref, actions);
		});
	}

	/** @internal */
	abstract build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): MySqlColumn<T & { tableName: TTableName }>;
}

export type AnyMySqlColumnBuilder<TPartial extends Partial<ColumnBuilderBaseConfig> = {}> = MySqlColumnBuilder<
	Update<ColumnBuilderBaseConfig, TPartial>
>;

// To understand how to use `MySqlColumn` and `AnyMySqlColumn`, see `Column` and `AnyColumn` documentation.
export abstract class MySqlColumn<T extends Partial<ColumnBaseConfig>> extends Column<T> {
	declare protected $mySqlBrand: 'MySqlColumn';
	protected abstract $mySqlColumnBrand: string;

	constructor(
		override readonly table: AnyMySqlTable<{ name: T['tableName'] }>,
		builder: MySqlColumnBuilder<Omit<T, 'tableName'>>,
	) {
		super(table, builder);
	}

	unsafe(): AnyMySqlColumn {
		return this as AnyMySqlColumn;
	}
}

export type AnyMySqlColumn<TPartial extends Partial<ColumnBaseConfig> = {}> = MySqlColumn<
	Update<ColumnBaseConfig, TPartial>
>;

export type BuildColumn<
	TTableName extends string,
	TBuilder extends AnyMySqlColumnBuilder,
> = TBuilder extends MySqlColumnBuilder<infer T> ? MySqlColumn<Simplify<T & { tableName: TTableName }>> : never;

export type BuildColumns<
	TTableName extends string,
	TConfigMap extends Record<string, AnyMySqlColumnBuilder>,
> = Simplify<
	{
		[Key in keyof TConfigMap]: BuildColumn<TTableName, TConfigMap[Key]>;
	}
>;

export type ChangeColumnTableName<TColumn extends AnyMySqlColumn, TAlias extends string> = TColumn extends
	MySqlColumn<infer T> ? MySqlColumn<Simplify<Omit<T, 'tableName'> & { tableName: TAlias }>>
	: never;

export abstract class MySqlColumnBuilderWithAutoIncrement<T extends Partial<ColumnBuilderBaseConfig>>
	extends MySqlColumnBuilder<T>
{
	/** @internal */ _autoIncrement = false;

	autoincrement(): MySqlColumnBuilderWithAutoIncrement<T> {
		this._autoIncrement = true;
		return this as ReturnType<this['autoincrement']>;
	}
}

export abstract class MySqlColumnWithAutoIncrement<T extends Partial<ColumnBaseConfig & { autoIncrement: boolean }>>
	extends MySqlColumn<T>
{
	declare protected $autoIncrement: T['autoIncrement'];

	readonly autoIncrement: boolean;

	constructor(
		override readonly table: AnyMySqlTable<{ name: T['tableName'] }>,
		builder: MySqlColumnBuilderWithAutoIncrement<Omit<T, 'tableName'>>,
	) {
		super(table, builder);
		this.autoIncrement = builder._autoIncrement;
	}
}
