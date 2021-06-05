const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "pgif",
	description: "Displays random porn gif.",
	category: "nsfw",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        
        const { body } = await superagent.get("https://nekobot.xyz/api/image?type=pgif");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":camera_with_flash: Nsfw gif")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}