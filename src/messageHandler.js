const Discord = require("discord.js");
const config = require("./config.json");
const irotp = require("./raids/irotp");
const td = require("./raids/td");
const player = require("./player");

var debug = true;

class messageHandler {
    constructor(bot) {
        this.raids = [];
        this.bot = bot;
    }

    addRaid(msg) {
        try {
            var raid = msg.content.split(" ");
            switch(raid[1]) {
                case "irotp":
                    var newRaid = new irotp();
                    this.raids.push(newRaid);
                    msg.reply(`raid "${config.raids.irotp.name}" added`);
                    this.printRaids(msg);
                    break;
                case "td":
                    var newRaid = new td();
                    this.raids.push(newRaid);
                    msg.reply(`raid "${config.raids.td.name}" added`);
                    this.printRaids(msg);
                    break;
                default:
                    msg.reply("unknown raid, use 'irotp' or 'td'");
                    break;
            }
        } catch(error) {
            console.log(`addRaid: ${error}`);
            msg.reply("Couldn't create raid");
        }
    }

    updateRegisteredPlayers(raid, msgChannel) {
        try {
            var channel;
            if(debug) {
                channel = msgChannel;
            } else {
                channel = this.bot.guilds.find("id", config.serverID).channels.find("id", config.raidPlannerChannelID);
            }
            if(raid.messageID !== "") {
                var embed = new Discord.RichEmbed()
                        .addField(raid.name, raid.generateRaidOutput())
                        .setColor(raid.embedColor)
                        .attachFile(raid.img);
                channel.fetchMessage(raid.messageID)
                    .then(message => message.edit({embed}))
                    .catch(error => console.log(`updateRegisteredPlayers/fetchMessage: ${error}`));
            }
            return false;
        } catch(error) {
            console.log(`updateRegisteredPlayers: ${error}`);
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

            var raid = message[0];
            var day = message[1];
            var ingameName = message[2];
            var riftClass = message[3];
            var roles = message[4];
            var id = msg.author.id;
            var newPlayer = new player(id , ingameName, riftClass, roles);
            var registerFailed = true;
            var i = 0;
            for(; i < this.raids.length; i++) {
                if(this.raids[i].shortName === raid && this.raids[i].day === day) {
                    this.raids[i].registeredPlayer.push(newPlayer);
                    this.updateRegisteredPlayers(this.raids[i], msg.channel);
                    registerFailed = false;
                    msg.reply(`You are now registered for raid ${raid} on ${day}! Please be there in time!`);
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
                if(this.raids[i].messageID !== "") {
                    continue;
                } else {
                    var embed = new Discord.RichEmbed()
                        .addField(this.raids[i].name, this.raids[i].generateRaidOutput())
                        .setColor(this.raids[i].embedColor)
                        .attachFile(this.raids[i].img);
                    var pos = i;
                    channel.send({embed})
                        .then(message => this.raids[pos].messageID = message.id)
                        .catch(error => console.log(`printRaids/sending message: ${error}`));
                }
            }
        } catch(error) {
            console.log(`printRaids: ${error}`);
            msg.reply(`something bad happened :(`);
        }
    }

    help(msg, isOffi) {
        var string = "usage:\n\n"
        string = `${string}'register <raid>;<day>;<ingameName>;<class>;<roles>', e.g. 'register irotp;Mittwoch;Blub@Typhiria;Krieger;DD,Tank,Heal'`;
        if (isOffi) {
            string = `${string}\n\n`
            string = `${string}addRaid <irotp / td>\n`
            string = `${string}printRaids\n`
            string = `${string}clearRaidChannel\n`
        }
        msg.reply(string)
            .catch(console.error);
    }

    memberCommand(msg) {
         var command = msg.content.split(" ")[0];
        switch(command) {
            case "register":
                this.register(msg);
                break;
            default:
                this.help(msg, false);
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
            default:
                this.help(msg, true);
                break;
        }
    }
}

module.exports = messageHandler;