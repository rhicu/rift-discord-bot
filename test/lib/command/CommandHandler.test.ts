import Bot from '../../../src/lib/bot/Bot'
import { mockedBot } from './mocks/Bot.mock'
import CommandGroup from '../../../src/lib/command/CommandGroup'
import { mock, instance } from 'ts-mockito'
import CommandHandler from '../../../src/lib/command/CommandHandler'
import { expect } from 'chai'

describe('CommandHandler', () => {
    let bot: Bot = mockedBot
    let group: CommandGroup = mock(CommandGroup)
    let commandHandler: CommandHandler

    describe('initialization', () => {
        before(() => {
            commandHandler = mock(CommandHandler)
        })

        it('should...', () => {
            expect(() => new CommandHandler(bot)).not.to.throw()
            expect(() => instance(commandHandler)).not.to.throw()
        })
    })
})
