import Command from '@lib/command/Command';
import logger from '@lib/logger';
import { Message } from 'discord.js';

class CreatePlayer extends Command {
  constructor() {
    super('spieler', 'erstellen');
  }

  async run(message: Message) {
    const questions: string[] = ['Name?', 'Class?', 'Roles?', 'short name?'];

    const answers = await this.askQuestions(questions, message.author);

    logger.info(answers.toString());
  }
}

export default new CreatePlayer();
