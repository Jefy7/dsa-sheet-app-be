import app from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { logger } from './middlewares/logger.middleware';

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to bootstrap application');
    process.exit(1);
  }
};

void bootstrap();
