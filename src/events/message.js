const util = require('../util/util')

/**
 * @param {Message} msg
 */
module.exports = (msg) => {
    if (msg.author.bot) return

    if(msg.channel.type !== 'dm') return
    // if (!msg.content.startsWith(config.prefix)) return
    // if(msg.content.startsWith(config.communicationPrefix)) return

    const client = msg.client
    const input = util.beautifyUserInput(msg.content)

    const command = input.split(' ')[0]
    const args = input.split(' ').slice(1)
    const permissionLevel = client.elevation(msg)

    let cmd
    if (client.commands.has(command)) {
        cmd = client.commands.get(command)
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command))
    } else if (client.commands.has('help')) {
        cmd = client.commands.get('help')
    }
    if (cmd) {
        if (permissionLevel < cmd.conf.permLevel) return
        cmd.run(client, msg, args, permissionLevel)
    }
}
