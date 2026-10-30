import { loadConfig } from '../src/config/env.js';
import { createLogger } from '../src/config/logger.js';
import { createDatabase } from '../src/db/database.js';
import { createJobRunner } from '../src/jobs/job-runner.js';

const jobName = process.argv[2] || 'cleanup-expired-auth';
const config = loadConfig();
const logger = createLogger(config.logLevel);
const database = createDatabase(config.database);

try {
  const runner = createJobRunner({ database, logger });
  const outcome = await runner.run(jobName);
  console.log(JSON.stringify(outcome));
} catch (error) {
  logger.error({ job: jobName, errorCode: error.code || 'JOB_CLI_FAILED' }, 'Job execution failed');
  process.exitCode = 1;
} finally {
  await database.close();
}
