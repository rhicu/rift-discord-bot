import { Client } from 'discord.js';
import Command from '@lib/command/Command';
import logger from '@lib/logger';
import CommandRespository from './lib/command/CommandRespository';
import { token } from './config.json';

const client = new Client();

client.on('ready', () => {
  logger.info(`Logged in as ${client?.user?.tag}!`);
});

client.on('message', (msg) => {
  try {
    if (msg.author.bot) {
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

client.login(token);
