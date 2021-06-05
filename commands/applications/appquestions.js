const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "appquestions",
	description: "Displays all the application questions.",
    category: "applications",
    aliases: ["questions"],
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        if (!database.areQuestionsSet()) {
            const embed = new MessageEmbed()
                .setTitle(":warning: Error")
                .setColor("RED")
                .setDescription(`**No questions were found.**`)
            return message.channel.send(embed);
        }else {
            let questionArray = database.getQuestions();
            let question = "";

            for (quest of questionArray) {
                question += `${quest.id}. ${quest.question}\n`;
              }

            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("📝 Application")
                .setDescription("__**Questions:**__\n```" + question + "```")
            return message.channel.send(embed);
        }
	}
}