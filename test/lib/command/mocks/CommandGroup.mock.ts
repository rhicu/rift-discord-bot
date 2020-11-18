import CommandGroup from '../../../../src/lib/command/CommandGroup'
import Command from '../../../../src/lib/command/Command'
import { mock } from 'ts-mockito'

export const mockedCommand = mock(Command)

export class TestGroup extends CommandGroup {
    _loadCommands() {
        this._setCommand('test', mockedCommand)
    }
}

export class TestGroupWithDuplicatedCommandNames extends CommandGroup {
    _loadCommands() {
        this._setCommand('test', mockedCommand)
        this._setCommand('test', mockedCommand)
    }
}