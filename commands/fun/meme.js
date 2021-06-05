const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: "meme",
	description: "Sends a random reddit meme.",
    category: "fun",
	args: false,
	async run(client, message, args, bot, chatData, saving, database) {
		const Reds = [
            "memes",
            "dankmemes",
            "comedyheaven",
            "Animemes"
        ];
        const Rads = Reds[Math.floor(Math.random() * Reds.length)];

        const res = await fetch(`https://www.reddit.com/r/${Rads}/random/.json`);

        const json = await res.json();

        if (!json[0]) return message.channel.send(`Your Life Lmfao`);

        const data = json[0].data.children[0].data;

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setURL(`https://reddit.com${data.permalink}`)
            .setTitle(data.title)
            .setImage(data.url)
            .setFooter(`${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬`)
            .setTimestamp();

        return message.channel.send(embed);
	}
}