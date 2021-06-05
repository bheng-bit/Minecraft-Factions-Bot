const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "editapp",
	description: "Edit questions for applications",
	usage: "<ID> <question>",
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
        }
        let questionArray = database.getQuestions();
        if(!args[0]){
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
        if(isNaN(args[0])){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`\`${args[1]}\` **is not a number!**`)
            return message.channel.send(embed);
        }
        if(parseInt(args[0]) > questionArray.length || parseInt(args[0]) < 1){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**Please provide a valid question ID\nDo \`${config.discord.prefix}questions\` to see all the questions!**`)
            return message.channel.send(embed);
        }


        let newquest = args.slice(1).join(" ");

        if(!newquest){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\`\n**Permission:** \`${this.permissions}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }
        database.editQuestion(parseInt(args[0]), newquest);

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: **Succesfully changed question with ID: \`${parseInt(args[0])}\` to: \`${newquest}\`**`)
        return message.channel.send(embed);
	}
}