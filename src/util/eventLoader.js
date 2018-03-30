const reqEvent = (event) => require(`../events/${event}`)

/**
 * @param {Client} client
 */
module.exports = (client) => {
    client.on('message', reqEvent('message'))
}
