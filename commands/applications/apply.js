const { MessageEmbed } = require('discord.js');
const runningApp = new Set();

module.exports = {
	name: "apply",
	description: "Start a application process.",
    aliases: ["appstart"],
    category: "applications",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
        const applychannel = client.channels.cache.find((channel) => channel.id === database.getChannelID("c_application"));
        const applogchannel = client.channels.cache.find((channel) => channel.id === database.getChannelID("c_applicationLog"));
        

        if(!applychannel || !applogchannel){
            const error = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Error")
				.setDescription(`**Application channels have not been setup yet!**`)
			return message.channel.send(error)
        }else {
            if (!database.areQuestionsSet()) {
                const embed = new MessageEmbed()
                    .setTitle(":warning: Error")
                    .setColor("RED")
                    .setDescription(`**No questions were found.**`)
                return message.channel.send(embed);
            }else {
                if(!database.getBoolean("b_applications")){
                    const embed = new MessageEmbed()
                        .setTitle(":warning: Error")
                        .setColor("RED")
                        .setDescription(`**Applications are currently closed!**`)
                    return message.channel.send(embed);
                }else {
                    if(message.channel.id != applychannel.id){
                        const embed = new MessageEmbed()
                            .setTitle(":warning: Error")
                            .setColor("RED")
                            .setDescription(`**Use this command in ${applychannel}**`)
                        return message.channel.send(embed);
                    }
                    if (database.findApplicant(message.author.id) != undefined) {
                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`**:x: You have already applied, please wait for a respond before you apply again!**`)
                        return message.channel.send(embed);
                    }else {
                        if (runningApp.has(message.author.id)) {
                            const embed = new MessageEmbed()
                                .setTitle(":warning: Error")
                                .setColor("RED")
                                .setDescription(`**You already have an application running.**`)
                            return message.channel.send(embed);
                        }else {
                            
                            let answers = [];
                            let qCount = 0;
                            let nCount = 0;

                            let worked = true;
                            let applied = false;
                            let cancelled = false;

                            let description = "You have **__10__** minutes to apply\n";
                                description += "Please start answering each question\n";
                                description +=
                                  "**Example**: ```Question: What is your age?\nAnswer: 17```\n";
                                description +=
                                  "If you want to cancel the process at anytime type `cancel`\n";

                            const apply =  new MessageEmbed()
                                .setTitle("📌 Application Process Started")
                                .setDescription(description)
                                .setColor("BLUE")

                            await message.author.send(apply).catch(() => {
                                worked = false;
                                const embed = new MessageEmbed()
                                    .setTitle(":warning: Error")
                                    .setColor("RED")
                                    .setDescription(`${message.author} **Make sure you have your DMs open!**`)
                                return message.channel.send(embed);
                            })

                            if(worked){
                                const embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`**:white_check_mark: Application started in DMs.**`)
                            message.channel.send(embed);

                            let questionArray = database.getQuestions();

                            question = "**Question " + ++nCount +" :**\n```" +questionArray[qCount].question +"```\n";
                            apply.setDescription(question).setTitle("");
                            message.author.send(apply).then((b) => {
                                const filter = (m) => m.author.id === message.author.id;
                                const collector = b.channel.createMessageCollector(filter, {
                                time: 600000,
                                idle: 600000,
                                });

                                collector.on("collect", (msg) => {
                                    if (msg.content.toLowerCase().includes("cancel")) {
                                      collector.stop("Cancel");
                                      return;
                                    } else {
                                      answers.push(msg.content);
                                      if (questionArray[++qCount] != undefined) {
                                        question = "**Question " + nCount + "**: \n```" + `${questionArray[qCount].question}` + "```";
                                        apply.setDescription(question)
                                      } else {
                                        collector.stop("Done");
                                        return;
                                      }
                                    }
                                    apply.setTitle("")
                                    b.channel.send(apply);
                                    collector.resetTimer({ idle: 600000 });
                                });

                                collector.on("end", (collected, reason) => {
                                    if (reason == "Cancel") {
                                        cancelled = true;
                                        answers = [];
                                        runningApp.delete(message.author.id)
                                        const embed = new MessageEmbed()
                                            .setColor("RED")
                                            .setDescription(`**:x: Application process was cancelled.**`)
                                        return message.author.send(embed);
                                    } else if (reason == "Done") {
                                        const embed = new MessageEmbed()
                                            .setTitle("Sumbit Application")
                                            .setDescription("Are you sure you want to apply?")
                                            .setColor("BLUE");
                                        b.channel.send(embed).then(async(a) => {
                                            await a.react("✅")
                                            await a.react("❌");

                                            let coll = a.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 60000 });

                                            coll.on("collect", async(reaction, user) => {
                                                if(reaction._emoji.name === "✅"){
                                                    if(cancelled) return;
                                                    applied = true;
                                                    const newApp = new MessageEmbed()
                                                        .setColor("BLUE")
                                                        .setTitle("New Application")
                                                        .setThumbnail(message.member.user.displayAvatarURL({dynamic: true}))

                                                    let questionAnswer = "**User:** \`" + message.author.tag + "\`\n**ID:** \`" + message.author.id+ "\`\n"

                                                    const dateOptions = {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    };

                                                    questionAnswer += "**Date Applied: ** \`" + new Date().toLocaleDateString("en-US", dateOptions) + "\`\n\n";

                                                    for (var i = 0; i < answers.length; i++) {
                                                        questionAnswer += `**${questionArray[i].question}**`+ "```" +answers[i] + "```\n";
                                                    }
                                                    newApp.setDescription(questionAnswer);
                                                    ;

                                                    let msg = await applogchannel.send(newApp)
                                                    await database.addApplicant(message.author.id, msg.id)

                                                    await msg.react("✅");
                                                    await msg.react("❌");
                                                    
                                                    const succes = new MessageEmbed()
                                                        .setColor("GREEN")
                                                        .setDescription(":white_check_mark: **Application was submitted.**")
                                                    return a.edit(succes);
                                                }
                                                if(reaction._emoji.name === "❌"){
                                                    cancelled = true;
                                                    if(applied) return;
                                                    answers = []; 
                                                    runningApp.delete(message.author.id)
                                                    const embed = new MessageEmbed()
                                                        .setColor("RED")
                                                        .setDescription(":x: **Application process was cancelled.**")
                                                    return a.edit(embed);
                                                }
                                            })
                                      })
                                    }else {
                                        runningApp.delete(message.author.id)
                                        const embed = new MessageEmbed()
                                            .setColor("RED")
                                            .setTitle(":warning: Error")
                                            .setDescription("**Application was cancelled due to no response in the last 60 seconds.**")
                                        b.channel.send(embed);
                                    }
                                })
                            })
                            }     
                        }
                    }
                }
            }
        }
	}
}