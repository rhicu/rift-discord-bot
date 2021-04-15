import { Message } from 'discord.js';

export default abstract class Command {
  protected group: string;

  protected name: string;

  protected constructor(group: string, name: string) {
    this.group = group;
    this.name = name;
  }

  getGroup() {
    return this.group;
  }

  getName() {
    return this.name;
  }

  getTitle() {
    return `${this.group} ${this.name}`;
  }

  public abstract run(message: Message): void;

  // ToDo: handle aliases
  isValid(message: Message): boolean {
    return message.content.startsWith(this.getTitle());
  }
}
