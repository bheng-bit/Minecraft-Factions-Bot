const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "roster",
    description: "Manage your factions roster.",
    usage: '<list/add/remove> [@user] [ign]',
    permissions: ["MANAGE_ROLES"],
    category: "owner",
    args: true,
    async run(client, message, args, bot, chatData, saving, database) {
        if(args[0] === "list"){
            if(database.getUserSize() == 0){
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription("**There nobody on your factions roster.**")
                return message.channel.send(error)
            }else {
                const embed = new MessageEmbed()
                let ingame = "";
                let discord = "";
                for(i = 0; i < database.getUserSize(); i++){
                    let user = database.getUserPosition(i);
    
                    ingame += user.username + "\n";
                    discord += `<@${user.discordID}>` + "\n";
                }
                embed
                    .setColor("BLUE")
                    .setTitle(`Factions Roster (${database.getUserSize()})`)
                    .addField("IGN", `\`${ingame}\``, true)
                    .addField("Discord", discord, true)
                return message.channel.send(embed);
            }
        }else if (args[0].toLowerCase() === "add"){
            if(!args[1] || !args[2]){
                const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
            } else {
                let discord =  args[1].replace(/[^a-zA-Z0-9]/g, "")
                let ign = args[2];
                
                if(database.isVerified(discord)){
                    let user = client.users.cache.find(user => user.id === (discord))
                    
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`${user} **is already on the roster.**`)
                    return message.channel.send(embed)
                }else if(database.isUserVerified(ign)){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`\`${ign}\` **is already on the roster.**`)
                    return message.channel.send(embed)
                }else {
                    await database.addUser(ign, discord)
                    let user = client.users.cache.find(user => user.id === (discord))

                    const succes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: ${user} **has been added to the roster with the IGN:** \`${ign}\``)
                    return message.channel.send(succes)
                }
            }
        }else if(args[0].toLowerCase() === "remove"){
            if(!args[1] || args[2]){
                const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
            } else {
                let ign = args[1];
                if(!database.isUserVerified(ign)){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`\`${ign}\` **is not on the roster.**`)
                    return message.channel.send(embed)
                }else {
                    database.deleteUserMc(ign)
                    const succes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: \`${ign}\` **has been removed from the roster**`)
                    return message.channel.send(succes)
                }
            }
        }
    }
}