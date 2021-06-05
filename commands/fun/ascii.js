const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const figlet = require('figlet');

module.exports = {
	name: "ascii",
	description: "Transfers text to ascii font.",
	usage: "<text>",
	category: "fun",
	args: true,
	async run(client, message, args, bot, chatData, saving, database) {
		
		let msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                const err = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Something went wrong check my perms and try again!**`)
                return message.channel.send(err);
            }
            if(data.length > 2000){
                const err = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`**Please provide text shorter than 2000 characters.**`)
                return message.channel.send(err);
            }
            return message.channel.send('```' + data + '```');
        })
	}
}