const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

const directions = ["north", "south", "west", "east"];

module.exports = {
    name: "weewoo",
    description: "Tag everyone to alert them of a possbile raid.",
    usage: '<north/west/south/east>',
    category: "factions",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {

        const weewoochannel = client.channels.cache.find(
            (channel) => channel.id === database.getChannelID("c_weewoo")
        );
        if(bot == null) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**The minecraft bot is not online!**`)
			return message.channel.send(error); 
		}

        if (!weewoochannel) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**Weewoo channel has not been setup yet!**`)
            return message.channel.send(embed);
        }else {
            if(message.channel.id != weewoochannel.id){
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Use this command in ${weewoochannel}**`)
                return message.channel.send(embed);
            }else {
                if(database.getBoolean("b_shield")){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**Shield is currently \`enabled\` wall/buffer checks don't work now!**`)
                    return message.channel.send(embed);
                }else {
                    const user = database.getDiscordUserObject(message.author.id).value();
                    if (user == undefined) {
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription(`**You are not verified with the bot!**`)
                        return message.channel.send(embed);
                    }else {
                        if (bot.players[user.username] == undefined) {
                            const embed = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(":warning: Error")
                                .setDescription(`**You need to be connected to \`${config.minecraft.serverIP}\` to use this command.**`)
                            return message.channel.send(embed);
                        }else {
                            if(!args[0]){
                                const embed = new MessageEmbed()
                                    .setColor("RED")
                                    .setThumbnail("https://i.imgur.com/oAJOKSy.jpg")
                                    .setTitle("We are getting raided!")
                                    .addField("Triggered by", message.author, true)
                                    .setFooter(config.minecraft.serverIP)
                                message.channel.send(embed)
                                
                                for(i = 0; i < 5; i++){
                                    bot.chat(`[ALERT] WEEWOO We are getting raided!! x${i}`)
                                    message.channel.send("@everyone")
                                }
                                return;
                                
                            }else if(directions.includes(args[0].toLowerCase())){
                                const embed = new MessageEmbed()
                                    .setColor("RED")
                                    .setThumbnail("https://i.imgur.com/oAJOKSy.jpg")
                                    .setTitle("We are getting raided!")
                                    .addField("Triggered by", message.author, true)
                                    .addField("Side", `\`${args[0]}\``, true)
                                    .setFooter(config.minecraft.serverIP)
                                message.channel.send(embed)
                            
                                for(i = 0; i < 3; i++){
                                    bot.chat(`[Bot] WEEWOO We are getting raided!! ${args[0]} side x${i}`)
                                    message.channel.send("@everyone")
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }  
    }
}