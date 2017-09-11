"use strict";

const Discord = require("discord.js");
const db = require("sqlite");
const config = require("./config.json");
const raid = require("./raid");
const player = require("./player");
const util = require("./util");
const N = "\n";

const communicationPrefix = config.communicationPrefix;

class messageHandler {
    constructor(bot) {
        this.raids = [];
        this.bot = bot;
        (async() => {
            try {
                await db.open(`${config.dbPath}riftDiscordBot.sqlite`);
                const rowsOfRaids = await db.all(`SELECT * FROM raids`)
                    .catch((error) => {
                        console.log(error);
                        db.run("CREATE TABLE IF NOT EXISTS raids (raidID Integer, name TEXT, type TEXT, day TEXT, date TEXT)");
                    });
                if (rowsOfRaids && rowsOfRaids.length !== 0) {
                    for (const raidInstance of rowsOfRaids) {
                        let newRaid = new raid(raidInstance.type);
                        newRaid.id = raidInstance.raidID;
                        newRaid.date = raidInstance.date;
                        newRaid.day = raidInstance.day;
                        this.raids.push(newRaid);

                        //add all registered players from db to runtime objects
                        const rowsOfRegisteredPlayer = await db.all(`Select * FROM registered WHERE raidID = ${raidInstance.raidID}`)
                            .catch((error) => {
                                console.log(error);
                                db.run("CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)");
                            });
                        if(rowsOfRegisteredPlayer && rowsOfRegisteredPlayer.length !== 0) {
                            for (const player of rowsOfRegisteredPlayer) {
                                const newPlayer = await this.createPlayerFromDatabase(player.userID, player.shortName);
                                newRaid.registeredPlayer.push(newPlayer);
                            }
                        }

                        //add all confirmed players form db to runtime objects
                        const rowsOfConfirmedPlayer = await db.all(`Select * FROM confirmed WHERE raidID = ${raidInstance.raidID}`)
                            .catch((error) => {
                                console.log(error);
                                db.run("CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)");
                            });
                        if(rowsOfConfirmedPlayer && rowsOfConfirmedPlayer.length !== 0) {
                            for (const player of rowsOfConfirmedPlayer) {
                                const newPlayer = await this.createPlayerFromDatabase(player.userID, player.shortName);
                                newRaid.confirmedPlayer.push(newPlayer);
                            }
                        }
                    }
                }
                this.actualRaidID = 1000;
                await db.get(`SELECT * FROM data WHERE name = "actualRaidID"`)
                    .then((row) => {
                        this.actualRaidID = row.intValue;
                    })
                    .catch((error) => {
                        console.log(error);
                        db.run("CREATE TABLE IF NOT EXISTS data (name TEXT, intValue INTEGER, stringValue TEXT)").then(() => {
                            db.run("INSERT INTO data (name, intValue, stringValue) VALUES (?, ?, ?)", ["actualRaidID", 1000, ""]);
                        });
                    });
                this.printRaids();
            } catch(error) {
                console.log(`constructor: ${error}`);
                throw new Error("Something went badly wrong!");
            }           
        })();
    }

