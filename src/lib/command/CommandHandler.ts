import CommandGroup from './CommandGroup'
import Bot from '../bot/Bot'
import { Message } from 'discord.js'
import CommandMessage from './CommandMessage'

import * as list from '../../commandGroups/_list'

export default class CommandHandler {

    private bot: Bot
    private commandGroups: Map<String, CommandGroup>

    constructor(bot: Bot) {
        this.bot = bot
        this.commandGroups = new Map()

        this._loadCommandGroups()
    }

    private _loadCommandGroups() {
        this.commandGroups = new Map()

        Object.keys(list).forEach((key) => {
            const commandGroup = Object.values(list).filter((value) => {
                return value.name === key.toString()
            })[0]
            this.commandGroups.set(key.toLowerCase(), new commandGroup(this.bot))
        })
    }

    executeCommand(message: Message): void {
        let msg
        try {
            msg = new CommandMessage(message, this.commandGroups)
        } catch(error) {
            message.reply(error.message)
        }

        this.commandGroups.get(msg.commandGroup)
            .getCommand(msg.command)
            .run(message, msg.args)
    }
}
