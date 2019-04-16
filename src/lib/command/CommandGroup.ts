import { Command } from './Command'
import fs from 'fs'
import path from 'path'
import Bot from '../bot/Bot';

export default class CommandGroup {

    root: string
    bot: Bot
    name: String
    commands: Map<String, Command>

    constructor(root: string, name: String, bot: Bot) {
        this.root = root
        this.bot = bot
        this.name = name
        this.commands = new Map

        this.loadCommands()
    }

    loadCommands(): void {
        const files = fs.readdirSync(this.root)
        files.forEach((file) => {
            const filePath = path.join(this.root, file)
            if(fs.statSync(filePath).isFile()) {
                const command = this._loadCommandFromFile(filePath)
                this._setCommand(command)
            }
        })
    }

    _loadCommandFromFile(filePath: string): Command {
        return new (require(filePath).default)(this.bot)
    }

    _setCommand(command: Command): void {
        const keys = command.aliases
        keys.push(command.name)

        keys.forEach((key) => {
            if(this.commands.has(key)) throw new Error(`There is already a command named "${this.name}" in group "${command.name}"!`)

            this.commands.set(key, command)
        })
    }

    getCommand(key: String): Command {
        if(this.commands.has(key)) return this.commands.get(key)
        else throw new Error(`Unknown command "${key}" in group "${this.name}"`)
    }
}
