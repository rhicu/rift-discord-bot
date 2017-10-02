const util = require('../utils/util');
const raidProperties = require('../config.json');

exports.run = (bot, msg) => {

    const possibleRaidTypes = ['td', 'irotp']

    const message = msg.content.split(' ');
    if(message.length != 4) {
        msg.reply('Invalid number of Arguments! Please verify your input!');
        return;
    }
    try {
        const type = message[1];
        if(type !== 'irotp' || type !== 'td') {
            msg.reply('unknown raid, use \'irotp\' or \'td\'');
            return;
        }
        const day = util.getDay(message[2]);
        const date = util.getDate(message[3]);

        (async () => {
            const id = await db.get('SELECT * FROM data WHERE name = "actualRaidID"')
                .then((row) => {
                    if(!row) {
                        db.run('INSERT INTO data (name, intValue, stringValue) VALUES (?, ?, ?)', ['actualRaidID', 1000, '']);
                        return 1000;
                    } else {
                        db.run(`UPDATE data SET intValue = ${row.intValue + 1} WHERE name = "actualRaidID"`);
                        return row.intValue + 1;
                    }
                }).catch((error) => {
                    console.log(error);
                    db.run('CREATE TABLE IF NOT EXISTS data (name TEXT, intValue INTEGER, stringValue TEXT)')
                        .then(() => {
                            db.run('INSERT INTO data (name, intValue, stringValue) VALUES (?, ?, ?)', ['actualRaidID', 1000, '']);
                            return 1000;
                        });
                });
            db.run('INSERT INTO raids (raidID, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                .catch((error) => {
                    console.log(error);
                    db.run('CREATE TABLE IF NOT EXISTS raids (raidID INTEGER, type TEXT, day TEXT, date TEXT)').then(() => {
                        db.run('INSERT INTO raids (raidID, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date]);
                    });
                });
            
        })();
        msg.reply(`raid "${newRaid.name}" added`);
        this.printRaids();
    } catch(error) {
        console.log(`addRaid: ${error}`);
        msg.reply('Couldn\'t create raid');
    }

    msg.reply('Couldn\'t create raid');
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['add'],
    permLevel: 2
};

exports.help = {
    name: 'addRaid',
    description: 'Just adding a fucking new raid to planner',
    usage: 'addRaid <td / irotp> <day> <date>'
};
