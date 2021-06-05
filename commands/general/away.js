const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "away",
	description: "Makes a fancy away message.",
	usage: '<date1> <date2> <reason>',
    category: "general",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		const date = args[0];
		const date1 = args[1];
		const reason = args.slice(2).join(" ");

		if (!date || !date1 || !reason) {
			const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
		} else {
			const awayChannel = client.channels.cache.get(database.getChannelID("c_away"));
			if (!awayChannel) {
				const error = new MessageEmbed()
					.setColor("RED")
					.setTitle(":warning: Error")
					.setDescription(`**Away channel has not been setup yet!**`)
				return message.channel.send(error)
			} else {
				message.delete()

				const away = new MessageEmbed()
					.setColor("BLUE")
					.setTitle(`Away ${message.author.tag}`)
					.setThumbnail(message.author.avatarURL({ dynamic: true }))
					.setDescription(`**From:** \`${date}\`\n**Untill:** \`${date1}\`\n**Reason:** \`${reason}\``)
				await awayChannel.send(away);
				const succes = new MessageEmbed()
					.setColor("GREEN")
					.setDescription(`✅** Succesfully posted your away message.**`)
				return message.channel.send(succes)
			}
		}
	}
}