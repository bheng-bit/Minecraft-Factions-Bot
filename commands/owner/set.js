const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const util = require('../../utils/functions');
const functions = util.options;

module.exports = {
    name: "set",
    description: "Change bot settings.",
    usage: "<setting> <value>",
    category: "owner",
    args: true,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {

        if(!args[0] || !args[1]){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }else {
            if(functions.channels.includes(args[0])) {
                let channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();

                if(!channel){
                    const missingargs = new MessageEmbed()
				        .setColor("RED")
				        .setTitle(":warning: Incorrect Usage")
				        .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				        .setFooter("<> = required and [] = optional")
			        return message.channel.send(missingargs)
                }else {
                    database.setChannel(args[0], channel.id);
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to **${channel}`);
                    return message.channel.send(embed);
                } 
            }else if(functions.delays.includes(args[0])){
                if(!args[1]){
                    const missingargs = new MessageEmbed()
				        .setColor("RED")
				        .setTitle(":warning: Incorrect Usage")
				        .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				        .setFooter("<> = required and [] = optional")
			        return message.channel.send(missingargs)
                }
                if(isNaN(args[1])){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`\`${args[1]}\` **is not a number!**`)
                    return message.channel.send(embed);
                }else if(args[1] <= 0){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**Time must be greater than 0.**`)
                    return message.channel.send(embed);
                }else {
                    database.setTime(args[0], parseInt(args[1]));
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to** \`${parseInt(args[1])} min\`**.**`);
                    return message.channel.send(embed);
                }
            }else if(functions.modules.includes(args[0])){
                if(!args[1]){
                    const missingargs = new MessageEmbed()
				        .setColor("RED")
				        .setTitle(":warning: Incorrect Usage")
				        .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				        .setFooter("<> = required and [] = optional")
			        return message.channel.send(missingargs)
                }
                if(args[1].toLowerCase() === "true" || args[1].toLowerCase() === "false"){
                    if(args[1].toLowerCase() === "true"){
                        if(database.getBoolean(args[0])){
                            const embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to** \`${args[1]}\`**.**`);
                            return message.channel.send(embed); 
                        }else {
                            database.toggleBoolean(args[0]);
                            const embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to** \`${args[1]}\`**.**`);
                            return message.channel.send(embed);
                        }
                    }else if(args[1].toLowerCase() === "false"){
                        if(!database.getBoolean(args[0])){
                            const embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to** \`${args[1]}\`**.**`);
                            return message.channel.send(embed); 
                        }else {
                            database.toggleBoolean(args[0]);
                            const embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to** \`${args[1]}\`**.**`);
                            return message.channel.send(embed);
                        } 
                    }
                }else {
                    const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`\`${args[1]}\` **is not a boolean!**`)
                return message.channel.send(embed); 
                }
            } else if(functions.roles.includes(args[0])){
                const role = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name === args[1]) || message.mentions.roles.first();
                if(!role){
                    const missingargs = new MessageEmbed()
				        .setColor("RED")
				        .setTitle(":warning: Incorrect Usage")
				        .setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				        .setFooter("<> = required and [] = optional")
			        return message.channel.send(missingargs)
                }else {
                    database.setRole(args[0], role.id);
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: \`${args[0]}\`** has been set to ${role}.**`);
                    return message.channel.send(embed);
                }
            } else {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`\`${args[0]}\` **is not a valid setting! Do \`${config.discord.prefix}settings\` to see all the available settings!**`)
                return message.channel.send(embed);
            }
        }
    }
}