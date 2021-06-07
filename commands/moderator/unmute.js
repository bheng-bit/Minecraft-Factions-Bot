const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "unmute",
    description: "Unmute a user.",
    usage: '<@user/ID>',
    category: "moderator",
    permissions: ["MANAGE_ROLES"],
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if(!member){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }else {
            let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
            
            if(!muteRole){
                const nomute = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**There is not role called "Muted" on this server.**`)
                return message.channel.send(nomute);
            }else if (member.roles.cache.has(muteRole.id)){
                try {
                    await member.roles.remove(muteRole);
                    
                } catch (err) {
                    const error2 = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**I cannon't give this role!**`)
                    return message.channel.send(error2)
                }
                const unmute = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**You have been __unmuted__ in \`${message.guild.name}\`!**`)
                member.send(unmute).catch(err => {});

                let embed = new MessageEmbed()
                    .setTitle("Member Unmuted")
                    .setColor("BLUE")
                    .addField("Muted:", member, true)
                    .addField("Moderator:", message.author, true)
                    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                return message.channel.send(embed);
            }else {
                const nomute = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**${member} is not muted!**`)
                return message.channel.send(nomute); 
            }
        }
    }
}
