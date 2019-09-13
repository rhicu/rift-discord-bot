import CommandGroup from '../lib/command/CommandGroup'
import Bot from '../lib/bot/Bot'
import * as list from '../commands/character/_list'

export default class Character extends CommandGroup {
    constructor(bot: Bot) {
        super(bot, 'character')
    }

    _loadCommands() {
        this.commands = new Map()

        Object.keys(list).forEach((key) => {
            const command = Object.values(list).filter((value) => {
                return value.name === key.toString()
            })[0]

            const cmd = new command(this.bot)
            this.setCommand(key.toLowerCase(), cmd)
            cmd.aliases.forEach((alias) => {
                this.setCommand(alias.toLowerCase(), cmd)
            })
        })
    }


}
