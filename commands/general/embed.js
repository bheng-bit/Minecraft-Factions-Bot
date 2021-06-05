const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "embed",
	description: "Embed a discord message.",
	usage: "[title] [description]",
	category: "general",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		let command = message.content;

        let titleStart = command.indexOf('[');
        let titleEnd = command.indexOf(']');
        let title = command.substr(titleStart + 1, titleEnd - titleStart - 1);

        let descStart = command.indexOf('[', titleStart + 1);
        let descEnd = command.indexOf(']', titleEnd + 1);
        let description = command.substr(descStart + 1, descEnd - descStart - 1);

        if(!title || !description){
            const missingargs = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Incorrect Usage")
                .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Category:** \`${this.category}\`\n**Ussage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n`)
                .setFooter("<> = required and [] = optional")
            return message.channel.send(missingargs)
        }
        message.delete();
        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(title)
        .setDescription(description)
        .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
        return message.channel.send(embed);   
	}
}