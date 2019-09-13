import { Message } from 'discord.js'
import { CommandOptions } from './CommandOptions';
import Bot from '../bot/Bot';

export default abstract class Command {
    protected readonly bot: Bot
    public readonly name: String
    protected readonly aliases: String[]

    constructor(bot: Bot, options: CommandOptions) {
        this.bot = bot
        this.name = options.name
        this.aliases = options.aliases
    }

    toString() {
        return `${this.name} [${this.aliases.toString()}]`
    }

    abstract run(message: Message, args: String[]): void;
}