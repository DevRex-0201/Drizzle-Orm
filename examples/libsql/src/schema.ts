import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
	id: int('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
});
