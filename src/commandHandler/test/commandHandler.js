const CommandHandler = require('../src/commandHandler')

describe('executeCommand', () => {
    beforeEach(() => {
        commandHandler = new CommandHandler('./mockData/commandsMock')
    })

    test('should throw InvalidInputError on empty input', () => {
        
    })
})
