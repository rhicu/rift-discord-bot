/** */
class Util {

    /**
     * @param {Array} array
     * @return {String}
     */
    static multiLineStringFromArray(array) {
        let string = ''
        for(let i = 0; i < array.length; i++) {
            string = `${string}${array[i]}\n`
        }
        return string
    }

    /**
     * @param {Array} array
     * @return {String}
     */
    static numberedMultiLineStringFromArray(array) {
        let string = ''
        for(let i = 0; i < array.length; i++) {
            string = `${string}${i+1}. ${array[i]}\n`
        }
        return string
    }

    /**
     * @param {Array<JSON>} playerArray
     * @return {String}
     */
    static getPlayerAsStringForRaidOutput(playerArray) {
        if(playerArray.length < 1) {
            return '...'
        }
        let outputArray = []
        playerArray.forEach((player) => {
            outputArray.push(player.data)
        })
        return Util.numberedMultiLineStringFromArray(outputArray)
    }

    /**
     * @param {Array<JSON>} array
     * @return {String[]}
     */
    static getPlayerNamesFromJSONArray(array) {
        let playerNames = []
        array.forEach((player) => {
            playerNames.push(player.name)
        })
        return playerNames
    }

    /**
     * @param {String} string
     * @return {String}
     */
    static makeFirstLetterOfStringUppercase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     * @param {String} string
     * @return {String}
     */
    static formatPlayerName(string) {
        const nameAndShard = string.split('@')
        const name = Util.makeFirstLetterOfStringUppercase(nameAndShard[0])
        const shard = Util.makeFirstLetterOfStringUppercase(nameAndShard[1])
        return `${name}@${shard}`
    }

    /**
     * @param {String} string
     * @return {String}
     */
    static getDay(string) {
        return string
    }

    /**
     * @param {String} string
     * @return {String}
     */
    static getDate(string) {
        return string
    }

    /**
     *
     * @param {Raid[]} raidArray
     * @param {Raid} raidObject
     */
    static pushRaidToArraySortedByDate(raidArray, raidObject) {
        let i = 0
        for (; i < raidArray.length && raidArray[i].priority() <= raidObject.priority(); i++);
        raidArray.splice(i, 0, raidObject)
    }

    /**
     * Makes the input to lower case, deletes multiple spaces
     * and makes sure that there are no spaces after a comma
     * @param {String} input
     * @return {String}
     */
    static beautifyUserInput(input) {
        return input
            // delete multiple spaces
            .split(' ')
            .filter((element) => {
                return (element !== '')
            }).join(' ')
            // delete spaces after appearence of a comma
            .split(', ')
            .join(',')
            // make string lower case to better work with user inputs
            .toLowerCase()
    }

    /**
     * @param {JSON} roles
     * @return {String}
     */
    static rolesToString(roles) {
        let string = ''
        if(roles.tank) string += 'Tank, '
        if(roles.dd) string += 'DD, '
        if(roles.heal) string += 'Heal, '
        if(roles.support) string += 'Support, '

        if(string === '') return string
        else return string.slice(0, -2)
    }
}

module.exports = Util
