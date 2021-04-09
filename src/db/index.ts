import { Character } from '@db-models';
import logger from '@src/logger';
import { Sequelize } from 'sequelize/types';

async function createCharacter(
  discordID: number, characterName: string, riftClass: string, riftRoles: string[], shortName: string,
): Promise<boolean> {
  try {
    const [character, success] = await Character.upsert({
      discordID,
      characterName,
      riftClass,
      riftRoles,
      shortName,
    });

    if (success) {
      logger.debug('Created character', character);
    }

    return success || false;
  } catch (error) {
    logger.error('An unexpected error occurred while creating character', error);
    return false;
  }
}

export {
  createCharacter,
};
