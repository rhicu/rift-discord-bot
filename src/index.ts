import { createCharacter } from '@src/db';

async function main() {
  console.log(await createCharacter(1234, 'Gaarren@Brutwacht', 'WARRIOR', ['HEAL', 'DAMAGE_DEALER'], 'main'));
}

main();
