const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "players",
    description: "Shows all the online minecraft players.",
    category: "factions",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        if(bot != null) {
                let users = [];
                for(let i in bot.players) {
                    users.push(i)
                }
                users.sort();
                let maxpage = Math.ceil(users.length / 40);
    
                let i0 = 0;
                let i1 = 40;
                let page = 1;
    
                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`Online Players - ${config.minecraft.serverIP} (${users.length})`)
                    .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
                    .setDescription("```" +`${users.slice(i0, i1).join("\n")}`+ "```")
                    .setFooter(`Page ${page} of ${Math.ceil(users.length / 40)}`)
                let msg = await message.channel.send(embed);
    
                await msg.react("⬅️");
                await msg.react("❌");
                await msg.react("➡️");
    
                let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 60000 })

    
                collector.on("collect", async (reaction, user) => {
                    if (reaction._emoji.name === "➡️") {
                        reaction.users.remove(message.author.id);
                        if(page === maxpage){
                            return;
                        }else {
                            i0 = i0 + 40;
                            i1 = i1 + 40;
                            page = page + 1;
        
                            if (i1 > users.size + 40) {
                                return msg.delete();
                            }
                            if (!i0 || !i1) {
                                return msg.delete();
                            }
        
                            description = "```" +`${users.slice(i0, i1).join("\n")}`+ "```"
                            embed
                                .setDescription(description)
                                .setFooter(`Page ${page} of ${Math.ceil(users.length / 40)}`)
                            msg.edit(embed);
                        }
                    }
    
                    if(reaction._emoji.name === "⬅️"){
                        reaction.users.remove(message.author.id);
                        if(page == 2 || page == 1){
                            i0 = 0;
                            i1 = 40;
                            page = 1;
    
                            description = "```" +`${users.slice(i0, i1).join("\n")}`+ "```"
                            embed
                                .setDescription(description)
                                .setFooter(`Page ${page} of ${Math.ceil(users.length / 40)}`)
                            msg.edit(embed);
                        }else {
                            i0 = i0 - 40;
                            i1 = i1 - 40;
                            page = page - 1;
        
                            if (i1 > users.size + 40) {
                                return msg.delete();
                            }
                            if (!i0 || !i1) {
                                return msg.delete();
                            }
        
                            description = "```" +`${users.slice(i0, i1).join("\n")}`+ "```"
                            embed
                                .setDescription(description)
                                .setFooter(`Page ${page} of ${Math.ceil(users.length / 40)}`)
                            msg.edit(embed);
                        }
                    }
                    if(reaction._emoji.name === "❌"){
                        msg.reactions.removeAll();
                        msg.delete();
                    }
                });
        }else {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**The minecraft bot is not online!**`)
            return message.channel.send(error); 
        } 
    } 
}
