const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "avatar",
	description: "Displays avatar of specified user.",
	usage: "[@user/ID]",
	aliases: ["av"],
	category: "general",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		const embed = new MessageEmbed()
			.setColor("BLUE")
			.setTitle(` ${member.user.username}'s Avatar`)
			.setImage(member.user.displayAvatarURL({
				format: 'png',
				dynamic: true,
				size: 512
			}))
			.setFooter(`Requested by ${message.author.tag}`)
		return message.channel.send(embed);

	}
}