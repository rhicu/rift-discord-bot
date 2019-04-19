import { Client } from "discord.js";
import { BotOptions } from "./BotOptions";
import CommandHandler from "../command/CommandHandler";

export default class Bot extends Client {

    options: BotOptions
    commandHandler: CommandHandler

    constructor(options: BotOptions) {
        super(options)
        // this.client = new Client(options)
    }
}