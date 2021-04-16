import { Character } from '@db-models';

async function createCharacter(
  discordID: string,
  characterName: string,
  riftClass: string,
  riftRoles: string[],
  shortName: string,
): Promise<object> {
  const [character] = await Character.upsert({
    discordID,
    characterName,
    riftClass,
    riftRoles,
    shortName,
  });

  return character.toJSON();
}

export {
  createCharacter,
};
