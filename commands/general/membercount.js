const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "membercount",
	description: "Displays guilds membercount.",
    category: "general",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        const memberCount = message.guild.memberCount;
		const bots = message.guild.members.cache.filter((mem) => mem.user.bot).size;
        const humans = message.guild.members.cache.filter((mem) => !mem.user.bot).size;

        const embed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s Members`)
            .setColor("BLUE")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTimestamp()
            .addField("**Total:**", "```" + memberCount + "```", true)
            .addField("**Humans:**", "```" + humans + "```", true)
            .addField("**Bots:**", "```" + bots + "```", true);

        return message.channel.send(embed);
	}
}