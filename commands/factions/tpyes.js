const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "tpyes",
    aliases: ["tpaccept"],
    description: "Sends tpaccept ingame.",
    category: "factions",
    args: false,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {
      if(bot == null) {
        const error = new MessageEmbed()
          .setColor("RED")
          .setTitle(":warning: Error")
          .setDescription(`**The minecraft bot is not online!**`)
        return message.channel.send(error); 
      }
      
        bot.chat("/tpaccept")
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(":white_check_mark: **Succesfully send** "+ `\`/tpaccept\`**on** \`${bot.username}\``)
        message.channel.send(embed);
        setTimeout(() => {
            saving.saving = false;
            if (!chatData.length) {
              chatData[0] = "Try Again";
            }
            let embed = new MessageEmbed()
              .setColor("BLUE")
              .setTitle("Tpaccept")
              .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
              .setTimestamp()
              .setFooter(`${config.minecraft.serverIP}`);
            message.channel.send(embed);
            chatData.length = 0;
          }, 500);
          return;
    }
}