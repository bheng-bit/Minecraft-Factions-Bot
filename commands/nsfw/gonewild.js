const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "gonewild",
	description: "Displays random gonewild image.",
	category: "nsfw",
    aliases: ["tits"],
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        
        const { body } = await superagent.get("https://nekobot.xyz/api/image?type=gonewild");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":lion_face: Gonewild")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}