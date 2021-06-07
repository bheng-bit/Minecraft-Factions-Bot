const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "resetchannels",
    description: "Reset all the channels.",
    category: "owner",
    args: false,
    permissions: ["MANAGE_GUILD"],
    async run(client, message, args, bot, chatData, saving, database) {
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**React with ✅ to reset the channels.**`)
        let confirm = await message.channel.send(embed);
        confirm.react("✅")

        const collector = confirm.createReactionCollector(
            (r, u) => r.emoji.name === "✅" && u.id === message.author.id, {
                time: 15000
        });

        let reset;

        collector.on('collect', async () => {
            confirm.reactions.removeAll();
            await database.resetChannels();
            reset = true;
            const succes = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅** Succesfully reset the channels.**`)
            return message.channel.send(succes)
            
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