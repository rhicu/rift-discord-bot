exports.run = (bot, msg, args, permLevel) => {
    if (!args[0]) {
        const commandNames = Array.from(bot.commands.keys())
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)
        msg.channel.send(`= Command List =\n\n[Use help <commandname> for details]\n\n${bot.commands
            .map((c) => {
                if(c.conf.permLevel <= permLevel) {
                    return `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`
                }
            })
            .filter((element) => element !== undefined)
            .join('\n')}`, {code: 'asciidoc'})
    } else {
        let command = args[0]
        if (bot.commands.has(command)) {
            command = bot.commands.get(command)
            msg.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage :: ${command.help.usage}\nalias :: ${command.conf.aliases.toString()}`, {code: 'asciidoc'})
        }

        if (bot.aliases.has(command)) {
            command = bot.commands.get(bot.aliases.get(command))
            msg.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage :: ${command.help.usage}\nalias :: ${command.conf.aliases.toString()}`, {code: 'asciidoc'})
        }
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp'],
    permLevel: 0
}

exports.help = {
    name: 'help',
    description: 'Displays all the available commands for your permission level.',
    usage: 'help <command>'
}
