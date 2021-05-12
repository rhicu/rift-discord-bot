import Command from '@lib/command/Command';
import CommandSession from '@lib/command/CommandSession';
import Conversation from '@lib/Conversation';
import { Client } from 'discord.js';

class AppClient extends Client {
  private openConversations: Map<string, Conversation> = new Map();

  public hasOpenConversation(userID: string) {
    return this.openConversations.has(userID);
  }

  public createConversation(userID: string, command: Command<CommandSession>) {
    if (this.hasOpenConversation(userID)) {
      throw new Error('Open Conversation already exists!');
    }

    const conversation = new Conversation(userID, command);
    this.openConversations.set(userID, conversation);
    return conversation;
  }

  public registerConversation(userID: string, conversation: Conversation) {
    if (this.hasOpenConversation(userID)) {
      throw new Error('Open Conversation already exists!');
    }

    this.openConversations.set(userID, conversation);
  }

  public deregisterConversation(userID: string) {
    if (!this.hasOpenConversation(userID)) {
      throw new Error('Open Conversation already exists!');
    }

    this.openConversations.delete(userID);
  }

  public getConversation(userID: string) {
    return this.openConversations.get(userID);
  }
}

export default new AppClient();
