/* eslint-disable no-param-reassign */
import Command from '@lib/command/Command';
import CommandSession from '@lib/command/CommandSession';
import { AppMessage } from '@lib/DiscordjsWrapper';
import logger from '@lib/logger';
import { createCharacter } from '@src/db';
import CreateCharacterSession from './CreateCharacterSession';

class CreateCharacter extends Command<CreateCharacterSession> {
  constructor() {
    super('spieler', 'erstellen');
  }

  async continue(msg: AppMessage, session: CreateCharacterSession) {
    session.nextStep(msg, session);
  }

  private askForName(msg: AppMessage, session: CreateCharacterSession) {
    msg.reply("What's the name of your character? IMPORTANT: complete name including server");
    session.nextStep = this.validateName;
  }

  private validateName(msg: AppMessage, session: CreateCharacterSession) {
    if(msg.getContent().trim().split('@').length === 2) {
      session.name = msg.getContent();
      session.nextStep = this.askForRoles
    } else {
      session.nextStep
    }
  }

  private askForRoles(msg: AppMessage, session: CreateCharacterSession) {
    msg.reply("What roles are you able to play?");
    session.nextStep = this.validateName;
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

  public createSession() {
    return new CreateCharacterSession(this.askForName);
  }
}

export default new CreateCharacter();
