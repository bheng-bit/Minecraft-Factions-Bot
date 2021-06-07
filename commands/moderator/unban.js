const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "unban",
    description: "Unban a user from the discord.",
    usage: '<ID>',
    category: "moderator",
    permissions: ["BAN_MEMBERS"],
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        let userID = args[0];

        if(!userID){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }


        message.guild.fetchBans().then(bans=> {
            if(bans.size == 0){
                const err = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Nobody is banned from this server!**`)
                return message.channel.send(err);
            }else {
                let unbanUser = bans.find(b => b.user.id == userID)
                if(!unbanUser){
                    const notbanned = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**This user is not banned!**`)
                    return message.channel.send(notbanned)
                }else {
                    try {
                        const unbanned = new MessageEmbed()
                        .setColor("BLUE")
                        .setDescription(`**The user ${unbanUser.user} has been unbanned!**`)
                    message.channel.send(unbanned)

                    message.guild.members.unban(unbanUser.user)  
                    } catch (error) {
                        const err = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription(`**Something went wrong check my perms and try again!**`)
                        return message.channel.send(err);
                    }                    
                }
            }   
      });   
    }
}