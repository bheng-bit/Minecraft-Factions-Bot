const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "baltop",
	description: "Displays balancetop.",
	aliases: ["balancetop"],
    category: "factions",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {

		if(bot == null) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**The minecraft bot is not online!**`)
			return message.channel.send(error); 
		}
		
		const succes = new MessageEmbed()
			.setColor("GREEN")
			.setDescription(":white_check_mark: **Succesfully send** " + `\`/baltop\` **on** \`${bot.username}\``)
		message.channel.send(succes);
		saving.saving = true;
		bot.chat("/baltop");
		setTimeout(() => {
			saving.saving = false;
			if (!chatData.length) {
				chatData[0] = "Try Again";
				const error = new MessageEmbed()
					.setColor("RED")
					.setTitle(":warning: Error")
					.setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
				return message.channel.send(error);
			} else {
				const embed = new MessageEmbed()
					.setTitle("Balance Top")
					.setColor("BLUE")
					.setDescription("```" + chatData.join("\n") + "```")
					.setFooter(config.minecraft.serverIP)
				chatData.length = 0;
				return message.channel.send(embed);
			}
		}, 500);
	}
}