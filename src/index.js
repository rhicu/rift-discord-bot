const Commando = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')

const privateData = require('./private.conf')
const commandoConfig = require('./commando.conf')

const client = new Commando.Client({
    owner: privateData.owner
})

client.registry
    // Registers your custom command groups
    .registerGroups(commandoConfig.groups)

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    .registerTypesIn(path.join(__dirname, 'types'))

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3'))
        .then((db) => new Commando.SQLiteProvider(db))
).catch(console.error)

client
    .on('ready', () => {
        console.log('Logged in!')
    })

client.login(privateData.token)
