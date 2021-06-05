const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "userinfo",
    description: "Displays information about specified user.",
    aliases: ["whois"],
    usage: "[@user/ID]",
    category: "general",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const roles = member.roles.cache.array().length ? member.roles.cache.array().filter((role) => role.name !== "@everyone").join(", ") : "*None*";

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`User Info - ${member.user.username}#${member.user.discriminator}`)
            .setThumbnail(member.user.displayAvatarURL({format:'png', dynamic: true, size: 1024}))
            .addField("Created", `\`${moment(member.user.createdTimestamp).format("DD MMM YYYY")}\``, true)
            .addField("Joined Server", `\`${moment(member.joinedAt).format("DD MMM YYYY")}\``, true)
            .addField("Nickname", `\`${member.displayName || "None"}\``, true)
            .addField("User ID", `\`${member.user.id}\``, true)
            .addField("Presence", `\`${member.user.presence.game || "Not playing a game."}\``, true)
            .addField("Highest Role", `${member.roles.highest.id === message.guild.id ? "None" : member.roles.highest}`, true)
            .addField(`Roles (${member.roles.cache.size - 1})`, `${roles || "None"}`, false)

        return message.channel.send(embed);
    }
}
