const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "skip",
	description: "Skip a music song in the voice channel.",
	category: "music",
    args: false,
	async run(client, message, args, bot, chatData, saving, database) {

        const queue = client.distube.getQueue(message)
        if (!queue){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**There is nothing in the queue right now!**`)
            return message.channel.send(embed)
        }
        try {
            client.distube.skip(message)
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`:white_check_mark: **Song Skipped!**`)
            return message.channel.send(embed)
        } catch (e) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`\`\`\`${e}\`\`\``)
            return message.channel.send(error)
        }
	}
}