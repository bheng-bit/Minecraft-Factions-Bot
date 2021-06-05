const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: "setupapp",
	description: "Setup questions for the applications.",
    category: "applications",
    permissions: ["MANAGE_ROLES"],
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        let description = "";
        if (database.areQuestionsSet()) {
            const embed = new MessageEmbed()
                .setTitle(":pencil: Application Questions")
                .setColor("BLUE")
                .setDescription(`**Questions have already been set\nWould you like to reset the questions?\nType \`${config.discord.prefix}resetapp\` to remove the questions.**`)
            return message.channel.send(embed);
        }else {
            const filter = (m) => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {
              time: 60000,
            });
            let questions = [];

            description = "**Please start typing the questions one line at a time. \nWhen ur done react with ✅. \nIf you wanne cancel the process react with ❌**\n\n**Example:** \n```What is your age? (Press Enter)\nType next question: What is your IGN? (Press Enter)```\n"

            const embed = new MessageEmbed()
                .setTitle("📝 Application Setup Started")
                .setDescription(description)
                .setColor("BLUE")
            let m = await message.channel.send(embed);
            await m.react("✅")
            await m.react("❌");

            let coll = m.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 600000 });

            let question = "";
            let done = false;
            let cancel = false;

            coll.on("collect", async (reaction, user) => {
                if(reaction._emoji.name === "✅"){
                    done = true;
                    if (questions.length == 0) {
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(":warning: Error")
                            .setDescription("**No questions were set.**")
                        m.reactions.removeAll();
                        questions = [];
                        question = "";
                        return message.channel.send(embed);
                    }else {
                        database.newQuestions(questions);
                        collector.stop("Done");
                        const embed = new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("📝 Application Setup!")
                            .setDescription(`**__Questions:__**` + "```" +  question + "```")
                        m.reactions.removeAll();
                        questions = [];
                        question = "";
                        return m.edit(embed)
                    }
                }
                if(reaction._emoji.name === "❌"){
                    done = true;
                    cancel = true;
                    collector.stop("Done");
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setDescription("**:x: Application setup was cancelled.**")
                    m.reactions.removeAll();
                    questions = [];
                    question = "";
                    return m.edit(embed)
                }
            });

            coll.on("end", (collected, reason) => {
                if(reason === "done"){
                    done = true
                    return;
                }else {
                    questions = [];
                    question = "";
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setDescription("**:x: Application setup was cancelled due to no response in the last 10 minutes**")
                    return message.channel.send(embed);
                }
            });

            description += "\n__**Questions:**__\n"

            collector.on("collect", (msg) => {
                if(!done){
                    questions.push({
                        id: questions.length + 1,
                        question: msg.content,
                    });
    
                    question += `${questions.length}. ${msg.content}\n`
                    description += `**${questions.length}.** ${msg.content}\n`
    
                    msg.delete();
                        
                    const setup = new MessageEmbed()
                        .setColor("BLUE")
                        .setTitle("Questions")
                        .setDescription(description)
                    m.edit(setup);
                    collector.resetTimer({ time: 60000 });
                }else {
                    return;
                }
            });

            collector.on("end", (collected, reason) => {
                if(!done && !cancel){
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setDescription("**:x: Appsetup was cancelled due to no response in the last 60 seconds.**")
                    return message.channel.send(embed);
                }
            });
        }
	}
}