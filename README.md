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
    "prefix": ">",
    "communicationPrefix": "#",
    "serverID": "325779168405094410",
    "roles": {
        "offi": "335116773181489152",
        "member": "335123824859152385"
    },
    "raidPlannerChannelID": "336073501540876288",
    "raids": {
        "irotp": {
            "name": "Aufstieg des Phönix",
            "shortName": "irotp",
            "imgPath": "D:\\Git\\RiftDiscordBot\\img\\rotp.jpg",
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
            "shortName": "td",
            "imgPath": "D:\\Git\\RiftDiscordBot\\img\\td.jpg",
            "requirements": ["500k dps an der Puppe", "2,2k Hit"],
            "numberPlayer": 10,
            "numberTank": 2,
            "numberHeal": 2,
            "numberSupport": 1,
            "numberDD": 5,
            "embedColor": "0xFF0000"
        }
    }
}
```

Now you can start the bot by typing "node ./src/index.js" in your terminal.
