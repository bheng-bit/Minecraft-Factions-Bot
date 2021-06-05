const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "resetapp",
	description: "Reset all the questions for applications.",
    category: "applications",
    permissions: ["MANAGE_ROLES"],
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        if (!database.areQuestionsSet()) {
            const embed = new MessageEmbed()
                .setTitle(":warning: Error")
                .setColor("RED")
                .setDescription(`**No questions were found.**`)
            return message.channel.send(embed);
        }else {
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`**React with ✅ to reset all the questions.**`)
            let confirm = await message.channel.send(embed);

            await confirm.react("✅");
            await confirm.react("❌");

            const collector = confirm.createReactionCollector((reaction, user) => user.id === message.author.id, {time: 30000});

            let reset = false;

            collector.on('collect', async (reaction, user) => {
                if(reaction._emoji.name === "✅"){
                    confirm.reactions.removeAll();
                    database.resetQuestions();
                    reset = true;
                    const succes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`✅** Succesfully reset the questions.**`)
                    return confirm.edit(succes)
                }
                if(reaction._emoji.name === "❌"){
                    confirm.reactions.removeAll();
                    reset = true;
                    const cancel = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`** Cancelled resetting the questions.**`)
                    return confirm.edit(cancel)
                }
            });

            collector.on('end', () => {
                confirm.reactions.removeAll();
                if(!reset){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setDescription('**You took too long to react, confirmation failed.**')
                    return message.channel.send(error)
                }
            });
        }
	}
}