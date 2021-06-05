const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "btop",
    aliases: ["bufferstop"],
    description: "Displays the top buffer checkers.",
    usage: '',
    category: "factions",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        let users = "";
        let bufferChecks = "";
        let count = 1;
        const usersObject = database.getAllUsersObject().orderBy("userWallChecks.bufferChecks", "desc").value();
        if (usersObject.length == 0) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**There is not enough user data.**`)
            return message.channel.send(error);
        }else {
            for (eachUser of usersObject) {
                users += `**${count}.** \`${eachUser.username}\`\n`;
                bufferChecks += `${eachUser.userWallChecks.bufferChecks}\n`;
                count += 1;
            }
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Top Buffer Checkers")
                .setFooter(config.minecraft.serverIP)
                .addField("Buffer Checker", users, true)
                .addField("Checks", bufferChecks, true)
            return message.channel.send(embed);
        }
    }
}