const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const region = {
    "brazil": `:flag_br: \`Brazil\``,
    "europe": `:flag_eu: \`Europe\``,
    "india": `:flag_in: \`India\``,
    "japan": `:flag_jp: \`Japan\``,
    "singapore": `:flag_sg: \`Singapore\``,
    "us-central": `:flag_us: \`US-Central\``,
    "us-east": `:flag_us: \`US-East\``,
    "us-south": `:flag_us: \`US-South\``,
    "us-west": `:flag_us: \`US-West\``,
    "sydney": `:flag_au: \`Sydney\``,
    "hongkong": `:flag_hk: \`Hong Kong\``,
    "russia": `:flag_ru: \`Russia\``,
    "southafrica": `:flag_za: \`South Africa\``
};

module.exports = {
    name: "serverinfo",
    description: "Displays information about discord guild.",
    aliases: ["si"],
    category: "general",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        let members = message.guild.members.cache.filter(member => !member.user.bot).size;
        let bots = message.guild.members.cache.filter(member => member.user.bot).size;
        let textChannels = message.guild.channels.cache.filter((c) => c.type === "text").size;
        let voiceChannels = message.guild.channels.cache.filter((c) => c.type === "voice").size;
        let categories = message.guild.channels.cache.filter((c) => c.type == "category").size;

        let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .filter((role) => role.name !== "@everyone")
            .join(",")

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Server Info - ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField("Server Owner", `\`${message.guild.owner.user.tag}\``, true)
            .addField("Server ID", `\`${message.guild.id}\``, true)
            .addField("Region", `${region[message.guild.region]}`, true)
            .addField("Members", `\`${members} members\``, true)
            .addField("Bots",`\`${bots} bots\``, true)
            .addField("Boosts", `\`${message.guild.premiumSubscriptionCount} Boosts (Tier ${message.guild.premiumTier})\``, true)
            .addField("Text Channels", `\`${textChannels}\``, true)
            .addField("Voice Channels", `\`${voiceChannels}\``, true)
            .addField("Categories", `\`${categories}\``, true)
            .addField(`Roles (${message.guild.roles.cache.size - 1})`, `${rolemap}`)
        return message.channel.send(embed);
    }
}
