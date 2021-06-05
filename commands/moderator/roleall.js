const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "roleall",
	description: "Adds the specified role to all the members in the guild.",
	usage: '<@role/ID>',
    category: "moderator",
	permissions: ["MANAGE_ROLES"],
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		
		const role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args[0]) || message.mentions.roles.first();

		if (!role) {
			const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
		} else {
            if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**I cannot give this role!**`)
                return message.channel.send(error);
            }
			try {
				await message.guild.members.cache.filter(m => !m.user.bot).forEach(member => {
                    setTimeout(() => {
                        member.roles.add(role)
                    }, 5000);
                });
                const added = new MessageEmbed()
						.setColor("GREEN")
						.setDescription(`**:white_check_mark: Succesfully added ${role} role for \`${message.guild.members.cache.filter(m => !m.user.bot).size} Members\`**`)
				return message.channel.send(added);
                
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