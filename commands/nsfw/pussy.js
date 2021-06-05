const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "pussy",
	description: "Displays random pussy image.",
	category: "nsfw",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        
        const { body } = await superagent.get("https://nekobot.xyz/api/image?type=pussy");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":cat: Pussy")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}