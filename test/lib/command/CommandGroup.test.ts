import { mock } from 'ts-mockito'
import Bot from '../../../src/lib/bot/Bot'
import Command from '../../../src/lib/command/Command'
import { expect } from 'chai'
import CommandGroup from '../../../src/lib/command/CommandGroup'
import { TestGroup, TestGroupWithDuplicatedCommandNames, mockedCommand } from './mocks/CommandGroup.mock'
import { mockedBot } from './mocks/Bot.mock'

describe('CommandGroup', () => {
    let bot: Bot = mockedBot
    let group: CommandGroup

    describe('initialization', () => {
        it('should init successfully with non existing command', () => {
            expect(() => new TestGroup(bot, 'Test')).not.to.throw()
        })

        it('should throw error on init with duplicated command names', () => {
            expect(() => new TestGroupWithDuplicatedCommandNames(bot, 'Test')).to.throw('There is already a command with name "test"')
        })

        it('should have name in lowercase', () => {
            group = new TestGroup(bot, 'Test')
            expect(group.name).to.equal('test')
        })
    })

    describe('getCommand()', () => {
        before(() => {
            group = new TestGroup(bot, 'Test')
        })

        it('should return correct command if existing', () => {
            const newCommand = mock(Command)

            expect(group.getCommand('test')).to.equal(mockedCommand)
            expect(group.getCommand('test')).not.to.equal(newCommand)
        })

        it('should not be case sensitive', () => {
            expect(() => group.getCommand('Test')).not.to.throw()
            expect(() => group.getCommand('test')).not.to.throw()
            expect(group.getCommand('Test')).to.equal(mockedCommand)
        })

        it('should throw error if command does not exists', () => {
            expect(() => group.getCommand('NotExisting')).to.throw('Unknown command "notexisting" in group "test"')
        })
    })

    describe('hasCommand()', () => {
        before(() => {
            group = new TestGroup(bot, 'Test')
        })

        it('should return true if command exists', () => {
            expect(group.hasCommand('test')).to.be.true
        })

        it('should return false if command does not exist', () => {
            expect(group.hasCommand('NotExisting')).to.be.false
        })

        it('should not be case sensitive', () => {
            expect(group.hasCommand('Test')).to.be.true
            expect(group.hasCommand('test')).to.be.true
        })
    })
})
