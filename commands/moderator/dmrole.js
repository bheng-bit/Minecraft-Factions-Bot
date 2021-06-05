const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: "dmrole",
    description: "Dm everyone with a certain role.",
    usage: '<@role> <message>',
    category: "moderator",
    args: true,
    permissions: ["ADMINISTRATOR"],
    async run(client, message, args, bot, chatData, saving, database) {

        let dmrole = message.guild.roles.cache.find((r) => r.name == args[0]) || message.guild.roles.cache.find((r) => r.id == args[0]) || message.mentions.roles.first();
        const msg = args.slice(1).join(' ');
        
        if(!dmrole || !msg){
            const missingargs = new MessageEmbed()
				.setColor("RED")
				.setTitle(":warning: Incorrect Usage")
				.setDescription(`**Name:** \`${this.name}\`\n**Description:** \`${this.description}\`\n**Usage:** \`${config.discord.prefix}${this.name} ${this.usage}\``)
				.setFooter("<> = required and [] = optional")
			return message.channel.send(missingargs)
        }else {
            let members = message.guild.roles.cache.get(dmrole.id).members.array().filter(m => !m.user.bot);
            let send = 0;

            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`__**DM Announcement from ${message.author.username}**__`)
                .setDescription(`\`\`\`${msg}\`\`\`\n\n**Sent At: **${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}\n**Sent By:** ${message.author}\n**Sent From:** ${message.guild.name} (${dmrole.name} role)`)

            await members.forEach(member => {
                try {
                    send++;
                    member.send(embed).catch(err => {})
                } catch (error) {
                    throw(error)
                }
                
            });
            const succes = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`:white_check_mark: **Succesfully send DM to \`${send} members\` with the ${dmrole}role**`)
            return message.channel.send(succes)
        }
    }
}