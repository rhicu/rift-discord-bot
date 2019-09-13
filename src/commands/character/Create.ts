import Command from "../../lib/command/Command";
import { Message } from "discord.js";
import Bot from '../../lib/bot/Bot';

export default class Create extends Command {

    constructor(bot: Bot) {
        super(bot, {
            name: 'create',
            aliases: ['c', 'anlegen', 'erstellen'],
        })
    }

    run(message: Message, args: String[]): void {
        message.author.send(args.join(' ') || 'no args')
    }
}