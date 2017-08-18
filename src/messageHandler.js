const Discord = require("discord.js");
const config = require("./config.json");
const raid = require("./raid");
const player = require("./player");
const N = "\n";

var debug = true;

class messageHandler {
    constructor(bot) {
        this.raids = [];
        this.bot = bot;
    }

    addRaid(msg) {
        try {
            var raidInstance = msg.content.split(" ");
            var configPath;
            var type;
            switch(raidInstance[1]) {
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

            /*
            * Asking user for day and date
            */
            msg.reply(`You are about to crate a new raid instance of '${configPath.name}'.${
                    N}Please define a day and date with the pattern '<day>;<dd.mm.yyyy>'`);
            // Await not empty messages
            const filter = m => m.content !== "";
            // Errors: ['time'] treats ending because of the time limit as an error
            msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    newRaid.day = utils.getDay(collected.first.content.split(";")[0]);
                    newRaid.date = utils.getDate(collected.first.content.split(";")[1]);
                })
                .catch(error => console.log(`addRaid/getDate ${error}`));

            /*
            * Asking user for time data
            */
            msg.reply(`Just need some additional infos for your new raid instance of '${configPath.name}'.${
                    N}Please define a starting, ending and inviting time with the pattern '<hh:mm>;<hh:mm>;<hh:mm>'`);
            // Errors: ['time'] treats ending because of the time limit as an error
            msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    newRaid.start = utils.getDay(collected.first.content.split(";")[0]);
                    newRaid.end = utils.getDate(collected.first.content.split(";")[1]);
                    newRaid.invite = utils.getDate(collected.first.content.split(";")[2]);
                })
                .catch(error => console.log(`addRaid/getDate ${error}`));
            if(newRaid.isValid()) {
                msg.reply(`Please verify: <yes / no>\n\n${newRaid.generateRaidOutput()}`);
                msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        if (collected.first.content === "yes") {
                            this.raids.push(newRaid);
                            msg.reply(`raid "${newRaid.name}" added`);
                            this.printRaids(msg);
                        } else {
                            msg.reply("Abort by user!");
                        }
                    })
                    .catch(error => console.log(`addRaid/verifySetup ${error}`));
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
            var message = msg.content.split(" ")[1];
            message = message.split(";");
            if(message.length != 2) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            var channel;
            if(debug) {
                channel = msg.channel;
            } else {
                channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            }

            var raidInstance = message[0];
            var day = message[1];
            var deletionFailed = true;
            var i = 0;
            for(; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    if(this.raids[i].messageID === "") {
                        this.raids.splice(i, 1);
                    } else {
                        channel.fetchMessage(this.raids[i].messageID)
                            .then(message => message.delete())
                            .catch(error => console.log(`deleteRaid: ${error}`));
                        this.raids.splice(i, 1);
                    }
                    deletionFailed = false;
                    msg.reply(`You successfully deleted raid ${raidInstance} on ${day}!`);
                    break;
                }
            }
            if(i == this.raids.length) {
                msg.reply("Couldn't find the raid you wanted to delete!");
            } else if(deletionFailed) {
                msg.reply("Error while trying to delete raid!");
            }
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
            var updateFailed = true;
            var i = 0;
            for(; i < this.raids.length; i++) {
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
                    updateFailed = false;
                    msg.reply(`Raid ${raids[i].name} on ${raids[i].date} is updated!`);
                    break;
                }
            }
            if(i == this.raids.length) {
                msg.reply("Couldn't find the raid you wanted to update!");
            } else if(updateFailed) {
                msg.reply("Error while trying to update raid!");
            }
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
            var message = msg.content.split(" ")[1];
            message = message.split(";");
            if(message.length != 5) {
                msg.reply("Invalid number of Arguments! Please verify your input!");
                return;
            }

            var raidInstance = message[0];
            var day = message[1];
            var ingameName = message[2];
            var riftClass = message[3];
            var roles = message[4];
            var id = msg.author.id;
            var newPlayer = new player(id , ingameName, riftClass, roles);
            var registerFailed = true;
            var i = 0;
            for(; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raidInstance && this.raids[i].day === day) {
                    this.raids[i].registeredPlayer.push(newPlayer);
                    this.updatePrintedRaid(this.raids[i], msg.channel);
                    registerFailed = false;
                    msg.reply(`You are now registered for raid ${raidInstance} on ${day}! Please be there in time!`);
                    break;
                }
            }
            if(i == this.raids.length) {
                msg.reply("Couldn't find the raid you wanted to get registered to!");
            } else if(registerFailed) {
                msg.reply("Error while trying to register you to raid!");
            }
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
            }

            for(var i = 0; i < this.raids.length; i++) {
                if(this.raids.messageID !== "") {
                    channel.fetchMessage(this.raids.messageID)
                        .then(message => message.delete())
                        .catch(error => console.log(`printRaids/delete message: ${error}`));
                }
                var embed = new Discord.RichEmbed()
                    .addField(this.raids[i].name, this.raids[i].generateRaidOutput())
                    .setColor(this.raids[i].embedColor)
                    .attachFile(this.raids[i].img);
                var pos = i;
                channel.send({embed})
                    .then(message => this.raids[pos].messageID = message.id)
                    .catch(error => console.log(`printRaids/sending message: ${error}`));
            }
        } catch(error) {
            console.log(`printRaids: ${error}`);
            msg.reply(`something bad happened :(`);
        }
    }

    help(isOffi) {
        var string = "usage:\n\n"
        string = `${string}register <raid>;<day>;<ingameName>;<class>;<roles>, e.g. 'register irotp;Mittwoch;Blub@Typhiria;Krieger;DD,Tank,Heal'\n${
                N}help\n`;
        if (isOffi) {
            string = `${string}\n${
                    N}addRaid <irotp / td>\n${
                    N}printRaids\n${
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