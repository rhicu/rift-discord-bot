import { CreateCharacter } from '@commands';
import { AppMessage } from '@lib/DiscordjsWrapper';
import Command from './Command';

class CommandRepository {
  private commands: Command[] = [];

  constructor() {
    this.addCommand(CreateCharacter);
  }

  private addCommand(command: Command) {
    this.commands.push(command);
  }

  getCommand(message: AppMessage): Command|null {
    this.commands.filter((command) => command.isValid(message));

    for (let i = 0; i < this.commands.length; i += 1) {
      if (this.commands[i].isValid(message)) {
        return this.commands[i];
      }
    }

    return null;
  }

  getGroupCommands(group: string): Command[] {
    return this.commands.filter((command) => command.getGroup() === group);
  }
}

export default new CommandRepository();
