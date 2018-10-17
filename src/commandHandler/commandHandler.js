const fs = require('fs')
const Discord = require('discord.js')
const InvalidInputError = require('../util/error')

/** */
class CommandHandler {

    /**
     * @param {String} commandFolderPath
     */
    constructor(commandFolderPath) {
        this.commandFolderPath = commandFolderPath

        this.commands = new Discord.Collection()
        this.help = new Discord.Collection()
    }

    /**
     * @param {String} commandName
     * @param {Object} command
     */
    _setCommand(commandName, command) {
        this.commands.set(commandName, command)
    }

    /**
     * @param {String[]} input
     * @param {Discord.Collection} collection
     * @return {Object}
     */
    _getCommand(input, collection = this.commands) {
        if(!input[0]) return undefined
        const cmd = collection.get(input[0])
        if(cmd === undefined) return undefined
        if(cmd.conf) return cmd

        return this._getCommand(input.slice(1))
    }

    /**
     * @param {String} commandName
     * @param {Object} command
     * @param {Discord.Collection} collection
     */
    _setCommandToCommands(commandName, command, collection = this.commands) {
        cmd = this._getCommand
    }

    /**
     * @param {String} input
     * @param {Discord.Collection} collection
     * @return {Boolean}
     */
    _hasCommand(input, collection = this.commands) {
        if(!input[0]) return false
        const cmd = this.commands.get(input[0])
        if(cmd === undefined) return false
        if(cmd.conf) return true

        return this._getCommand(input.slice(1))
    }

    /**
     * @param {String[]} splittedInput
     */
    executeCommand(splittedInput) {
        if(!splittedInput || splittedInput.length < 1) {
            throw new InvalidInputError('Too few Arguments')
        }
    }

    /**
     * @param {String | null} subfolderName
     * @param {fs.Dirent} file
     */
    _loadCommand(subfolderName, file) {
        if (subfolderName) {
            let props = require(`${this.commandFolderPath}/${subfolderName}/${file.name}`)
            console.log(`   ${props.help.name} OK!`)
            const commandName = subfolderName + ' ' + props.help.name.toLowerCase()
            this.commands.set(commandName, props)
            props.conf.aliases.forEach((alias) => {
                const aliasName = subfolderName + ' ' + alias.toLowerCase()
                this.aliases.set(aliasName, commandName)
            })
        } else {
            let props = require(`${this.commandFolderPath}/${file.name}`)
            console.log(`${props.help.name} OK!`)
            this.commands.set(props.help.name.toLowerCase(), props)
            props.conf.aliases.forEach((alias) => {
                this.aliases.set(alias.toLowerCase(), props.help.name.toLowerCase())
            })
        }
    }

    /**
     * @param {String} subfolderName
     */
    loadCommands(subfolderName = '') {
        const path = (subfolderName === '') ? this.commandFolderPath : (this.commandFolderPath + '/' + subfolderName)
        const fsDirentArray = fs.readdirSync(path, {withFileTypes: true})
        let folders = []

        fsDirentArray.forEach((fsDirent) => {
            if(fsDirent.isDirectory()) {
                folders.push(fsDirent)
            } else {
                this._loadCommand(subfolderName, fsDirent)
            }
        })

        console.log('')

        folders.forEach((folder) => {
            console.log(folder.name)
            this.loadCommands(folder.name)
        })
    }
}

module.exports = CommandHandler
