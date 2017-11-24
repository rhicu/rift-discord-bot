# RiftDiscordBot

To run, you need to install node v 8.xx or higher.
After it open a terminal, navigate to the bot folder and use the command "npm init -y" to initialize node there with default setup.
Now you have to install the following packages:

* discord.js - "npm install --save discord.js"
* sqlite - "npm install --save sqlite"

Finally you have to create a new file in the "src"-folder named "privateConfig.json".
Open the file and write:

```json
{
    "token": "<ur generated bot token>"
}
```

save, exit and you are done.

Repeat for a file named "config.json":
```json
{
    "prefix": "",
    "communicationPrefix": "",
    "serverID": "",
    "roles": {
        "offi": "",
        "member": ""
    },
    "raidPlannerChannelID": "",
    "raids": {
        "bos": {
            "name": "Stahlbastion",
            "alias": ["bastion of steel", "stahlbastion"],
            "shortName": "bos",
            "imgPath": "/home/usr/git/RiftDiscordBot/img/bos.jpg",
            "requirements": ["800k dps an der Puppe", "2,4k Hit"],
            "numberPlayer": 10,
            "numberTank": 2,
            "numberHeal": 2,
            "numberSupport": 1,
            "numberDD": 5,
            "embedColor": "0x0000FF"
        },
        "irotp": {
            "name": "Aufstieg des Phönix",
            "alias": ["phönix", "aufstieg des phönix", "adp"],
            "shortName": "irotp",
            "imgPath": "/home/usr/git/RiftDiscordBot/img/rotp.jpg",
            "requirements": ["500k dps an der Puppe", "2,2k Hit"],
            "numberPlayer": 10,
            "numberTank": 2,
            "numberHeal": 2,
            "numberSupport": 1,
            "numberDD": 5,
            "embedColor": "0x00FF00"
        },
        "td": {
            "name": "Tartarische Tiefen",
            "alias": ["tartarische tiefen"],
            "shortName": "td",
            "imgPath": "/home/usr/git/RiftDiscordBot/img/td.jpg",
            "requirements": ["500k dps an der Puppe", "2,2k Hit"],
            "numberPlayer": 10,
            "numberTank": 2,
            "numberHeal": 2,
            "numberSupport": 1,
            "numberDD": 5,
            "embedColor": "0xFF0000"
        }
    },
    "dbPath": "/home/usr/git/RiftDiscordBot/database"
}
```

Now you can start the bot by typing "node ./src/index.js" in your terminal.
