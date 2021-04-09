import logger from '@src/logger';
import { Sequelize } from 'sequelize';

const db = new Sequelize('riftbot', 'riftbot', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  logging: (sqlStatement) => logger.debug(sqlStatement),
});

const testConnection = async () => {
  try {
    await db.authenticate();
    logger.info('Database connection has been established successfully');
  } catch (error) {
    logger.error('Unable to connect to the database', error);
  }
};

export { db, testConnection };
