import Command from '@lib/command/Command';
import { Message } from 'discord.js';

class CreatePlayerCommand extends Command {
  constructor() {
    super('spieler', 'erstellen');
  }

  run(message: Message) {
    message.reply(`${message.content} ${message.author.id}`);
  }
}

export default new CreatePlayerCommand();