    addRaid(msg) {
        const message = msg.content.split(" ");
        if(message.length != 4) {
            msg.reply("Invalid number of Arguments! Please verify your input!");
            return;
        }
        try {
            let type;
            switch(message[1]) {
                case "irotp":
                    type = "irotp";
                    break;
                case "td":
                    type = "td";
                    break;
                default:
                    msg.reply("unknown raid, use 'irotp' or 'td'");
                    return;
            }
            const newRaid = new raid(type);
            newRaid.day = util.getDay(message[2]);
            newRaid.date = util.getDate(message[3]);
            newRaid.id = this.actualRaidID + 1;

            if(newRaid.isValid()) {
                this.raids.push(newRaid);
                this.actualRaidID++;
                (async() => {
                    await db.run("INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)", [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                        .catch((error) => {
                            console.log(error);
                            db.run("CREATE TABLE IF NOT EXISTS raids (raidID INTEGER, name TEXT, type TEXT, day TEXT, date TEXT)").then(() => {
                                db.run("INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)", [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date]);
                            });
                        });
                    await db.run(`UPDATE data SET intValue = ${this.actualRaidID} WHERE name = "actualRaidID"`)
                })();
                msg.reply(`raid "${newRaid.name}" added`);
                this.printRaids();
            } else {
                msg.reply(`Couldn't create raid because of missing data. Please try again!`);
            }
        } catch(error) {
            console.log(`addRaid: ${error}`);
            msg.reply("Couldn't create raid");
        }
    }

    deleteRaid(msg) {
        try {
            const message = msg.content.split(" ");
            if(message.length != 2) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            const channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);

            const raidID = parseInt(message[1]);

            const index = this.raids.findIndex(r => r.id === raidID);
            if(index === -1) {
                msg.reply("Couldn't find the raid you wanted to delete!");
            } else {
                const raid = this.raids[index];
                if(raid.messageID !== "") {
                    channel.fetchMessage(raid.messageID)
                        .then(message => message.delete())
                        .catch(error => console.log(`deleteRaid: ${error}`));
                }
                this.raids.splice(index, 1);
                db.run(`DELETE FROM raids WHERE raidID = ${raid.id}`);
                db.run(`DELETE FROM registered WHERE raidID = ${raid.id}`);
                db.run(`DELETE FROM confirmed WHERE raidID = ${raid.id}`);
                msg.reply(`You successfully deleted raid ${raid.name} on ${raid.day}!`);
            }
        } catch(error) {
            console.log(`deleteRaid: ${error}`);
            msg.reply(`something bad happened :(`);
        }
    }

    updateRaid(msg) {
        try {
            if(msg.content.split(" ").length !== 4) {
                msg.reply("Invalid number of arguments!");
                return;
            }
            var raidInstance = msg.conent.split(" ")[1];
            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids[i].id === id) {
                    var option = msg.content.split(" ")[2];
                    var value = msg.content.split(" ")[3];
                    switch(option) {
                        case "day":
                            this.raids[i].day = value;
                            break;
                        case "date":
                            this.raids[i].date = value;
                            break;
                        case "start":
                            this.raids[i].day = value;
                            break;
                        case "end":
                            this.raids[i].day = value;
                            break;
                        case "invite":
                            this.raids[i].day = value;
                            break;
                        default:
                            msg.reply(`'${option}' is not a property which can be updated!`);
                            return;
                    }
                    this.updatePrintedRaid(this.raids[i]);
                    msg.reply(`Raid ${raids[i].name} on ${raids[i].date} is updated!`);
                    return;
                }
            }
            msg.reply("Error while trying to update raid! Maybe the raid does not esist?");
        } catch(error) {
            console.log(`register: ${error}`);
            msg.reply("something bad happened :(");
        }        
    }

    updatePrintedRaid(raidInstance) {
        try {
            const channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);

            if(raidInstance.messageID !== "") {
                var embed = new Discord.RichEmbed()
                        .addField(raidInstance.name, raidInstance.generateRaidOutput())
                        .setColor(raidInstance.embedColor)
                        .attachFile(raidInstance.img);
                channel.fetchMessage(raidInstance.messageID)
                    .then(message => message.edit({embed}))
                    .catch(error => console.log(`updatePrintedRaid/fetchMessage: ${error}`));
            }
            return false;
        } catch(error) {
            console.log(`updatePrintedRaid: ${error}`);
            return true;
        }
    }

    createPlayerFromDatabase(playerID, shortName) {
        return db.all(`SELECT * FROM characters WHERE userID = "${playerID}"`)
            .then(rows => {
                if (!rows) {
                    return null;
                } else {
                    const row = rows.filter(row => row.shortName === shortName);
                    if(row.length === 1) {
                        return new player(row[0].userID , row[0].name, row[0].riftClass, row[0].roles, row[0].shortName);
                    } else {
                        return null;
                    }
                }
            }).catch(error => {
                console.log(error);
            });
    }

    register(msg) {
        (async() => {
            try {
                const message = msg.content.split(" ");
                if(message.length != 3) {
                    msg.reply("Invalid number of Arguments! Please verify your input!");
                    return;
                }

                const newPlayer = await this.createPlayerFromDatabase(msg.author.id, message[2]);
                if(!newPlayer) {
                    msg.reply(`No characters created yet or no character of yours with short name ${message[2]} found!`);
                    return;
                }

                const raidID = parseInt(message[1]);

                const raid = this.raids
                    .filter(r => r.id === raidID)
                if(raid.length === 0) {
                    msg.reply("Couldn't find the raid you wanted to get registered to!");
                } else if(raid[0].registeredPlayer.find(p => p.id === newPlayer.id)) {
                    msg.reply("You are already registered for this raid!");
                } else if(raid[0].confirmedPlayer.find(p => p.id === newPlayer.id)) {
                    msg.reply("You are already confirmed for this raid!");
                } else {
                    db.get(`Select * FROM registered WHERE raidID = ${raid[0].id} AND userID = "${newPlayer.id}"`)
                        .then(row => {
                            if(!row) {
                                db.run("INSERT INTO registered (raidID, userID, shortName) VALUES (?, ?, ?)", [raid[0].id, newPlayer.id, newPlayer.shortName]);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            db.run("CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)").then(() => {
                                db.run("INSERT INTO registered (raidID, userID, shortName) VALUES (?, ?, ?)", [raid[0].id, newPlayer.id, newPlayer.shortName]);
                            });
                        });
                    raid[0].registeredPlayer.push(newPlayer);
                    this.updatePrintedRaid(raid[0]);
                    msg.reply(`You are now registered for raid "${raid[0].name}" at "${raid[0].day}"! Please be there in time!`);
                }
            } catch(error) {
                console.log(`register: ${error}`);
                msg.reply("something bad happened :(");
            }
        })();
    }

    deregister(msg) {
        try {
            const message = msg.content.split(" ");
            if(message.length != 3) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            const raidID = message[1];
            const playerID = msg.author.id;

            const raid = this.raids
                .filter(r => r.id === raidID)
            if(raid.length === 0) {
                msg.reply("Couldn't find the raid you wanted to get deregistered from!");
            } else if(raid[0].registeredPlayer.find(p => p.id === playerID)) {
                db.run(`DELETE FROM registered WHERE raidID = "${raid[0].id}" AND userID = "${playerID}"`);
                const index = raid[0].registeredPlayer.findIndex(p => p.id === playerID);
                raid[0].registeredPlayer.splice(index, 1);
                this.updatePrintedRaid(raid[0]);
                msg.reply(`You are now deregistered from raid "${raid[0].name}" on "${raid[0].day}"!`);
            } else {
                msg.reply("Couldn't deregister you from raid! Maybe the raid does not esist?");
            }
        } catch(error) {
            console.log(`deregister: ${error}`);
            msg.reply("something bad happened :(");
        }
    }

    clearChannel() {
        try {
            const channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            channel.fetchMessages()
                .then(messages => {
                    messages.deleteAll();
                });
        } catch(error) {
            console.log(`clearChannel: ${error}`);
        }
    }

    printRaids() {
        try {
            const channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            this.clearChannel();

            (async () => {
                for(var i = 0; i < this.raids.length; i++) {
                    var pos = i;
                    var embed = new Discord.RichEmbed()
                        .addField(this.raids[pos].name, this.raids[pos].generateRaidOutput())
                        .setColor(this.raids[pos].embedColor)
                        .attachFile(this.raids[pos].img);
                    await channel.send({embed})
                        .then(message => {
                            this.raids[pos].messageID = message.id;
                        })
                        .catch(error => console.log(`printRaids/sending message: ${error}`));
                }
            })();
        } catch(error) {
            console.log(`printRaids: ${error}`);
        }
    }

    newCharacter(msg) {
        const message = msg.content.split(" ");
        if(message.length != 5) {
            msg.reply("Invalid number of Arguments! Please verify your input!");
            return;
        }

        try {
            db.get(`SELECT * FROM characters WHERE name = "${message[1]}"`).then(row => {
                if (!row) {
                    db.run("INSERT INTO characters (name, userID, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?)", [message[1], msg.author.id, message [2], message[3], message[4]])
                        .then(() => msg.reply("Character created"));
                } else {
                    db.run(`UPDATE characters SET riftClass = "${message[2]}", roles = "${message[3]}", shortName = "${message[4]}" WHERE name = "${message[1]}"`)
                        .then(() => msg.reply("Character updated"));
                }
            }).catch(error => {
                console.log(`newCharacter/ get player from db: ${error}`);
                db.run("CREATE TABLE IF NOT EXISTS characters (name TEXT, userID TEXT, riftClass TEXT, roles TEXT, shortName TEXT)").then(() => {
                    db.run("INSERT INTO characters (name, userID, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?)", [message[1], msg.author.id, message [2], message[3], message[4]])
                        .then(() => msg.reply("Character created"));
                });
            });
        } catch(error) {
            console.log(`newCharacter: ${error}`);
            msg.reply("Unable to handle database");
            return;
        }
    }

    databaseConfirm(raidID, player) {
        this.databaseDeregister(raidID, player);
        db.run("INSERT INTO confirmed (raidID, userID, shortName) VALUES (?, ?, ?)", [raidID, player.id, player.shortName])
            .catch(error => {
                console.log(`databaseConfirm: ${error}`);
                db.run("CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)")
                    .then(() => {
                        db.run("INSERT INTO confirmed (raidID, userID, shortName) VALUES (?, ?, ?)", [raidID, player.id, player.shortName]);
                    });
            });
    }

    databaseDeregister(raidID, player) {
        db.run(`DELETE FROM registered WHERE raidID = ${raidID} AND userID = "${player.id}"`)
            .catch(error => {
                console.log(`databaseDeregister: ${error}`);
                db.run("CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)");
            });
    }

    confirmRegisteredEventMemberForEvent(msg) {
        try {
            const message = msg.content.split(" ");
            if(message.length < 3) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            const raidID = parseInt(message[1]);
            const raid = this.raids.find(r => r.id === raidID);
            let playerNumbersToConfirm = message;
            playerNumbersToConfirm.splice(0, 2);
            let numberOfSuccessfulConfirmations = 0;

            if(!raid) {
                msg.reply("Couldn't find raid! Please check your input!");
            } else {
                playerNumbersToConfirm.forEach(number => {
                    const index = parseInt(number) - 1;
                    if(index < raid.registeredPlayer.length) {
                        const player = raid.registeredPlayer[index];
                        raid.registeredPlayer.splice(index, 1);
                        raid.confirmedPlayer.push(player);
                        numberOfSuccessfulConfirmations++;
                        this.databaseConfirm(raidID, player);
                    }
                });
                this.updatePrintedRaid(raid);
                msg.reply(`Confirmed ${numberOfSuccessfulConfirmations} player(s) for raid '${raid.name}' with ID '${raid.id}'`);
            }
        } catch(error) {
            console.log(`confirm: ${error}`);
        }
    }

    help(isOffi) {
        var string = "usage:\n\n"
        string = `${string}help - show this message${
                N}${
                N}1. Create your Character: (You have to do this once for every raiding charakter.)${
                N}   create <name@shard> <class> <roles> <shortName>${
                N}   e.g.: 'create Paxie@Brutwacht Kleriker Tank,DD,Heal,Support Pax'${
                N}${
                N}2. Register your character for incoming raid:${
                N}   register <raidID> <shortName>${
                N}   e.g. 'register 1001 Pax'${
                N}${
                N}3. Deregister your character for incoming raid:${
                N}   deregister${
                N}   e.g. 'deregister 1003'`;

        if (isOffi) {
            string = `${string}${
                    N}${
                    N}Admin Settings:${
                    N}${
                    N}Create a new raid instance:${
                    N}addRaid <irotp / td> <day> <date>${
                    N}e.g. 'addRaid td Wednesday 01.01.1970'${
                    N}${
                    N}updates an existing raid instance: (one property per command)${
                    N}updateRaid <raidID> <day / date / start / end / invite> <data>${
                    N}e.g. 'updateRaid 1000 start 18:00'${
                    N}${
                    N}deletes a raid instance:${
                    N}deleteRaid <raidID>${
                    N}e.g. 'deleteRaid 1000'${
                    N}${
                    N}confirm players for raid:${
                    N}confirm <raidID> <number of player in registered list> <2nd player> <3rd player> ...${
                    N}e.g. 'confirm 1000 8 4 12'${
                    N}${
                    N}Delete all messages in raid planner channel and print all active raids again:${
                    N}printRaids${
                    N}${
                    N}Deletes all messages in raid planner channel${
                    N}clearRaidChannel`;
        }
        return string;
    }

    memberCommand(msg) {
         var command = msg.content.split(" ")[0];
        switch(command) {
            case "register":
                this.register(msg);
                break;
            case "deregister":
                this.deregister(msg);
                break;
            case "help":
                msg.reply(this.help(true))
                    .catch(error => console.log(`help: ${error}`));
                break;
            case "create":
                this.newCharacter(msg);
                break;
            default:
                msg.reply(`unknown command!Use 'help' for info!`)
                    .catch(error => console.log(`help: ${error}`));
                break;
        }
    }

    offiCommand(msg) {
        var command = msg.content.split(" ")[0];
        switch(command) {
            case "addRaid":
                this.addRaid(msg);
                break;
            case "clearRaidChannel":
                this.clearChannel();
                break;
            case "printRaids":
                this.printRaids(msg);
                break;
            case "register":
                this.register(msg);
				break;
			case "deregister":
                this.deregister(msg);
                break;
            case "help":
                msg.reply(this.help(true))
                    .catch(error => console.log(`help: ${error}`));
                break;
            case "deleteRaid":
                this.deleteRaid(msg);
                break;
            case "updateRaid":
                this.updateRaid(msg);
                break;
            case "create":
                this.newCharacter(msg);
                break;
            case "confirm":
                this.confirmRegisteredEventMemberForEvent(msg);
                break;
            default:
                msg.reply(`unknown command!Use 'help' for info!`)
                    .catch(error => console.log(`help: ${error}`));
                break;
        }
    }
}

module.exports = messageHandler;