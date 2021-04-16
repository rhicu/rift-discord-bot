import Bot from '@lib/DiscordjsWrapper/AppClient';
import { Message, MessageCollector } from 'discord.js';
import { AppUser } from '.';
import ConversationTimeoutError from './ConversationTimeoutError';

export default class AppMessageCollector {
  private discordjsMessageCollector: MessageCollector;

  private user: AppUser;

  constructor(collector: MessageCollector, user: AppUser) {
    this.discordjsMessageCollector = collector;
    this.user = user;
  }

  async askQuestions(
    questions: string[], timeout?: number,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const time = timeout || 5 * 60 * 1000;
      Bot.registerConversation(this.user.getID());

      const answers: string[] = [];

      let currentQuestion = questions.shift();
      if (!currentQuestion) {
        resolve(answers);
        return;
      }

      this.discordjsMessageCollector.on('collect', (msg: Message) => {
        answers.push(msg.content);

        currentQuestion = questions.shift();
        if (currentQuestion) {
          this.user.send(currentQuestion);
        } else {
          this.discordjsMessageCollector.stop('done');
        }
      });

      this.discordjsMessageCollector?.on('end', (collected, reason) => {
        Bot.deregisterConversation(this.user.getID());
        if (reason && reason === 'done') {
          resolve(answers);
          return;
        }
        this.user.send('Timeout');
        reject(new ConversationTimeoutError(`Timeout of ${time} reached`));
      });

      this.user.send(currentQuestion);
    });
  }
}
