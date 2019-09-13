import Command from "../../lib/command/Command";
import { Message } from "discord.js";
import CommandGroup from "../../lib/command/CommandGroup";

export default class Help extends Command {
    run(message: Message, args: String[]): void {
        // const groups = this.bot.commandHandler.groups

        // const helpMessage = this._initHelp()

        // groups.forEach((group) => {
        //     helpMessage.push(this._generateHelpOfGroup(group))
        // })

        // message.reply(helpMessage.join('\n'))
    }

    _initHelp(): String[] {
        return ['']
    }

    _generateHelpOfGroup(group: CommandGroup): String {
        return ''
    }

    _generateHelpOfCommand(command: Command): String {
        return ''
    }
}