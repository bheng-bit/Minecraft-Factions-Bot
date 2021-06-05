const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const util = require('../../utils/functions');
const functions = util.options;

module.exports = {
    name: "settings",
    description: "Displays bot settings.",
    category: "owner",
    args: false,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {
        let channeldescription = `**Syntax:**`+ "\n```"+ `${config.discord.prefix}set <setting> <value>\n${config.discord.prefix}set c_serverchat #server-chat`+ "```"+ `\n__**Channels:**__\n`;

        let timedescription = `**Syntax:**`+ "\n```"+ `${config.discord.prefix}set <setting> <value>\n${config.discord.prefix}set t_autoFop 15`+ "```"+ `\n__**Times:**__ (in min)\n`;

        let booleandescription = `**Syntax:**`+ "\n```"+ `${config.discord.prefix}set <setting> <value>\n${config.discord.prefix}set b_serverChat true`+ "```"+ `\n__**Modules:**__\n`;

        let rolesdescription = `**Syntax:**`+ "\n```"+ `${config.discord.prefix}set <setting> <value>\n${config.discord.prefix}set r_muted @Muted`+ "```"+ `\n__**Roles:**__\n`;

        let layoutdescription = `**Syntax:**`+ "\n```"+ `${config.discord.prefix}set <setting> <value>\n${config.discord.prefix}set l_ftop [Pos]. [Faction] Total: [Value]`+ "```"+ `\n__**Layouts:**__\n\n`;

        for(eachArgs of functions.channels) {
            let getID = database.getChannelID(eachArgs);
            let channel = message.client.channels.cache.find(
                (channel) => channel.id === getID
            );
            if (channel == undefined) {                
                channeldescription += `**${eachArgs}:** \`Channel is not setup\`` + "\n";
            } else {
                channeldescription += `** ${eachArgs}:** <#` + getID + ">\n";
            }
        }
        for(eachArgs of functions.roles) {
            let getRole = database.getRole(eachArgs);
            let role = message.guild.roles.cache.get(getRole);
            rolesdescription += `** ${eachArgs}:** ${role || "\`Role is not setup\`"} \n`
        }
        for(eachArgs of functions.delays) {
            let getTime = database.getTime(eachArgs);
            timedescription += `** ${eachArgs}:** \`${getTime}\` \n`
        }

        for(eachArgs of functions.modules) {
            let bool = database.getBoolean(eachArgs);
            booleandescription += `**${eachArgs}:** \`${bool}\` \n`
        }

        for(eachArgs of functions.layouts) {
            let bool = database.getLayout(eachArgs);
            layoutdescription += `**${eachArgs}:**\n \`\`\`${bool}\`\`\`\ \n`
        }

        let pages = [`${channeldescription}`, `${rolesdescription}`, `${timedescription}`, `${booleandescription}`, `${layoutdescription}`]; 
        let page = 1; 

        const embed = new MessageEmbed()
            .setTitle("Bot Settings")
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
                reaction.users.remove(message.author.id);
                msg.reactions.removeAll();
                msg.delete();
            }
        })
        collector.on("end", () => {
            msg.reactions.removeAll();
        });
    }
}