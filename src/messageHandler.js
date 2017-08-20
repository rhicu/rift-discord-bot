const Discord = require("discord.js");
const config = require("./config.json");
const raid = require("./raid");
const player = require("./player");
const util = require("./util");
const N = "\n";

const debug = true;
const communicationPrefix = config.communicationPrefix;

class messageHandler {
    constructor(bot) {
        this.raids = [];
        this.bot = bot;
    }

    addRaid(msg) {
        try {
            var message = msg.content.split(" ");
            var configPath;
            var type;
            switch(message[1]) {
                case "irotp":
                    configPath = config.raids.irotp;
                    type = "irotp";
                    break;
                case "td":
                    configPath = config.raids.td;
                    type = "td";
                    break;
                default:
                    msg.reply("unknown raid, use 'irotp' or 'td'");
                    return;
            }
            var newRaid = new raid(configPath, type);
            newRaid.day = util.getDay(message[2]);
            newRaid.date = util.getDate(message[3]);

            if(newRaid.isValid()) {
                this.raids.push(newRaid);
                msg.reply(`raid "${newRaid.name}" added`);
                this.printRaids(msg);
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
            var message = msg.content.split(" ");
            if(message.length != 3) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            var channel;
            if(debug) {
                channel = msg.channel;
            } else {
                channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            }

            var raidInstance = message[1];
            var day = message[2];
            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    if(this.raids[i].messageID === "") {
                        this.raids.splice(i, 1);
                    } else {
                        channel.fetchMessage(this.raids[i].messageID)
                            .then(message => message.delete())
                            .catch(error => console.log(`deleteRaid: ${error}`));
                        this.raids.splice(i, 1);
                    }
                    msg.reply(`You successfully deleted raid ${raidInstance} on ${day}!`);
                    return;
                }
            }
            msg.reply("Error while trying to delete raid! Maybe the raid does not esist?");
        } catch(error) {
            console.log(`deleteRaid: ${error}`);
            msg.reply(`something bad happened :(`);
        }
    }

    updateRaid(msg) {
        try {
            if(msg.content.split(" ").length !== 5) {
                msg.reply("Invalid number of arguments!");
                return;
            }
            var raidInstance = msg.conent.split(" ")[1];
            var day = msg.content.split(" ")[2];
            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    var option = msg.content.split(" ")[3];
                    var value = msg.content.split(" ")[4];
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
                    this.updatePrintedRaid(this.raids[i], msg.channel);
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

    updatePrintedRaid(raidInstance, msgChannel) {
        try {
            var channel;
            if(debug) {
                channel = msgChannel;
            } else {
                channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            }
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

    register(msg) {
        try {
            var message = msg.content.split(" ");
            if(message.length != 6) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            var raidInstance = message[1];
            var day = message[2];
            var ingameName = message[3];
            var riftClass = message[4];
            var roles = message[5];
            var id = msg.author.id;
            var newPlayer = new player(id , ingameName, riftClass, roles);
            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    this.raids[i].registeredPlayer.push(newPlayer);
                    this.updatePrintedRaid(this.raids[i], msg.channel);
                    msg.reply(`You are now registered for raid ${this.raids[i].name} on ${this.raids[i].day}! Please be there in time!`);
                    return;
                }
            }
            msg.reply("Error while trying to register you to raid! Maybe the raid does not esist?");
        } catch(error) {
            console.log(`register: ${error}`);
            msg.reply("something bad happened :(");
        }
    }

    deregister(msg) {
        try {
            var message = msg.content.split(" ");
            if(message.length != 3) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            var raidInstance = message[1];
            var day = message[2];
            var id = msg.author.id;
            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    for(var j = 0; j < this.raids[i].registeredPlayer.length; j++) {
                        if(this.raids[i].registeredPlayer[j].id === id) {
                            this.raids[i].registeredPlayer.splice(j, 1);
                            this.updatePrintedRaid(this.raids[i], msg.channel);
                            msg.reply(`You are now deregistered from raid ${this.raids[i].name} on ${this.raids[i].day}!`);
                            return;
                        }
                    }
                }
            }
            msg.reply("Error while trying to register you to raid! Maybe the raid does not esist?");
        } catch(error) {
            console.log(`register: ${error}`);
            msg.reply("something bad happened :(");
        }
    }

    clearChannel(msg) {
        try {
            var channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            channel.fetchMessages()
                .then(messages => {
                    messages.deleteAll();
                });
        } catch(error) {
            console.log(`clearChannel: ${error}`);
            msg.reply("Couldn't find channel to delete messages!");
        }
    }

    printRaids(msg) {
        try {
            var channel;
            if(debug) {
                channel = msg.channel;
            } else {
                channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
                this.clearChannel(msg);
            }
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
            msg.reply(`something bad happened :(`);
        }
    }

    help(isOffi) {
        var string = "usage:\n\n"
        string = `${string}register <raid> <day> <ingameName> <class> <roles>, e.g. 'register irotp Mittwoch Blub@Typhiria Krieger DD,Tank,Heal'${
                N}deregister <raid> <day>, e.g. 'deregister irotp Mittwoch'${
                N}help`;
        if (isOffi) {
            string = `${string}${N}${
                    N}addRaid <irotp / td> <day> <date>${
                    N}printRaids${
                    N}deleteRaid <irotp / td> <day>${
                    N}updateRaid <irotp / td> <day> <day / date / start / end / invite> <data>${
                    N}clearRaidChannel\n`
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
            default:
                msg.reply(`unknown command!\n\n${this.help(true)}`)
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
                this.clearChannel(msg);
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
            default:
                msg.reply(`unknown command!\n\n${this.help(true)}`)
                    .catch(error => console.log(`help: ${error}`));
                break;
        }
    }
}

module.exports = messageHandler;