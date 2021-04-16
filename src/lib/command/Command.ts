import { AppMessage } from '@lib/DiscordjsWrapper';

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

  public abstract run(message: AppMessage): void;

  // ToDo: handle aliases
  public isValid(message: AppMessage): boolean {
    return message.getContent().startsWith(this.getTitle());
  }
}
