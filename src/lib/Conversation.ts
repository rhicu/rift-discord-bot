import Command from './command/Command';
import CommandSession from './command/CommandSession';
import { AppMessage } from './DiscordjsWrapper';

export default class Conversation {
  userID: string;

  command: Command<CommandSession>;

  session: CommandSession;

  constructor(userId: string, command: Command<CommandSession>) {
    this.userID = userId;
    this.command = command;
    this.session = command.createSession();
  }

  public continue(message: AppMessage) {
    this.command.run(message);
  }
}
