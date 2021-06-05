const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "restart",
    description: "Restart the discord bot.",
    category: "owner",
    args: false,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(":white_check_mark: **Restarting the bot...**")
    message.channel.send(embed).catch(console.error);
    setTimeout(() => {
      process.exit();
    }, 2000);
    return;
    }
}