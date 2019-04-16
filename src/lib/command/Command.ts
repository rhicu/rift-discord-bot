import { Message } from 'discord.js'
import { CommandOptions } from './CommandOptions';
import Bot from '../bot/Bot';
import CommandGroup from './CommandGroup';

export abstract class Command {
    readonly bot: Bot
    readonly name: String
    readonly aliases: String[]

    constructor(bot: Bot, options: CommandOptions) {
        this.bot = bot
        this.name = options.name
        this.aliases = options.aliases
    }

    toString() {
        return `${this.name}`
    }

    abstract run(message: Message, args: String[]): void;
}