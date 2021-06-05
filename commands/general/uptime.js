const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "uptime",
    description: "Displays the discord bot uptime.",
    category: "general",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Bot Uptime")
            .setDescription(`**Uptime:** \`${prettyMilliseconds(client.uptime, {verbose: true})}\``)
        return message.channel.send(embed);
    }
}
