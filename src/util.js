class util {
    constructor() {}

    static multiLineStringFromArray(array) {
        let string = "";
        for(let i = 0; i < array.length; i++) {
            string = `${string}${array[i]}\n`
        }
        return string;
    }

    static numberedMultiLineStringFromArray(array) {
        let string = "";
        for(let i = 0; i < array.length; i++) {
            string = `${string}${i+1}. ${array[i]}\n`
        }
        return string;
    }

    static getDay(string) {
        return string;
    }

    static getDate(string) {
        return string;
    }
}

module.exports = util;