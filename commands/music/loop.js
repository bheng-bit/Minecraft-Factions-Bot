const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
	name: "loop",
	description: "Loops the current songs in queue.",
	category: "music",
    aliases: ["repeat"],
	usage: "<off/song/queue>",
    args: true,
	async run(client, message, args, bot, chatData, saving, database) {

        const queue = client.distube.getQueue(message)
        if (!queue){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**There is nothing in the queue right now!**`)
            return message.channel.send(embed)
        } 
        let mode = null
        switch (args[0]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
            default:
                const misargs = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Incorrect Usage")
                    .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Category:** \`${this.category}\`\n**Aliases:** \`${this.aliases || "None"}\`\n**Ussage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n`)
                    .setFooter("<> = required and [] = optional")
                return message.channel.send(misargs);
        }

        mode = client.distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Set repeat mode to** \`${mode}\``)
        return message.channel.send(embed);
	}
}