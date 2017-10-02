/**
 * 
 */
class util {

    /**
     * 
     */
    constructor() {}

    /**
     * 
     * @param {array} array 
     * @return {string}
     */
    static multiLineStringFromArray(array) {
        let string = '';
        for(let i = 0; i < array.length; i++) {
            string = `${string}${array[i]}\n`
        }
        return string;
    }

    /**
     * 
     * @param {array} array 
     * @return {string}
     */
    static numberedMultiLineStringFromArray(array) {
        let string = '';
        for(let i = 0; i < array.length; i++) {
            string = `${string}${i+1}. ${array[i]}\n`
        }
        return string;
    }

    /**
     * 
     * @param {string} string
     * @return {string} 
     */
    static getDay(string) {
        return string;
    }

    /**
     * 
     * @param {string} string 
     * @return {string}
     */
    static getDate(string) {
        return string;
    }
}

module.exports = util;
