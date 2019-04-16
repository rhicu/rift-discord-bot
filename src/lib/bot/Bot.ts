import { Client } from "discord.js";
import { BotOptions } from "./BotOptions";

export default class Bot extends Client {

    options: BotOptions

    constructor(options: BotOptions) {
        super(options)
        // this.client = new Client(options)
    }
}