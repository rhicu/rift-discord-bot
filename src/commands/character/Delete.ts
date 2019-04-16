import { Command } from "../../lib/command/Command";
import { Message } from "discord.js";
import Bot from '../../lib/bot/Bot';

export default class Delete extends Command {

    constructor(bot: Bot) {
        super(bot, {
            name: 'delete',
            aliases: ['d', 'löschen'],
        })
    }

    run(message: Message, args: String[]): void {
        message.author.send(args.join(' ') || 'no args')
    }
}