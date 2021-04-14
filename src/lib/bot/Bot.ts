import { Client } from 'discord.js';

class Bot {
  bot: Client;

  constructor() {
    this.bot = new Client();
  }
}

export default new Bot();
