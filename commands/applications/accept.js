const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "accept",
	description: "Accept an users appliction.",
	usage: '<@user/ID>',
    category: "applications",
	permissions: ["MANAGE_ROLES"],
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (!member) {
			const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
		}
		if (database.findApplicant(member.id) == undefined) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(`:x: ${member} **has no current application!**`)
			return message.channel.send(embed);
		} else {
			database.removeApplicant(member.id)
			const succes = new MessageEmbed()
				.setColor("GREEN")
				.setDescription(`:white_check_mark: ${member}**'s application has been accepted!**`)
			message.channel.send(succes);

			const embed = new MessageEmbed()
				.setColor("BLUE")
				.setTitle(":tada: You Have Been Accepted!")
				.setDescription("**Make sure to contact a recruiter for your roles/interview!**")
			member.send(embed).catch((err) => {})
			return;
		}
	}
}