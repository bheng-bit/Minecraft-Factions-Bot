const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "test",
    description: "test command.",
    category: "owner",
    args: false,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {
        
    client.emit('guildMemberAdd', message.member)
    client.emit('guildMemberRemove', message.member)

    }
}