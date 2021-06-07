const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "addrole",
	description: "Adds the specified role to the provided user.",
	usage: '<@user/ID> <@role/ID>',
    category: "moderator",
	permissions: ["MANAGE_ROLES"],
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		const role = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name === args[1]) || message.mentions.roles.first();

		if (!member || !role) {
			const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
		} else {
			try {
				if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
					const error = new MessageEmbed()
						.setColor("RED")
						.setTitle(":warning: Error")
						.setDescription(`**I cannot give this role!**`)
					return message.channel.send(error);
				} else {
					if (member.roles.cache.has(role.id)) {
						const hasrole = new MessageEmbed()
							.setColor("RED")
							.setTitle(":warning: Error")
							.setDescription(`${member} **already has ${role} role!**`)
						return message.channel.send(hasrole);
					} else {
						await member.roles.add(role)
						const added = new MessageEmbed()
							.setColor("GREEN")
							.setDescription(`**:white_check_mark: Succesfully added ${role} role for ${member}!**`)
						return message.channel.send(added);
					}
				}
			} catch (error) {
				const err = new MessageEmbed()
					.setColor("RED")
					.setTitle(":warning: Error")
					.setDescription(`**I cannon't give this role!**`)
				return message.channel.send(err);
			}
		}
	}
}