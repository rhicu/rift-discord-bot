exports.run = (bot, msg, args, permLevel) => {
    if (!args[0]) {
        const commandNames = Array.from(bot.commands.keys())
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)
        msg.channel.send(`= Liste mit verfügbaren Befehlen =\n\n[Benutz hilfe <Befehl> für Details]\n\n${bot.commands
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
    aliases: ['h', 'halp', 'help'],
    permLevel: 0
}

exports.help = {
    name: 'hilfe',
    description: 'Zeigt alle verfügbaren Befehle für deine Berechtigungstufe',
    usage: 'hilfe <Befehl>'
}
