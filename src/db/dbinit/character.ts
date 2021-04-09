import { Character } from '@db-models';

export async function initCharacter() {
  return Character.sync({ force: true });
}
