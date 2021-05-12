import { AppMessage } from '@lib/DiscordjsWrapper';
import CommandSession from './CommandSession';

export default abstract class Command<T extends CommandSession> {
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

  public abstract run(message: AppMessage): void;

  public abstract continue(message: AppMessage, session: T): void;

  // ToDo: handle aliases
  public isValid(message: AppMessage): boolean {
    return message.getContent().startsWith(this.getTitle());
  }

  public abstract createSession(): T;
}
