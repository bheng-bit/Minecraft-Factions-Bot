const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "kick",
    description: "Kick a user from the discord.",
    usage: "<@user/ID> [reason]",
    category: "moderator",
    permissions: ["KICK_MEMBERS"],
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        const kickmember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No Reason Given";

        if(!kickmember){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Aliases:** \`${this.aliases || "None"}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }

        if(!kickmember.kickable) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**You can't kick this user!**`)
            return message.channel.send(error);
        }
            
        if(kickmember.id === message.author.id) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**You can't ban yourself!**`)
            return message.channel.send(error);
        }else {
            message.delete();
            try {
                const kick = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**You have been __kicked__ from \`${message.guild.name}\` for \`${reason}\`!**`)
                await kickmember.send(kick).catch(err => {});
                let embed = new MessageEmbed()
                    .setTitle("Member Kicked")
                    .setColor("BLUE")
                    .addField("Kicked:", kickmember, true)
                    .addField("Reason:", `\`${reason}\``, true)
                    .addField("Moderator:", message.author, true)
                    .setThumbnail(kickmember.user.displayAvatarURL({dynamic: true}))
                    .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                message.channel.send(embed);
                kickmember.kick(args[1]);
            } catch (error) {
                const err = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Something went wrong check my perms and try again!**`)
                return message.channel.send(err);
            }
        }
    }
}