const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "reset",
    description: "Reset everything for new map/season.",
    category: "owner",
    args: false,
    permissions: ["MANAGE_GUILD"],
    async run(client, message, args, bot, chatData, saving, database) {
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**React with ✅ to reset the database.**`)
        let confirm = await message.channel.send(embed);
        confirm.react("✅")

        const collector = confirm.createReactionCollector(
            (r, u) => r.emoji.name === "✅" && u.id === message.author.id, {
                time: 15000
        });

        let reset;

        collector.on('collect', async () => {
            confirm.reactions.removeAll();
            await database.resetDatabase();
            reset = true;
            const succes = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅** Succesfully reset the database.**`)
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