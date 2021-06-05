const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "fwho",
    aliases: ["fshow"],
    description: "Displays factions information.",
    category: "factions",
    usage: '<faction>',
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {

        if(bot == null) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**The minecraft bot is not online!**`)
			return message.channel.send(error); 
		}
        
        saving.fwhosearch = true;
        bot.chat("/f who "+ args[0]);
        setTimeout(() => {
            saving.fwhosearch = false;
            if (chatData.length <= 1) {
                chatData[0] = "Try Again";
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
                return message.channel.send(error);
            }else {
                const embed = new MessageEmbed()
                    .setTitle("Factions Who - "+ args[0])
                    .setColor("BLUE")
                    .setDescription("```" + chatData.join("\n") + "```")
                    .setFooter(config.minecraft.serverIP)
                    chatData.length = 0;
                return message.channel.send(embed);
            }
        }, 750);
    }
}