import { Message } from 'discord.js';
import AppUser from './AppUser';

export default class AppMessage {
  private discordMessage: Message;

  constructor(msg: Message) {
    this.discordMessage = msg;
  }

  getContent() {
    return this.discordMessage.content;
  }

  getUser() {
    return new AppUser(this.discordMessage.author);
  }
}
