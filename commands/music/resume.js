const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "resume",
	description: "Pause the current song in queue.",
	category: "music",
    aliases: ["unpause"],
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
        client.distube.resume(message)
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Resumed the last song that was playing!**`)
        return message.channel.send(embed)
	}
}