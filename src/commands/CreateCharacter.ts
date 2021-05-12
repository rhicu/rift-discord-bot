import Command from '@lib/command/Command';
import { AppMessage } from '@lib/DiscordjsWrapper';
import logger from '@lib/logger';
import { createCharacter } from '@src/db';
import { RiftClass, RiftRoles } from '@src/db/models/character';
import CreateCharacterSession from './CreateCharacterSession';

const characterConfig = {
  riftClasses: {
    warrior: ['warrior', 'warri', 'w', 'krieger'],
    rogue: ['rogue', 'r', 'schurke', 's'],
    primalist: ['primalist', 'prima', 'p'],
    mage: ['mage', 'm', 'magier'],
    cleric: ['cleric', 'cleri', 'c', 'kleriker', 'kleri', 'k'],
  },
  riftRoles: {
    dd: ['dd', 'damage', 'damage dealer', 'damagedealer', 'schaden', 'dps'],
    heal: ['heal', 'healer', 'h', 'heiler', 'heilung'],
    support: ['support', 'sup', 'supp', 'unterstützung', 's'],
    tank: ['tank', 't'],
  },
};

class CreateCharacter extends Command<CreateCharacterSession> {
  constructor() {
    super('spieler', 'erstellen');
  }

  async continue(msg: AppMessage, session: CreateCharacterSession) {
    session.nextStep(msg, session);
  }

  async run(msg: AppMessage) {
    try {
      logger.debug('Run spieler erstellen');

      const questions: string[] = ['Name?', 'Class?', 'Roles?', 'short name?'];

      const answers = await msg.getUser().getMessageCollector(60).askQuestions(questions);

      const name = this.parseName(answers[0]);
      const riftClass = this.parseRiftClass(answers[1]);
      const riftRoles = this.parseRiftRoles(answers[2]);
      const shortName = answers[3];

      if (!name) {
        logger.info(`Could not create character with args: ${answers} - Invalid name`);
        msg.reply('Invalid name delivered!');
        return;
      }

      if (!riftClass) {
        logger.info(`Could not create character with args: ${answers} - Invalid rift class`);
        msg.reply('Invalid rift class delivered!');
        return;
      }

      if (!riftRoles) {
        logger.info(`Could not create character with args: ${answers} - Invalid rift roles`);
        msg.reply('Invalid rift roles delivered!');
        return;
      }

      const character = await createCharacter(
        msg.getUser().getID(),
        name,
        riftClass,
        riftRoles,
        shortName,
      );

      logger.info(`Character created: ${JSON.stringify(character)}`);
      msg.reply(`Character created: ${JSON.stringify(character)}`);
    } catch (error) {
      logger.error('Character create failed', error);

      if (error.name === 'SequelizeConnectionRefusedError') {
        msg.reply('Could not create character: Database connection issue');
      } else {
        msg.reply(`Could not create character: ${error.message}`);
      }
    }
  }

  private parseName(input: string): string|null {
    const nameInput = input.trim().split('@');

    if (nameInput.length !== 2) {
      return null;
    }

    return nameInput
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join('@');
  }

  private parseRiftClass(input: string): string|null {
    const beautified = input.trim();

    if (characterConfig.riftClasses.cleric.filter((alias) => beautified === alias).length !== 0) {
      return RiftClass.CLERIC;
    }
    if (characterConfig.riftClasses.warrior.filter((alias) => beautified === alias).length !== 0) {
      return RiftClass.WARRIOR;
    }
    if (characterConfig.riftClasses.rogue.filter((alias) => beautified === alias).length !== 0) {
      return RiftClass.ROGUE;
    }
    if (characterConfig.riftClasses.mage.filter((alias) => beautified === alias).length !== 0) {
      return RiftClass.MAGE;
    }
    // eslint-disable-next-line max-len
    if (characterConfig.riftClasses.primalist.filter((alias) => beautified === alias).length !== 0) {
      return RiftClass.PRIMALIST;
    }

    return null;
  }

  private parseRiftRoles(input: string): string[]|null {
    const beautified = input.trim().split(',');
    const riftRoles = [];

    if (characterConfig.riftRoles.dd.filter((alias) => beautified.includes(alias))) {
      riftRoles.push(RiftRoles.DAMAGE_DEALER);
    }
    if (characterConfig.riftRoles.heal.filter((alias) => beautified.includes(alias))) {
      riftRoles.push(RiftRoles.HEAL);
    }
    if (characterConfig.riftRoles.support.filter((alias) => beautified.includes(alias))) {
      riftRoles.push(RiftRoles.SUPPORT);
    }
    if (characterConfig.riftRoles.tank.filter((alias) => beautified.includes(alias))) {
      riftRoles.push(RiftRoles.TANK);
    }

    return riftRoles.length === 0 ? null : riftRoles;
  }

  public createSession() {
    return new CreateCharacterSession(this.run);
  }
}

export default new CreateCharacter();
