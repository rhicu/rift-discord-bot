import Command from '@lib/command/Command';
import { AppMessage } from '@lib/DiscordjsWrapper';
import logger from '@lib/logger';
import { createCharacter } from '@src/db';

class CreateCharacter extends Command {
  constructor() {
    super('spieler', 'erstellen');
  }

  async run(msg: AppMessage) {
    try {
      const questions: string[] = ['Name?', 'Class?', 'Roles?', 'short name?'];

      const answers = await msg.getUser().getMessageCollector(60).askQuestions(questions);

      const nameValid = this.isNameValid(answers[0]);

      if (!nameValid) {
        logger.info(`Could not create character with args: ${answers}`);
        msg.reply('Invalid name delivered!');
        return;
      }

      const character = await createCharacter(
        msg.getUser().getID(),
        answers[0],
        answers[1].toUpperCase(),
        answers[2].toUpperCase().split(','),
        answers[3],
      );

      logger.info(`Character created: ${JSON.stringify(character)}`);
    } catch (error) {
      logger.error('Character create failed', error);

      if (error.name === 'SequelizeConnectionRefusedError') {
        msg.reply('Could not create character: Database connection issue');
      } else {
        msg.reply(`Could not create character: ${error.message}`);
      }
    }
  }

  private isNameValid(name: string) {
    if (!name.includes('@')) {
      return false;
    }

    return true;
  }
}

export default new CreateCharacter();
