import Bot from '@lib/bot/Bot';
import { Message, User } from 'discord.js';
import ConversationTimeoutError from './ConversationTimeoutError';

export default abstract class Command {
  protected group: string;

  protected name: string;

  protected constructor(group: string, name: string) {
    this.group = group;
    this.name = name;
  }

  public getGroup() {
    return this.group;
  }

  public getName() {
    return this.name;
  }

  public getTitle() {
    return `${this.group} ${this.name}`;
  }

  public abstract run(message: Message): void;

  // ToDo: handle aliases
  public isValid(message: Message): boolean {
    return message.content.startsWith(this.getTitle());
  }

  protected async askQuestions(
    questions: string[], user: User, timeout?: number,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const time = timeout || 5 * 60 * 1000;
      Bot.registerConversation(user.id);

      const answers: string[] = [];

      let currentQuestion = questions.shift();
      if (!currentQuestion) {
        resolve(answers);
        return;
      }

      const collector = user.dmChannel?.createMessageCollector(
        (msg: Message) => msg.author.id === user.id,
        { time },
      );

      collector?.on('collect', (msg: Message) => {
        answers.push(msg.content);

        currentQuestion = questions.shift();
        if (currentQuestion) {
          user.send(currentQuestion);
        } else {
          collector.stop('done');
        }
      });

      collector?.on('end', (collected, reason) => {
        if (reason && reason === 'done') {
          Bot.deregisterConversation(user.id);
          resolve(answers);
          return;
        }
        user.send('Timeout');
        reject(new ConversationTimeoutError(`Timeout of ${time} reached`));
      });

      user.send(currentQuestion);
    });
  }
}
