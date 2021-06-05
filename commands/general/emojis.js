const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "emojis",
	description: "Displays all the guild emojis.",
	category: "general",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
		const nonAnimated = [];
    const animated = [];

    message.guild.emojis.cache.forEach(e => {
      if (e.animated) animated.push(e.toString());
      else nonAnimated.push(e.toString());
    });

    const embed = new MessageEmbed()
        .setTitle(`${message.guild.name}'s Emotes`)
        .addField("Animated:", animated.length === 0 ? "None" : animated.join(" "))
        .addField("Non Animated:", nonAnimated.length === 0 ? "None" : nonAnimated.join(" "))
        .setColor("BLUE")
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));
    return message.channel.send(embed);
	}
}