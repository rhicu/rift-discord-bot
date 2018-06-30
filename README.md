# RiftDiscordBot

To run, first of all you need to install node v 8.xx or higher and a database which is supported by sequelize like MySQL.
After it, open a terminal, navigate to the bot folder and use the command "npm install" to install all required dependencies (discordjs, sequalize, mysql2).
You can use one of the other databases sequelize is supporting (http://docs.sequelizejs.com/).
If you want to use another database, you have to exchange "mysql2" in "package.json" with your desired database package before using "npm install".

Finally you have to create a new file in the "src"-folder named "config.json".
Open the file and insert:

```json
{
    "token": "",
    "prefix": "",
    "communicationPrefix": "",
    "serverID": "",
    "raidPlannerChannelID": "",
    "roles": {
        "friend": "",
        "member": "",
        "lead": "",
        "admin": ""
    },
    "database": {
        "name": "",
        "username": "",
        "password": "",
        "host": "",
        "dialect": "mysql"
    }
}
```

token                   - login token you can get by creating a new app here
                          https://discordapp.com/developers/applications/me and generating a token for it
serverID                - ID of your discord server
                          (https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
raidPlannerChannelID    - ID of the text channel, the bot should print raids
                          (All messages will be deleted there, so it should be a new / empty / not used text channel)
roles                   - ID's of your server roles with 4 different permission levels 
                          (friend can just register or unregister to raid, ..., lead can also create and delete raids,
                          admin can also clear different channels)
database                - set your database credentials

Edit this config with your ID's and data, save, exit and you are done.
If you use another database than MySQL exchange "mysql" with your used database on "dialect" property.

At last add your app / the bot to your server with all required permissions (https://discordapi.com/permissions.html)
The bot needs all text permissions and you have to be admin or at least have all text permissions yourself to set them.

Now you can start the bot by typing "npm start" in your terminal.

To make sure the bot is restarting automatically use something like https://www.npmjs.com/package/forever.
 