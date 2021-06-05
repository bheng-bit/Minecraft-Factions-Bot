const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: "youngest",
	description: "Shows the youngest discord user in the guild.",
    category: "fun",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
		let mem = message.guild.members.cache
            .filter((m) => !m.user.bot)
            .sort((a, b) => b.user.createdAt - a.user.createdAt)
            .first();
        const embed = new MessageEmbed()
            .setTitle(`The youngest member in ${message.guild.name}!`)
            .setThumbnail(mem.user.displayAvatarURL({dynamic: true}))
            .setColor("BLUE")
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(
            `**${mem.user.tag}** is the youngest user! 
            **Account creation date:** ${moment(mem.user.createdAt).format("D/MM/YY")}`
        );
      return message.channel.send(embed);
	}
}