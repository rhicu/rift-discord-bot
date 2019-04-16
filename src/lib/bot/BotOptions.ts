import { ClientOptions } from "discord.js";

export interface BotOptions extends ClientOptions{
    prefix: String,
    responseTime: Number
}