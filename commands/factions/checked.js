const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

const timeFormat = {
    months: 2592000,
    weeks: 604800,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1,
};

function getDifference(previousTime, currentTime) {
    var d = Math.abs(currentTime - previousTime) / 1000;
    var r = {};
    Object.keys(timeFormat).forEach(function (key) {
      r[key] = Math.floor(d / timeFormat[key]);
      d -= r[key] * timeFormat[key];
    });
    return r;
}

module.exports = {
    name: "checked",
    aliases: ["clear"],
    description: "Mark your walls as clear.",
    category: "factions",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        const wallcheckchannel = client.channels.cache.find(
            (channel) => channel.id === database.getChannelID("c_wallChecks")
        );

        if (!wallcheckchannel) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**Wall Check channel has not been setup yet!**`)
            return message.channel.send(embed);
        }else {
            if (message.channel.id != database.getChannelID("c_wallChecks")) {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Use this command in ${wallcheckchannel}**`)
                return message.channel.send(embed);
            }else {
                if(database.getBoolean("b_shield")){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(":warning: Error")
                        .setDescription(`**Shield is currently \`enabled\` walls checks don't work now!**`)
                    return message.channel.send(embed);
                }else {
                    const user = database.getDiscordUserObject(message.author.id).value();
                    if (user == undefined) {
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription(`**You are not verified with the bot!**`)
                        return message.channel.send(embed);
                    }
                    if (bot.players[user.username] == undefined) {
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription(`**You need to be connected to \`${config.minecraft.serverIP}\` to use this command.**`)
                        return message.channel.send(embed);
                    }
                    let today = new Date();
                    let currentTime = today.getTime();
                
                    let userWallObject = database.getUserObject(user.username);
    
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("✅ Wall Check")
                        .setThumbnail(`https://crafatar.com/avatars/` + bot.players[user.username].uuid)
                    
                        userWallObject = userWallObject.get("userWallChecks");
    
                    const timeDifference = getDifference(
                    userWallObject.value().lastWallChecked,
                    currentTime
                    );
                    if (timeDifference.minutes >= 1) {
                        database.updateWallChecked(userWallObject, currentTime);
                        bot.chat("/f c f")
                        bot.chat("[Bot] Walls Checked by " + user.username + ", who has total " + userWallObject.get("wallChecks").value() + " wall checks.");
                        embed.addField("Walls have been checked by:", `\`${user.username}\``)
                        embed.addField("Total Checks:", `\`${userWallObject.get("wallChecks").value()}\``)
                        return wallcheckchannel.send(embed);
                    } else {
                        let coolDown = Math.abs(60 - timeDifference.seconds);
    
                        const cooldown = new MessageEmbed()
                            .setTitle("⏳ Cooldown")
                            .setColor("ORANGE")
                            .setDescription(`\`${user.username}\`` + " you are in a **" + coolDown.toFixed(2) + "** seconds cooldown.")
                        bot.chat("[Bot] " + user.username + " you are in a " + coolDown.toFixed(2) + " seconds cooldown.");
                        return wallcheckchannel.send(cooldown);
                    }
                }
            }
        }
    }
}