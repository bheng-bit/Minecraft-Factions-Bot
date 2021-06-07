const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "snipe",
	description: "Snipes last deleted message.",
    aliases: ["deleted"],
    category: "general",
	usage: '',
	args: false,
	async run(client, message, args, bot, database, chatData, saving) {
		const msg = client.snipes.get(message.channel.id)
        
        if(!msg){
            const embedn = new MessageEmbed()
                .setTitle("Snipe Command")
                .setColor("BLUE")
                .setDescription(`${message.author} **There are no deleted messages.**`)
                .setTimestamp();
            return message.channel.send(embedn)
        }else if(msg.content){
            const snipe = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Snipe Command")
                .addField('Content of the message :', "```" + msg.content + "```")
                .setFooter(" Requested by " + message.author.tag , message.author.avatarURL({dynamic: true}))
                .setTimestamp()
            
            if(msg.image){
                snipe.setImage(msg.image)
                snipe.setDescription(`**Content of the message:**`)
            }
            return message.channel.send(snipe)
        }
	}
}