const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "purge",
    description: "Clear amount of messages.",
    usage: "<#messages>",
    category: "moderator",
    permissions: ["MANAGE_MESSAGES"],
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        let amount = args[0];

        if(!amount || amount < 1 || amount > 100 || isNaN(amount)){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Aliases:** \`${this.aliases || "None"}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        } 
        if(amount = 100) amount = 99;
        message.channel.bulkDelete(Number(amount) + 1).then(() => {

            const succes = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`:white_check_mark: **Succesfully deleted \`${args[0]}\` messages.**`)
            message.channel.send(succes).then((msg) => {
                setTimeout(() => {
                    msg.delete().catch((err) => {});
                }, 3000);
                return;
            });
        }); 
    }  
}