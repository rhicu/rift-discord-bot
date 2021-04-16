import Command from '@lib/command/Command';
import { AppMessage } from '@lib/DiscordjsWrapper';
import logger from '@lib/logger';

class CreatePlayer extends Command {
  constructor() {
    super('spieler', 'erstellen');
  }

  async run(msg: AppMessage) {
    const questions: string[] = ['Name?', 'Class?', 'Roles?', 'short name?'];

    const answers = await msg.getUser().getMessageCollector(300).askQuestions(questions);

    logger.info(answers.toString());
  }
}

export default new CreatePlayer();
