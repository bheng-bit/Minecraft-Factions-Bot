const { MessageEmbed } = require('discord.js');
const math = require("mathjs");

module.exports = {
	name: "calc",
	description: "Shows calculated answers of user's query.",
	usage: "<operation>",
    aliases: ["calculate", "calculator"],
	category: "fun",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		
		let result;
		try {
			result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[รท]/gi, "/"));
		} catch(e) {
			return message.channel.send("**Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
		}
		let embed = new MessageEmbed()
            .setColor("BLUE").setAuthor(`${client.user.username} Calculator`, client.user.displayAvatarURL({ dynamic: true}))
            .addField("**Operation**", `\`\`\`Js\n${args
            .join("")
            .replace(/[x]/gi, "*")
            .replace(/[,]/g, ".")
            .replace(/[รท]/gi, "/")}\`\`\``)
            .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(`Requested by ${message.member.displayName}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
		return message.channel.send(embed);
	}
}