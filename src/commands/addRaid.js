const util = require('../util/util')
const raidProperties = require('../raid/raidConfig.json')

exports.run = (bot, msg) => {
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['add'],
    permLevel: 2
}

exports.help = {
    name: 'addRaid',
    description: 'Just adding a fucking new raid to planner',
    usage: 'addRaid <td / irotp> <day> <date>'
}
