const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "tps",
    description: "Displays servers tps.",
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

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setFooter(config.minecraft.serverIP)
            .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
            .setTitle(":bar_chart: Server TPS")
            .setDescription(`**TPS:** \`${bot.getTps()}\``)
        return message.channel.send(embed);
    }
}