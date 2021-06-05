const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const reactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹']

module.exports = {
	name: "poll",
	description: "Make a poll in discord.",
	usage: '<question> | <option 1> | <option 2> | [option 3] ...',
    permissions: ["KICK_MEMBERS"],
    category: "general",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
        const [question, ...choices] = args.join(' ').split(' | ');

        if(!question || !choices){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }else {
            setTimeout(() => {
                message.delete()
            }, 1000)
            const sent = await message.channel.send(new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                .setTitle("New Poll")
                .setDescription(`**${question}**\n` + choices.map((choice, i) => `${reactions[i]} ${choice}`).join('\n')))
                for (i = 0; i < choices.length; i++) await sent.react(reactions[i])
            return;
        }
		
	}
}