const {
    MessageEmbed
} = require('discord.js');
const config = require('../../config.json');
const EasyMatch = require(`@notlegend/easymatch`);
let matcher = new EasyMatch(`[`, `]`);

module.exports = {
    name: "ftop",
    description: "Displays factions top.",
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

 



        saving.ftopsearch = true;
        bot.chat(config.minecraft.ftopCMD);
        let currentFtop = [];
        let facName = "";
        let value = "";
        let change = "";

        setTimeout(() => {
            saving.ftopsearch = false;
            if (!chatData.length) {
                chatData[0] = "Error while trying to fetch ftop data!";
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
                chatData.length = 0
                return message.channel.send(error);
            } else {
                chatData.forEach(eachLine => {                    
                    let ftopmsg = database.getLayout("l_ftop");
                    let matchResult = matcher.match(eachLine, ftopmsg);

                    let data = [];
                    let ftop = false
                    for (let i in matchResult) {
                        if (matchResult[i] !== null){
                            data.push(matchResult[i])
                            ftop = true
                        } 
                    }

                    if (ftop) {
                        facName += "**" + data[0] + ".** " + data[1] + "\n";
                        value += "$" + data[2] + "\n";

                        let val = data[2].toLocaleString().split(",").join("")
                        
                        currentFtop.push({
                            factionName: data[1],
                            value: val,
                        });
                        let facObj = database.findFaction(data[1]);
                        if (facObj.value() != undefined) {
                            let tempChange =
                                currentFtop.find((faction) => faction.factionName == data[1])
                                .value - facObj.get("value").value();
                            if (tempChange >= 0) {
                                tempChange = tempChange.toLocaleString();
                                change += "+$" + tempChange + "\n";
                            } else {
                                tempChange = Math.abs(tempChange);
                                tempChange = tempChange.toLocaleString();
                                change += "-$" + tempChange + "\n";
                            }
                        } else {
                            change += "N/A\n";
                        }
                    }
                    data.length = 0;
                });
                if(!facName.length || !value.length || !change.length){
                        const error = new MessageEmbed()
                            .setColor("BLUE")
                            .setTitle("Factions Top")
                            .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
                        chatData.length = 0
                    return message.channel.send(error);
                }
                database.pushFtop(currentFtop);

                chatData.length = 0;
                const embed = new MessageEmbed()
                    .setTitle("Factions Top")
                    .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
                    .setColor("BLUE")
                    .setFooter(config.minecraft.serverIP)
                    .addField("Factions", facName, true)
                    .addField("Value", value, true)
                    .addField("Change", change, true)
                return message.channel.send(embed);
            }
        }, 250);
    }
}

