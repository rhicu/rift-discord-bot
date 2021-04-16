import { Client } from 'discord.js';

class Bot extends Client {
  private openConversations: Set<string> = new Set();

  public hasOpenConversation(userID: string) {
    return this.openConversations.has(userID);
  }

  public registerConversation(userID: string) {
    if (this.hasOpenConversation(userID)) {
      throw new Error('Open Conversation already exists!');
    }

    this.openConversations.add(userID);
  }

  public deregisterConversation(userID: string) {
    if (!this.hasOpenConversation(userID)) {
      throw new Error('Open Conversation already exists!');
    }

    this.openConversations.delete(userID);
  }
}

export default new Bot();
