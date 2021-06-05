const discord = require('discord.js');
const config = require('../../config.json');
const prettyMilliseconds = require("pretty-ms");
var os = require('os');

module.exports = {
    name: "botinfo",
    description: "Displays bot information.",
    category: "general",
    args: false,
    async run(client, message, args, bot, chatData, saving, database) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.avatarURL())
        .setTitle("Discord Bot Information")
        .setFooter("Bot made by Youniz#0001")
        .setDescription(`
**Prefix:** \`${config.discord.prefix}\`

__**Host Information**__
**Uptime:** \`${prettyMilliseconds(client.uptime, {verbose: true})}\`
**Bot ping** \`${client.ws.ping} ms\`
**Arch:** \`${os.arch()}\`
**Platform:** \`${os.platform()}\`
**CPU:** \`${os.cpus().map(i => `${i.model}`)[0]}\`
**Memory usage:** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(
            os.totalmem() /
            1024 /
            1024
        ).toFixed(2)} MB\`
        
__**Versions**__ 
**Bot version:** \`1.0.0\`
**Discord.js version:** \`${discord.version}\`
**Node.js Version:** \`${process.version}\`

__**Support**__
**Developer:** \`Youniz#0001\`
**Credits:** \`Brashive & Hadan\`

**Current User:** ${client.user}`)
        return message.channel.send(embed);    
    }
}