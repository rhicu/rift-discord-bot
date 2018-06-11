# RiftDiscordBot

To run, you need to install node v 8.xx or higher and MongoDB.
After it open a terminal, navigate to the bot folder and use the command "npm init -y" to initialize node there with default setup.
Now you have to install the following packages:

* discord.js - "npm install --save discord.js"
* sequalize - "npm install --save sequalize"
* mysql2 - "npm install --save mysql2"

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
    "mysql": {
        "name": "",
        "username": "",
        "password": ""
    }
}

```

Edit this config with your ID's and data, save, exit and you are done.

Now you can start the bot by typing "node ./src/index.js" in your terminal.
