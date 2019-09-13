import { Message } from 'discord.js'
import CommandGroup from './CommandGroup'

export default class CommandMessage {
    public readonly original: Message
    private _commandGroup: String = null
    private _command: String = null
    private _args: String[] = null

    constructor(message: Message, commandGroups: Map<String, CommandGroup>) {
        this.original = message

        const input = this._beautifyInput(this.original)
        this._setCommandAndGroup(input, commandGroups)
        this._setArgs(input)
    }

    private _beautifyInput(message: Message): String[] {
        return message.content
            // make string lower case to better work with user inputs
            .toLowerCase()
            // delete multiple spaces
            .split(' ')
            .filter((element) => {
                return (element !== '')
            })
    }

    private _setCommandAndGroup(input: String[], commandGroups: Map<String, CommandGroup>): void {

        if ( input.length < 1 ) {
            throw new Error('No Content given!')
        }

        if ( input.length === 1 ) {
            if ( commandGroups.get('defaults').hasCommand(input[0]) ) {
                this._commandGroup = 'defaults'
                this._command = input[0]
                return
            } else {
                throw new Error('Command does not exist!')
            }
        }

        if ( commandGroups.has(input[0]) ) {
            this._commandGroup = input[0]
        }

        if ( this._commandGroup ) {
            if ( commandGroups.get(this._commandGroup).hasCommand(input[1]) ) {
                this._command = input[1]
                return
            } else {
                throw new Error(`Command ${input[1]} on group ${this._commandGroup} does not exist!`)
            }
        } else {
            if ( commandGroups.get('defaults').hasCommand(input[0]) ) {
                this._command = input[0]
                return
            } else {
                throw new Error(`Command ${input[0]} does not exist!`)
            }
        }
    }

    private _setArgs(input: String[]) {
        if ( this._commandGroup === 'defaults' && input.length > 1 ) {
            this._args = input.slice(1)
        } else if ( this._commandGroup !== 'defaults' && input.length > 2 ){
            this. _args = input.splice(2)
        }
    }

    get args(): String[] {
        return this._args
    }

    get command(): String {
        return this._command
    }

    get commandGroup(): String {
        return this._commandGroup
    }
}
