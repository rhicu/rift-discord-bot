# RiftDiscordBot

To run, you need to install node v 8.xx or higher and MongoDB.
After it open a terminal, navigate to the bot folder and use the command "npm init -y" to initialize node there with default setup.
Now you have to install the following packages:

* discord.js - "npm install --save discord.js"
* mongodb - "npm install --save mongodb"

Finally you have to create a new file in the "src"-folder named "config.json".
Open the file and write:

```json
{
    "token": "",
    "prefix": "",
    "communicationPrefix": "",
    "serverID": "",
    "raidPlannerChannelID": "",
    "roles": {
        "offi": "",
        "member": ""
    },
    "mongoPath": "mongodb://localhost:27017/db"
}

```

Edit this config with your ID's and data, save, exit and you are done.

Now you can start the bot by typing "node ./src/index.js" in your terminal.
