const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
const prefix = config.discord.prefix;

module.exports = {
	name: "help",
	description: "Displays all the available commands.",
	usage: "[command name]",
    category: "general",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {

    if (!args[0]) {
        const categories = fs.readdirSync("./commands/")

        let pages = []; 
        let page = 1; 
    
        categories.forEach(category => {
            
            const dir = client.commands.filter(c => c.category === category)
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
            let desc = `**__${capitalise} Commands:__**\n`;
    
            dir.forEach(command => {
                desc += `**${prefix}${command.name}** - \`${command.description}\`\n`
            });
            pages.push(desc);
        })
    
        const embed = new MessageEmbed()
            .setTitle("Help Command")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("BLUE")
            .setDescription(pages[page - 1])
            .setFooter(`Page ${page} of ${pages.length}`)
        let msg = await message.channel.send(embed);
    
        await msg.react("⬅️");
        await msg.react("❌");
        await msg.react("➡️");
    
        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 60000 })
    
        collector.on("collect", async (reaction, user) => {
            if(reaction._emoji.name === "⬅️"){
                reaction.users.remove(message.author.id);
                if (page === 1) return;
                page = page - 1;
                embed
                    .setDescription(pages[page-1])
                    .setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed)
    
            }
            if(reaction._emoji.name === "➡️"){
                reaction.users.remove(message.author.id);
                if (page === pages.length) return;
                page++;
                embed
                    .setDescription(pages[page-1])
                    .setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed)
            }
            if(reaction._emoji.name === "❌"){
                msg.reactions.removeAll();
                msg.delete();
            }
        });
        collector.on("end", () => {
            msg.reactions.removeAll();
        });
    }else{
        let command = client.commands.get(args[0].toLowerCase()) ||  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

        if (!command){
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Invalid Command")
                .setDescription(`\`${args[0]}\` **is a invalid command!** **Do \`${prefix}help\` to see all the available commands.**`)
            return message.channel.send(error)
        } 

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setFooter(`Do ${prefix}help for all the commands.`, client.user.displayAvatarURL({dynamic: true}))
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`
**${client.user.username}'s prefix is:** \`${prefix}\`

**Command:** \`${command.name}\`
**Description:** \`${command.description}\`
**Aliases:** \`${command.aliases ? command.aliases.join(", ") : "None"}\`
**Permission Required:** \`${command.permissions || "None"}\`
**Usage:** \`${command.usage ? `${prefix}${command.name} ${command.usage}` : `${prefix}${command.name}`}\``)
        return message.channel.send(embed);
        }
	}
}