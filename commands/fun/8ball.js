const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "8ball",
	description: "Get a answer for your questions.",
	usage: "<question>",
	category: "fun",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		const question = args.join(" ");
		const responses = [
			"It is certain",
			"It is decidedly so",
			"Without a doubt",
			"Yes – definitely",
			"You may rely on it",
			"As I see it",
			"yes",
			"Most Likely",
			"Outlook good",
			"Yes",
			"Signs point to yes"
		];
		if (!question) {
			const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
		} else {
			const randomIndex = Math.floor(Math.random() * responses.length);

			const embed = new MessageEmbed()
				.setColor("BLUE")
				.setTitle(":8ball: 8Ball")
				.setThumbnail("https://thumbs.gfycat.com/QuestionableMajesticBillygoat-small.gif")
				.setDescription(`**Question:** \`${question}\`\n**Answer:** \`${responses[randomIndex]}\``)
			return message.channel.send(embed);
		}
	}
}