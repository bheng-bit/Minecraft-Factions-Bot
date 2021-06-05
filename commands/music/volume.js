const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
	name: "volume",
	description: "Change the volume of the music.",
	category: "music",
	usage: "<volume>",
    args: true,
	async run(client, message, args, bot, chatData, saving, database) {

        const volume = parseInt(args[0])

        if (isNaN(volume)){
            const misargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("Incorrect Usage")
                .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Category:** \`${this.category}\`\n**Aliases:** \`${this.aliases || "None"}\`\n**Ussage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n`)
                .setFooter("<> = required and [] = optional")
            return message.channel.send(misargs);
        }

        client.distube.setVolume(message, volume)
        
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Volume set to** \`${volume}\``)
        return message.channel.send(embed)
	}
}