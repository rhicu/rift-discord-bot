import { Character } from '@db-models';
import logger from '@src/logger';

async function createCharacter(
  discordID: number, characterName: string, riftClass: string, roles: string[], shortName: string,
): Promise<boolean> {
  const [character, success] = await Character.upsert({
    discordID,
    characterName,
    riftClass,
    roles,
    shortName,
  });

  if (success) {
    logger.debug('Created character', character);
  }

  return success || false;
}

export {
  createCharacter,
};
