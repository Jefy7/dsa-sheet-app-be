import 'dotenv/config';
import app from './app';
import { AppDataSource } from './config/data-source';
import { logger } from './middlewares/logger.middleware';

const bootstrap = async () => {
  try {
    logger.info("Boostraping...")
    const PORT = process.env.PORT
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to bootstrap application');
    process.exit(1);
  }
};

void bootstrap();
