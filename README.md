# RiftDiscordBot

To run, you need to install node v 8.xx or higher.
After it open a terminal, navigate to the bot folder and use the command "npm init -y" to initialize node there with default setup.
Now you have to install the following packages:

* discord.js - "npm install --save discord.js"
* PersistentCollections - "npm install --save djs-collection-persistent"

Finally you have to create a new file in the "src"-folder named "privateConfig.json".
Open the file and write:

```json
{
    "token": "<ur generated bot token>"
}
```

save, exit and you are done.

Now you can start the bot by typing "node ./src/index.js" in your terminal.
