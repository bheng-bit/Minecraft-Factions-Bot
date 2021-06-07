const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "ban",
	description: "Ban a user from the discord.",
	usage: '<@user/ID> [reason]',
    category: "moderator",
	permissions: ["BAN_MEMBERS"],
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		const banmember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(" ");
		if (!reason) reason = "No Reason Given";

		if (!banmember) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**I can't ban this user!**`)
			return message.channel.send(error);
		}
		if (!banmember.bannable) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**You can't ban this user!**`)
			return message.channel.send(error);
		} else {
			if (banmember.id === message.author.id) {
				message.delete();
				const error = new MessageEmbed()
					.setColor("RED")
					.setTitle(":warning: Error")
					.setDescription(`**You can't ban yourself!**`)
				return message.channel.send(error);
			} else {
				message.delete();
				try {
					const ban = new MessageEmbed()
						.setColor("BLUE")
						.setDescription(`**You have been __banned__ from \`${message.guild.name}\` for \`${reason}\`!**`)
					await banmember.send(ban).catch(err => {});
					let embed = new MessageEmbed()
						.setTitle("Member Banned")
						.setColor("BLUE")
						.addField("Banned:", banmember, true)
						.addField("Reason:", `\`${reason}\``, true)
						.addField("Moderator:", message.author, true)
						.setThumbnail(banmember.user.displayAvatarURL({ dynamic: true }))
						.setTimestamp()
					message.channel.send(embed);
					banmember.ban({
						reason: reason
					});
				} catch (error) {
					
					const err = new MessageEmbed()
						.setColor("RED")
						.setTitle(":warning: Error")
						.setDescription(`**Something went wrong check my perms and try again!**`)
					return message.channel.send(err);
				}
			}
		}
	}
}