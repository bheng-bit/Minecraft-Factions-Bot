const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');


module.exports = {
    name: "ctop",
    aliases: ["wallstop"],
    description: "Displays the top wall checkers.",
    usage: '',
    category: "factions",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        let users = "";
        let wallChecks = "";
        let count = 1;
        const usersObject = database.getAllUsersObject().orderBy("userWallChecks.wallChecks", "desc").value();
        if (usersObject.length == 0) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**There is not enough user data.**`)
            return message.channel.send(error);
        }else {
            for (eachUser of usersObject) {
                users += `**${count}.** \`${eachUser.username}\`\n`;
                wallChecks += `${eachUser.userWallChecks.wallChecks}\n`;
                count += 1;
            }
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Top Walls Checkers")
                .setFooter(config.minecraft.serverIP)
                .addField("Buffer Checker", users, true)
                .addField("Checks", wallChecks, true)
            return message.channel.send(embed);
        }
    }
}