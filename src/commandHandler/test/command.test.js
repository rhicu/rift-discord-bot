const Command = require('../src/command')

describe('isCommand', () => {

    let command

    beforeEach(() => {
        const commandObject = {
            run: () => {
                return true
            },
            help: {
                name: 'TestCommand',
                description: 'any description text',
                usage: 'do it that way'
            },
            conf: {
                enabled: true,
                guildOnly: false,
                aliases: ['alias1', 'alias2', 'alias3'],
                permLevel: 2
            }
        }

        command = new Command('TestCommand', commandObject)
    })

    test('should return true if given name equals command name', () => {
        expect(command.isCommand('TestCommand')).toBe(true)
    })

    test('should return true if given name equals any alias name', () => {
        expect(command.isCommand('alias2')).toBe(true)
    })

    test('should return false if given name is neither the command name nor any alias name', () => {
        expect(command.isCommand('WrongCommandName')).toBe(false)
    })
})
