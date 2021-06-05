const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "mcbot",
    description: "Displays minecraft bot information.",
    category: "general",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        if(bot != null) {
            let online = 0; 
            let verified = 0;
            for(let i in bot.players) ++online;
            
            for(let i in bot.players) if(database.isUserVerified(bot.players[i].username))verified++;
                
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`Minecraft Bot Information`)
                .setThumbnail(`https://crafatar.com/avatars/` + bot.players[bot.username].uuid)
                .setDescription(`**IGN:** \`${bot.username}\`\n**Server IP:** \`${config.minecraft.serverIP}\`\n**Ping:** \`${bot.player.ping}ms\`\n**Verified players online:** \`${verified}\`\n**Players Online:** \`${online}\``)
            return message.channel.send(embed);
        }else {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**The minecraft bot is not online!**`)
            return message.channel.send(error);
        } 
    }
}
