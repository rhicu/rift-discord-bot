import { mock } from 'ts-mockito'
import Bot from '../../../src/lib/bot/Bot'
import Command from '../../../src/lib/command/Command'
import { expect } from 'chai'
import CommandGroup from '../../../src/lib/command/CommandGroup'

class TestGroup extends CommandGroup {
    _loadCommands() {}
}

describe('CommandGroup', () => {
    let bot: Bot
    let cmd: Command
    let group: CommandGroup

    before(() => {
        bot = mock(Bot)
        cmd = mock(Command)
    })

    beforeEach(() => {
        group = new TestGroup(bot, 'Test')
    })

    describe('initialization', () => {
        it('should init successfully with non existing command', () => {
            class TestGroupWithNewCommand extends CommandGroup {
                _loadCommands() {
                    this._setCommand('test', cmd)
                }
            }

            expect(() => { new TestGroupWithNewCommand(bot, 'Test') }).not.to.throw()
        })

        it('should throw error on init with duplicated command names', () => {
            class TestGroupWithDuplicatedCommandNames extends CommandGroup {
                _loadCommands() {
                    this._setCommand('test', cmd)
                    this._setCommand('test', cmd)
                }
            }

            expect(() => { new TestGroupWithDuplicatedCommandNames(bot, 'Test') }).to.throw('There is already a command with name "test"')
        })
    })
})
