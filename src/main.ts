import Command from '@lib/command/Command';
import logger from '@lib/logger';
import config from '@src/configuration/SystemConfiguration';
import Bot from '@lib/bot/Bot';
import CommandRespository from './lib/command/CommandRespository';

Bot.on('ready', () => {
  logger.info(`Logged in as ${Bot?.user?.tag}!`);
});

Bot.on('message', (msg) => {
  try {
    if (msg.author.bot) {
      return;
    }

    if (Bot.hasOpenConversation(msg.author.id)) {
      return;
    }

    logger.debug(`Received message: ${msg.content}`);

    const command: Command|null = CommandRespository.getCommand(msg);

    if (!command) {
      logger.debug(`Command not found: ${msg.content}`);
      msg.reply('Unknown command!');
      return;
    }

    logger.info(`Execute Command: ${command.getTitle()}`);
    command.run(msg);
  } catch (error) {
    logger.error('Something unexpected happened!', error);
  }
});

Bot.login(config.TOKEN);
