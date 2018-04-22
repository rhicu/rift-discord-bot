/** */
class Util {

    /**
     * @param {Array<String>} array
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
}

module.exports = Util
