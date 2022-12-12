import { Logger } from 'drizzle-orm';
import { PgDatabase } from '~/db';
import { PgDialect } from '~/dialect';
import { NeonDriver } from './driver';
import { NeonClient } from './session';

export interface ConnectOptions {
	logger?: Logger;
}

export { PgDatabase } from '~/db';

export async function connect(client: NeonClient, options: ConnectOptions = {}): Promise<PgDatabase> {
	const dialect = new PgDialect();
	const driver = new NeonDriver(client, dialect, { logger: options.logger });
	const session = await driver.connect();
	return dialect.createDB(session);
}
