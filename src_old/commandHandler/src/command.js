/** */
class Command {

    /**
     * @param {String} name
     * @param {Object} command
     */
    constructor(name, command) {
        this.name = name

        this.help = command.help
        this.aliases = command.conf.aliases
        this.permLevel = command.conf.permLevel

        this.run = command.run
    }

    isCommand(name) {
        return name === this.name
            ? true
            : this._isInAliases(name)
    }

    _isInAliases(name) {
        return this.aliases.filter((alias) => {
            return alias === name
        }).length > 0
    }

}

module.exports = Command
