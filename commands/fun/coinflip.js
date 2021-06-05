const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "coinflip",
	description: "Flips a coin.",
  aliases: ["cf", "flip", "coin"],
	category: "fun",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
		const n = Math.floor(Math.random() * 2);
        let result;
        if (n === 1) result = "Heads";
        else result = "Tails";
        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setAuthor(`${client.user.username} Coinflip`, client.user.displayAvatarURL({ dynamic: true}))
          .setDescription(`:coin: **${message.member.displayName} Flipped** \`${result}\``);
        return message.channel.send(embed);
	}
}