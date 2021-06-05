const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const EasyMatch = require(`@notlegend/easymatch`);
let matcher = new EasyMatch(`[`, `]`);

module.exports = {
    name: "flist",
    description: "Displays factions list.",
    usage: '',
    category: "factions",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {

        if(bot == null) {
			const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**The minecraft bot is not online!**`)
			return message.channel.send(error); 
		}

    saving.flistsearch = true;

    let facName = "";
    let value = "";

    bot.chat("/f list");
    setTimeout(() => {
        saving.flistsearch = false;
        if (chatData.length <= 1) {
            chatData[0] = "Try Again";
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
            return message.channel.send(error);
        }else {
            let i = 1;
            chatData.forEach(eachLine => {
                let flistmsg = database.getLayout("l_flist");
                let matchResult = matcher.match(eachLine, flistmsg);

                let flist = true;
                for(let i in matchResult) {
                    if(matchResult[i] == null) flist = false;
                }
                if(flist){
                    facName += `**${i}.** ` + matchResult.Faction + "\n";
                    value += `${matchResult.Online} / ${matchResult.Max}` + "\n";
                    i++;
                }
            });
            if(facName.length < 0 || value.length < 0){
                const embed = new MessageEmbed()
                    .setTitle("Factions List")
                    .setColor("BLUE")
                    .setDescription("```" + chatData.join("\n") + "```")
                    .setFooter(config.minecraft.serverIP)
                chatData.length = 0;
                return message.channel.send(embed);
            }
            chatData.length = 0;
            const embed = new MessageEmbed()
                .setTitle("Factions List")
                .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
                .setColor("BLUE")
                .setFooter(config.minecraft.serverIP)
                .addField("Factions", facName, true)
                .addField("Online", value, true)
            return message.channel.send(embed);
        }
    }, 500)
    }
}