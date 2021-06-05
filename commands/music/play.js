const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "play",
	description: "Play a music song in a voice channel.",
	category: "music",
	usage: "<song>",
    aliases: ["p"],
    args: true,
	async run(client, message, args, bot, chatData, saving, database) {

        const string = args.join(" ");
        try {
            client.distube.play(message, string)
        } catch (e) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`\`\`\`${e}\`\`\``)
            return message.channel.send(error)
        }
	}
}