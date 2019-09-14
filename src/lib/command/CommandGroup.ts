import Command from './Command'
import Bot from '../bot/Bot'

export default abstract class CommandGroup {

    protected bot: Bot
    public name: String
    protected commands: Map<String, Command>

    constructor(bot: Bot, name: String) {
        this.bot = bot
        this.name = name.toLowerCase()
        this.commands = new Map<String, Command>()

        this._loadCommands()
    }

    protected abstract _loadCommands(): void

    protected _setCommand(name: String, cmd: Command) {
        name = name.toLowerCase()
        if ( this.commands.has(name) ) {
            throw new Error(`There is already a command with name "${name}"`)
        }

        this.commands.set(name, cmd)
    }

    getCommand(key: String): Command {
        key = key.toLowerCase()
        if(this.commands.has(key)) return this.commands.get(key)
        else throw new Error(`Unknown command "${key}" in group "${this.name}"`)
    }

    hasCommand(key: String): Boolean {
        key = key.toLowerCase()
        return this.commands.has(key)
    }
}
