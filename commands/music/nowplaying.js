const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "nowplaying",
	description: "Displays the song that is currently playing.",
	category: "music",
    aliases: ["np"],
    args: false,
	async run(client, message, args, bot, chatData, saving, database) {

        const queue = client.distube.getQueue(message);
        if (!queue){
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**There is nothing in the queue right now!**`)
            return message.channel.send(embed)
        }

        const q = queue.songs.map((song, i) => `${i === 0 ? "**Playing:**" : `**${i}.**`} \`${song.name}\` **-** \`${song.formattedDuration}\``).join("\n")

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(":notes: Now Playing")
            .setDescription(q)
        return message.channel.send(embed);

	}
}