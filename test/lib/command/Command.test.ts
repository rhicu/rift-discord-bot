import { mock } from 'ts-mockito'
import Bot from '../../../src/lib/bot/Bot'
import Command from '../../../src/lib/command/Command'
import { expect } from 'chai'

class TestCommand extends Command {
    run() {}
}

describe('Command', () => {
    let bot: Bot
    let cmd: Command

    before(() => {
        bot = mock(Bot)
    })

    beforeEach(() => {
        cmd = new TestCommand(bot, {name: 'Test', aliases: ['t', 'test']})
    })

    describe('toString()', () => {
        it('correct output', () => {
            expect(cmd.toString()).to.equal('Test [t,test]')
        })
    })
})
