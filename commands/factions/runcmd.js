const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "runcmd",
    description: "Run a command ingame.",
    usage: "<command>",
    category: "factions",
    args: true,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {

      if(bot == null) {
        const error = new MessageEmbed()
          .setColor("RED")
          .setTitle(":warning: Error")
          .setDescription(`**The minecraft bot is not online!**`)
        return message.channel.send(error); 
      }

    bot.chat("/" + args.join(" "));
    saving.saving = true;
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(":white_check_mark: **Succesfully send** "+`\`/${args.join(" ")}\` **on** \`${bot.username}\``)
    message.channel.send(embed);
    setTimeout(() => {
      saving.saving = false;
      if (!chatData.length) {
        chatData[0] = "Try Again";
      }
      let embedSudo = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("RunCmd")
        .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
        .setTimestamp()
        .setFooter(`${config.minecraft.serverIP}`);
      message.channel.send(embedSudo);
      chatData.length = 0;
    }, 750);
    return;
    }
}