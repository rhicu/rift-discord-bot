import { createCharacter } from '@src/db';

async function main() {
  await createCharacter(1234, 'Gaarren@Brutwacht', 'warrior', ['dd', 'heal'], 'main');
  await createCharacter(1234, 'Gaarren@Brutwacht', 'warrior', ['dd', 'heal', 'tank'], 'main');
  await createCharacter(12345, 'Gaarren@Brutwacht', 'warrior', ['dd', 'heal', 'tank'], 'main');
}

main();
