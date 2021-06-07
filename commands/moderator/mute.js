const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "mute",
    description: "Mute a user.",
    usage: '<@user/ID> [reason]',
    category: "moderator",
    permissions: ["MANAGE_ROLES"],
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ')
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
        if(!reason) reason = "No Reason Given"

        if(!member){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }else {
            if(member == message.member){
                const yourself = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**You cannot mute yourself!**`)
                return message.channel.send(yourself) 
            }else {
                if (member.roles.highest.position >= message.member.roles.highest.position){
                    const yourself = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**You cannot mute someone with an equal or higher role!**`)
                    return message.channel.send(yourself)
                }else {
                    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
                    if(!muteRole){
                        try {
                            muteRole = await message.guild.roles.create({
                                data: {
                                    name: "Muted",
                                    color: "#000000",
                                    permissions: []
                                },
                                reason: "Creating a muted role."
                            })
                            message.guild.channels.cache.forEach((channel) => {
                                channel.overwritePermissions([
                                    {
                                        id: muteRole.id,
                                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
                                    }
                                ]);
                            });
                        } catch (err) {
                            const error = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(":warning: Error")
                                .setDescription(`**Something went wrong check my perms and try again!**`)
                            return message.channel.send(error)
                        }
                        try {
                            await member.roles.add(muteRole);
                            
                        } catch (err) {
                            const error2 = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(":warning: Error")
                                .setDescription(`**I cannon't give this role!**`)
                            return message.channel.send(error2)
                        }
  
                        const mute = new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`**You have been __muted__ in \`${message.guild.name}\` for \`${reason}\`!**`)
                        await member.send(mute).catch(err => {console.log(err)});

                        let embed = new MessageEmbed()
                            .setTitle("Member Muted")
                            .setColor("BLUE")
                            .addField("Muted:", member, true)
                            .addField("Reason:", `\`${reason}\``, true)
                            .addField("Moderator:", message.author, true)
                            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        return message.channel.send(embed);

                    }else {
                        if (member.roles.cache.has(muteRole.id)){
                            const err = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(":warning: Error")
                                .setDescription(`**${member} is already muted!**`)
                            return message.channel.send(err)
                        }else {
                            try {
                                await member.roles.add(muteRole);
                                
                            } catch (err) {
                                const error3 = new MessageEmbed()
                                    .setColor("RED")
                                    .setTitle(":warning: Error")
                                    .setDescription(`**I cannon't give this role!**`)
                                return message.channel.send(error3)
                            }
                            const mute = new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`**You have been __muted__ in \`${message.guild.name}\` for \`${reason}\`!**`)
                            await member.send(mute).catch(err => {});
                            let embed = new MessageEmbed()
                                .setTitle("Member Muted")
                                .setColor("BLUE")
                                .addField("Muted:", member, true)
                                .addField("Reason:", `\`${reason}\``, true)
                                .addField("Moderator:", message.author, true)
                                .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return message.channel.send(embed);
                        }
                    }
                }
            }
        }  
    }
}