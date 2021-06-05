const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "roles",
	description: "Displays all the servers roles.",
    category: "general",
	args: false,
	async run(client, message, args, bot, database, chatData, saving) {
		let role = message.guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => `${r.members.array().length} ${r.members.array().length > 1 ? 'members' : 'member '}       ${r.name}`)
        .slice(0, -1)
        .join("\n");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`${message.guild.name} Server Roles`)
            .setDescription(`\`\`\`${role}\`\`\``)

        return message.channel.send(embed)
	}
}