const Raid = require('../../src/raid/raidNew')
const RaidFactory = require('../../src/raid/raidFactory')

const factory = new RaidFactory()

describe('testing _getType()', () => {

    test('should return null with number input ("8")', () => {
        expect(factory._getType('8')).toBe(null)
    })

    test('should return null with empty string input ("")', () => {
        expect(factory._getType('')).toBe(null)
    })

    test('should return null with invalid string input ("bla")', () => {
        expect(factory._getType('bla')).toBe(null)
    })

    test('should return null with invalid string input ("irot")', () => {
        expect(factory._getType('irot')).toBe(null)
    })

    test('should return null with invalid string input ("irotpa")', () => {
        expect(factory._getType('irotpa')).toBe(null)
    })

    test('should return "irotp" with correct input ("irotp")', () => {
        expect(factory._getType('irotp')).toBe('irotp')
    })

    test('should return "irotp" with correct input ("phönix")', () => {
        expect(factory._getType('phönix')).toBe('irotp')
    })

    test('should return "td" with correct input ("td")', () => {
        expect(factory._getType('td')).toBe('td')
    })

    test('should return "td" with correct input ("Tatarische Tiefen")', () => {
        expect(factory._getType('Tatarische Tiefen')).toBe('td')
    })
})

describe('testing newRaid()', () => {

    test('should return null with wrong input', () => {
        expect(factory.newRaid('bla')).toBe(null)
    })

    test('should return a new irotp Raid object with correct input', () => {
        expect(factory.newRaid('irotp')).toEqual(new Raid('irotp'))
    })

    test('should return a new td Raid object with correct input', () => {
        expect(factory.newRaid('td')).toEqual(new Raid('td'))
    })
})
