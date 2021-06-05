const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "boobs",
	description: "Displays random boobs image.",
	category: "nsfw",
    aliases: ["tits"],
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        
        const { body } = await superagent.get("https://nekobot.xyz/api/image?type=boobs");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":cherries: Boobs")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}