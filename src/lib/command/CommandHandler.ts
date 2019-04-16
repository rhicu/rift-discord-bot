import CommandGroup from "./CommandGroup";
import fs from 'fs'
import path from 'path'
import Bot from "../bot/Bot";
import { Message, RichEmbed } from "discord.js";

export default class CommandHandler {

    bot: Bot
    groups: Map<String, CommandGroup>
    defaults: Map<String, Function>
    root: string

    constructor(root: string, bot: Bot) {
        this.bot = bot
        this.groups = new Map
        this.defaults = new Map
        this.root = root
        this._initDefaults()
        this.loadCommands()
    }

    _initDefaults() {
        this.defaults.set('help', this.help)
        this.defaults.set('h', this.help)
        this.defaults.set('hilfe', this.help)
    }

    loadCommands() {
        this.groups = new Map
        const dirs = fs.readdirSync(this.root)
        dirs.forEach((dir) => {
            if(dir === 'default') return
            if(this.groups.has(dir)) throw new Error(`There is already a group named "${dir}"`)

            const dirPath = path.join(this.root, dir)
            if(fs.statSync(dirPath).isDirectory()) {
                this.groups.set(dir, new CommandGroup(dirPath, dir, this.bot))
            }
        })
    }

    executeCommand(message: Message): void {
        const args = this._beautifyArgs(message)
        const groupName = args[0]
        const commandName = args[1]

        try {
            if(this.groups.has(groupName)) {
                this.groups.get(groupName)
                    .getCommand(commandName)
                    .run(message, args.slice(2))
            } else if(this.defaults.has(groupName)) {
                this.defaults.get(groupName)(message, args, this)
            } else {
                message.reply(`Command "${args[0]}" could not be found!`)
            }
        } catch(e) {
            message.reply(e.message)
        }
    }

    _beautifyArgs(message: Message): String[] {
        return message.content
            // make string lower case to better work with user inputs
            .toLowerCase()
            // delete spaces after appearence of a comma
            .split(', ')
            .join(',')
            // delete multiple spaces
            .split(' ')
            .filter((element) => {
                return (element !== '')
            })
    }

    help(message: Message, args: String[], handler: CommandHandler) {
        message.reply(`${}`)
        handler.groups.forEach((group) => {
            message.reply(group.name)
        })
    }

    _generateHelpOfGroup(group: CommandGroup): String[] {
        const headline = ``
    }
}
