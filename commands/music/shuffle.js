const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
	name: "shuffle",
	description: "Shuffle the current queue.",
	category: "music",
	usage: "",
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
        client.distube.shuffle(message)
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Queue has been shuffled. Do** \`${config.discord.prefix}queue\` **to see the new queue.**`)
        return message.channel.send(embed)
	}
}