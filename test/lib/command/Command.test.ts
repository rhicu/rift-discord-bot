import { mock } from 'ts-mockito'
import Bot from '../../../src/lib/bot/Bot'
import Command from '../../../src/lib/command/Command'
import { expect } from 'chai'
import { TestCommand } from './mocks/Command.mock'
import { mockedBot } from './mocks/Bot.mock'

describe('Command', () => {
    let bot: Bot = mockedBot
    let cmd: Command

    beforeEach(() => {
        cmd = new TestCommand(bot, {name: 'Test', aliases: ['t', 'test']})
    })

    describe('toString()', () => {
        it('should return correct output', () => {
            expect(cmd.toString()).to.equal('Test [t,test]')
        })
    })
})
