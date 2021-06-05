const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "shield",
    description: "Enable/disabled wall check commands.",
    usage: '<on/off>',
    category: "factions",
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        if (args[0].toLowerCase() === "on"){
            if(database.getBoolean("b_shield")){
                const embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(":shield: Factions Shield")
                    .setDescription(`**Grace is \`enabled\` wall/buffer checking commands are not gonne work!**`)
                return message.channel.send(embed)
            }else if (!database.getBoolean("b_shield")){
                let today = new Date();
			    let currentTime = today.getTime();
                database.updateLastChecks(currentTime);
                database.toggleBoolean("b_shield");
                const embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(":shield: Factions Shield")
                    .setDescription(`**Grace is \`enabled\` wall/buffer checking commands are not gonne work!**`)
                return message.channel.send(embed)
            }
        }else if (args[0].toLowerCase() === "off"){
            if(!database.getBoolean("b_shield")){
                const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(":shield: Factions Shield")
                .setDescription(`**Grace is \`disabled\` wall/buffer checking commands are now gonne work!**`)
            return message.channel.send(embed)
            }else if (database.getBoolean("b_shield")){
                database.toggleBoolean("b_shield");
                let today = new Date();
			    let currentTime = today.getTime();
                database.updateLastChecks(currentTime);
                const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(":shield: Factions Shield")
                .setDescription(`**Grace is \`disabled\` wall/buffer checking commands are now gonne work!**`)
            return message.channel.send(embed)
            }
        }else {
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }
    }
}