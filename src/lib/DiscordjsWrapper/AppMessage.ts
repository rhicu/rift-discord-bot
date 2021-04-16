import { Message } from 'discord.js';
import AppUser from './AppUser';

export default class AppMessage {
  private discordMessage: Message;

  private user: AppUser;

  constructor(msg: Message) {
    this.discordMessage = msg;
    this.user = new AppUser(this.discordMessage.author);
  }

  getContent() {
    return this.discordMessage.content;
  }

  getUser() {
    return this.user;
  }

  reply(msg: string) {
    return this.getUser().send(msg);
  }
}
