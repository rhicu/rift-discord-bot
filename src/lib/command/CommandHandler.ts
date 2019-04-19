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
        this.root = root
        this._initDefaults()
        this.loadCommands()
    }

    _initDefaults() {
        const dirPath = path.join(this.root, 'defaults')
        this.groups.set('defaults', new CommandGroup(dirPath, 'defaults', this.bot))
    }

    loadCommands() {
        this.groups = new Map
        const dirs = fs.readdirSync(this.root)
        dirs.forEach((dir) => {
            if(dir === 'defaults') return
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
            } else {
                this.groups.get('defaults')
                    .getCommand(commandName)
                    .run(message, args.slice(2))
            }
            message.reply(`Command "${args[0]}" could not be found!`)
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
}
