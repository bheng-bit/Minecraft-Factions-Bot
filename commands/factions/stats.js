const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "stats",
    description: "Displays players statistics.",
    usage: '<@user>',
    category: 'factions',
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {

        let user =  message.mentions.members.first() || message.member;

        if(!user) {
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }

        const verified = database.getDiscordUserObject(user.id).value();
		if (verified == undefined) {
			const embed = new MessageEmbed()
				.setColor("RED")    
    			.setTitle(":warning: Error")
				.setDescription(`**${user} is not verified with the bot!**`)
			return message.channel.send(embed)
        }

        const userObj = database.getDiscordUserObject(user.id).value();

        if(userObj.username == undefined){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`${user} **is not verified with the bot**`)
            return message.channel.send(embed);
        }else {
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("👤 Player Statistics")
                .setFooter(config.minecraft.serverIP)
                .addField("IGN", `\`${userObj.username}\``, true)
                .addField("Wall checks", `\`${userObj.userWallChecks.wallChecks}\``, true)
                .addField("Buffer checks", `\`${userObj.userWallChecks.bufferChecks}\``, true)

            if(bot != undefined){
                embed.setThumbnail(`https://crafatar.com/avatars/` + bot.players[userObj.username].uuid)
            }
            return message.channel.send(embed);
        }
    }
}