import logger from '@src/logger';
import { initCharacter } from './character';

Promise.all([
  initCharacter(),
]).then((results) => {
  results.forEach((result) => {
    logger.debug('Table initialized successfully', result);
  });
}).catch((error) => {
  logger.error('Error while initializing database', error);
});
