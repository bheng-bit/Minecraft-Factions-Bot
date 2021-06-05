const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "stop",
	description: "Stop playing music in a voice channel.",
	category: "music",
    aliases: ["disconnect", "leave"],
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
        client.distube.stop(message)

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Stopped playing music!**`)
        return message.channel.send(embed)
	}
}