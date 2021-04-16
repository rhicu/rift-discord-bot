import {
  Message, User,
} from 'discord.js';
import { AppMessageCollector } from '.';
import AppUserError from './AppUserError';

export default class AppUser {
  private discordjsUser: User;

  constructor(user: User) {
    this.discordjsUser = user;
  }

  getID() {
    return this.discordjsUser.id;
  }

  isBot() {
    return this.discordjsUser.bot;
  }

  async send(msg: string): Promise<void> {
    await this.discordjsUser.send(msg);
  }

  /**
   *
   * @param timeout timeout in seconds
   * @returns {AppMessageCollector}
   */
  getMessageCollector(timeout: number): AppMessageCollector {
    const collector = this.discordjsUser.dmChannel?.createMessageCollector(
      (msg: Message) => msg.author.id === this.discordjsUser.id,
      { time: timeout * 1000 },
    );

    if (!collector) {
      throw new AppUserError('Could not create message collector');
    }

    return new AppMessageCollector(collector, this);
  }
}
