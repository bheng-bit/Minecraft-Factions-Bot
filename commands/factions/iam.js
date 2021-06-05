const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "iam",
    description: "Whitelists your minecraft name to your discord account.",
    usage: '<ign>',
    aliases: ["link"],
    category: "factions",
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        if(bot == null) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**The minecraft bot is not online!**`)
			return message.channel.send(error); 
		}
        
        let iamchannel = message.guild.channels.cache.find((ch) => ch.id === database.getChannelID("c_iam"));

        if(!iamchannel){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**Iam channel has not been setup yet!**`)
            return message.channel.send(embed);
        }else {
            if(message.channel.id != iamchannel.id){
                const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**Use this command in ${iamchannel}**`)
            return message.channel.send(embed);
            }else {
                const ign = args[0];
                if(!ign){
                    const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
                }else {
                    if(database.isVerified(message.author.id)){
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription(`**You are already verified!**`)
                        return message.channel.send(embed);
                    }else {
                        let onlinePlayers = []
                        for(let i in bot.players) {
                            onlinePlayers.push(i)
                        }
                    
                        if(!onlinePlayers.includes(ign)){
                            const embed = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(":warning: Error")
                                .setDescription(`**You need to be connected to \`${config.minecraft.serverIP}\` to use this command.**`)
                            return message.channel.send(embed);
                        }else {
                            database.findTempUser(message.author.id)
                            try {
                                const embed = new MessageEmbed()
                                    .setColor("GREEN")
                                    .setDescription(`:white_check_mark: You are almost verified. Message \`${bot.username}\` on \`${config.minecraft.serverIP}\` the code i sent you to verify your account.`)
                                message.channel.send(embed);
    
                                const code = database.createTempCode(message.author.id, ign);
                                
                                const dmembed = new MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription(`
                                    
__**Ingame verification**__
    
`+ "```" + code + "```" + `
    
Message the code above to \`${bot.username}\` on \`${config.minecraft.serverIP}\` to verify your account.

**Ingame Command:** \`/msg ${bot.username} ${code}\``)
    
                                message.author.send(dmembed);
                            } catch (error) {
                                const embed = new MessageEmbed()
                                    .setColor("RED")
                                    .setTitle(":warning: Error")
                                    .setDescription(`**Make sure you have your discord DM's open.**`)
                                return message.channel.send(embed);
                            }
                        }
                    }
                }
            }
        }
    }
}