const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
	name: "pat",
	description: "Pat a person.",
	usage: '<@user/ID>',
  	category: "fun",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;

        const { body } = await superagent
        .get("https://nekos.life/api/v2/img/pat");
            const embed = new MessageEmbed()
              .setColor("BLUE")
              .setTitle("Here's your Pat, 👀")
              .setDescription(`${message.author} pats ${victim}`)
              .setImage(body.url)
              .setTimestamp()
              .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);
	}
}