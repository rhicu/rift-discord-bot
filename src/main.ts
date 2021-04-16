import Command from '@lib/command/Command';
import logger from '@lib/logger';
import config from '@src/configuration/SystemConfiguration';
import Bot from '@lib/DiscordjsWrapper/AppClient';
import { Message } from 'discord.js';
import { AppMessage } from '@lib/DiscordjsWrapper';
import CommandRespository from './lib/command/CommandRespository';

Bot.on('ready', () => {
  logger.info(`Logged in as ${Bot?.user?.tag}!`);
});

Bot.on('message', (message: Message) => {
  const msg = new AppMessage(message);
  try {
    if (msg.getUser().isBot()) {
      return;
    }

    if (Bot.hasOpenConversation(msg.getUser().getID())) {
      return;
    }

    logger.debug(`Received message: ${msg.getContent()}`);

    const command: Command|null = CommandRespository.getCommand(msg);

    if (!command) {
      logger.debug(`Command not found: ${msg.getContent()}`);
      msg.getUser().send('Unknown command!');
      return;
    }

    logger.info(`Execute Command: ${command.getTitle()}`);
    command.run(msg);
  } catch (error) {
    logger.error('Something unexpected happened!', error);
  }
});

Bot.login(config.TOKEN);
