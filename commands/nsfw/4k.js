const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "4k",
	description: "Displays random 4k nsfw image.",
	category: "nsfw",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        
        const { body } = await superagent.get("https://nekobot.xyz/api/image?type=4k");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":video_camera: 4k nsfw")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}