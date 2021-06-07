const discord = require('discord.js');
const client = new discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const config = require('./config.json');
const chalk = require('chalk');
const fs = require('fs');
const disTube = require("distube");
client.distube = new disTube(client, {
    searchSongs: false,
    emitNewSongOnly: true,
    leaveOnFinish: true
});
const mineflayer = require('mineflayer');
const tpsPlugin = require('mineflayer-tps')(mineflayer);
const database = require('./utils/database');
const util = require("./utils/functions");
const functions = util.options;
const EasyMatch = require(`@notlegend/easymatch`);
let matcher = new EasyMatch(`[`, `]`);

let bot;
let tries = 0;


let serverChat = [];
let chatData = [];

let saving = {
    saving: false,
    ftopsearch: false,
    flistsearch: false,
    fwhosearch: false,
};
const timeFormat = {
    months: 2592000,
    weeks: 604800,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1,
};


client.commands = new discord.Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

if (!database.isInitalized) {
    database.createDatabase();
} else {
    database.resetTempUsers();
}



/*
 * 
 * 
 * Discord Bot
 * 
 * 
 */
setTimeout(() => {
    startBot();
}, 2000);

client.on("ready", async () => {
    await console.clear()
    await console.log(chalk.redBright("\n ███████╗ █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗    ██████╗  ██████╗ ████████╗\n ██╔════╝██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝    ██╔══██╗██╔═══██╗╚══██╔══╝\n █████╗  ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗    ██████╔╝██║   ██║   ██║   \n ██╔══╝  ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║    ██╔══██╗██║   ██║   ██║   \n ██║     ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║    ██████╔╝╚██████╔╝   ██║   \n ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝"));

    await console.log(chalk.whiteBright(`                                        Version - 1.0.1`));
    await console.log(chalk.whiteBright(`                                      Developer - Youniz\n\n`));

    await console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Discord bot: ${chalk.blueBright(client.user.username)} is ready!`));
    await console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Discord bot: Loaded ${chalk.blueBright(`${client.commands.size} commands`)}`));

    client.user.setActivity({
        name: config.minecraft.serverIP,
        type: "PLAYING",
    });
})

client.on("message", async message => {

    if (!message.guild) return;
    if (message.author.bot || !message.content.startsWith(config.discord.prefix)) return;
    const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!cmd) return;

    if (cmd.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(cmd.permissions)) {
            const noperms = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: No Permission")
                .setDescription(`**You must have \`${cmd.permissions}\` permission to use this command.**`)
            return message.channel.send(noperms);
        }
    }
    if (cmd.category === "music") {
        if (!message.member.voice.channel) {
            const embed = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**You must be in a \`Voice\` channel to use this command!**`)
            return message.channel.send(embed);
        }
    }
    if (cmd.category === "nsfw") {
        if (!message.channel.nsfw) {
            const embed = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Error")
                .setDescription(`**You must be in a \`NSFW\` channel to use this command!**`)
            return message.channel.send(embed);
        }
    }

    if (cmd.args) {
        if (!args[0]) {
            const missingargs = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle(":warning: Incorrect Usage")
                .setDescription(`**Name:** \`${commandName}\`\n**Description:** \`${cmd.description}\`\n**Aliases:** \`${cmd.aliases || "None"}\`\n**Usage:** \`${config.discord.prefix}${commandName} ${cmd.usage || ""}\`\n**Permission:** \`${cmd.permissions || "None"}\``)
                .setFooter("<> = required and [] = optional")
            return message.channel.send(missingargs)
        }
    }

    cmd.run(client, message, args, bot, chatData, saving, database);

});

client.on("messageReactionAdd", async (reaction, user) => {

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    let message = reaction.message;
    if (!message) return;
    if (!message.guild) return;
    const member = await message.guild.members.fetch(user.id)
    if (user.bot) return;

    const applogchannel = client.channels.cache.find((channel) => channel.id === database.getChannelID("c_applicationLog"));
    if (!applogchannel) return;

    if (message.channel.id === applogchannel.id) {
        if (database.findApplicantMsg(message.id)) {
            let user = database.findApplicantM(message.id);
            if (!user) return;
            let member = message.guild.members.cache.get(user.discordID);
            if (reaction.emoji.name === "✅") {
                database.removeApplicant(member.id)

                const succes = new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`:white_check_mark: ${member}**'s application has been accepted!**`)
                message.channel.send(succes);

                const embed = new discord.MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(":tada: You Have Been Accepted!")
                    .setDescription("**Make sure to contact a recruiter for your roles/interview!**")
                member.send(embed).catch((err) => {})
            }
            if (reaction.emoji.name === "❌") {
                database.removeApplicant(member.id)
                const succes = new discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription(`${member}**'s application has been denied!**`)
                message.channel.send(succes);

                const embed = new discord.MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(":cry: You Have Been Rejected!")
                    .setDescription("**Feel free to reapply in a week!**")
                member.send(embed).catch((err) => {})
            }
        }
    }
})

client.on("messageDelete", async (message) => {
	if (!message.channel.type === "dm") return;
	if (!message.author) return;
    if(message.author.bot) return;
  	client.snipes.set(message.channel.id,{
    	content: message.content,
    	author: message.author.tag,
    	authorimg: message.author.avatarURL({dynamic: true}),
    	image: message.attachments.first() ? message.attachments.first().proxyURL : null,
    	channelname: message.channel.name,
    	messageid: message.id,
    	channelid: message.channel.id
	});
});

client.login(config.discord.botToken).catch((err) => {
    console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Error: Invalid Bot Token`));
    process.exit()
});

/*
 * 
 * 
 * Music Bot
 * 
 * 
 */
client.distube.on("playSong", (message, queue, song) => {
    if (song.user == client.user) {
        const embed = new discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle(":notes: Auto Play")
            .setDescription(`**Song:** \`${song.name}\` **-** \`${song.formattedDuration}\``)
        return message.channel.send(embed);
    } else if (song.user) {
        const embed = new discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle(":notes: Playing")
            .setDescription(`**Song:** \`${song.name}\` **-** \`${song.formattedDuration}\`\n**Requested by:** ${song.user}`)
        return message.channel.send(embed);
    } 
});
client.distube.on("addSong", (message, queue, song) => {
    const embed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(":notes: Song Added")
        .setDescription(`:white_check_mark: **Song:** \`${song.name}\` **-** \`${song.formattedDuration}\`\n**Added to the queue by** ${song.user}`)
    return message.channel.send(embed);
});
client.distube.on("playList", (message, queue, playlist, song) => {
    const embed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(":notes: Playing Playlist")
        .setDescription(`:white_check_mark: **Playlist:** \`${playlist.title} (${playlist.total_items} songs)\`\n**Requested by:** ${song.user}\n**Now playing:** \`${song.name}\` **-** \`${song.formattedDuration}\``)
    return message.channel.send(embed);
});
client.distube.on("addList", (message, queue, playlist) => {

    const embed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(":notes: Added Playlist")
        .setDescription(`:white_check_mark: **Playlist:** \`${playlist.title} (${playlist.total_items} songs)\`\n**Added to the queue by** ${song.user}`)
    return message.channel.send(embed);
});

client.distube.on("error", (message, err) => {
    return message.channel.send(`:x: **An error encountered:** ${err}`);
});

client.distube.filters = {
    "clear": "dynaudnorm=f=200",
    "bassboost": "bass=g=20,dynaudnorm=f=200",
    "8D": "apulsator=hz=0.08",
    "vaporwave": "aresample=48000,asetrate=48000*0.8",
    "nightcore": "aresample=48000,asetrate=48000*1.25",
    "phaser": "aphaser=in_gain=0.4",
    "tremolo": "tremolo",
    "vibrato": "vibrato=f=6.5",
    "reverse": "areverse",
    "treble": "treble=g=5",
    "normalizer": "dynaudnorm=f=200",
    "surrounding": "surround",
    "pulsator": "apulsator=hz=1",
    "subboost": "asubboost",
    "karaoke": "stereotools=mlev=0.03",
    "flanger": "flanger",
    "gate": "agate",
    "haas": "haas",
    "mcompand": "mcompand"
}

/*
 * 
 * 
 * Minecraft Bot
 * 
 * 
 */


async function startBot(time) {
    if (!config.minecraft.username) return;
    if (!config.minecraft.password) return;
    setTimeout(() => {
        if (tries > 3) {
            return console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}] Error:`)}I nvalid minecraft username/password.`));
        }
        bot = mineflayer.createBot({
            username: config.minecraft.username,
            password: config.minecraft.password,
            host: config.minecraft.serverIP,
            version: config.minecraft.version,
            plugins: {
                physics: false,
            }
        });
        bot.loadPlugin(tpsPlugin);
        bot.on("login", async () => {
            tries++;
            bot.settings.viewDistance = "tiny";
            bot.settings.colorsEnabled = false;

            await console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Minecraft bot: ${chalk.blueBright(bot.username)} has connected to ${chalk.blueBright(config.minecraft.serverIP)}`));

            setTimeout(() => {
                bot.chat(config.minecraft.joinCMD);
            }, 4000);
            setTimeout(() => {
                bot.chat("/f c f")
            }, 10000)

        });

        bot.on("kicked", async () => {
            await console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Minecraft bot: ${chalk.blueBright(bot.username)} was kicked from the server.`));
            await console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Minecraft bot: Attempting to relog now.`));
            tries++;
            startBot(10000);

            return;
        });

        bot.on("end", async () => {
            tries++;
            startBot(10000);
        })
        bot.on("error", async () => {
            console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Minecraft bot: Couldn't relog now.`));
            return
            tries++;
        })

        bot.on("message", async (message) => {
            const chat = `${message}`;
            //console.log(message.toAnsi());

            if (database.getBoolean("b_serverChat")) {
                const serverChatChannel = client.channels.cache.get(database.getChannelID("c_serverchat"));
                if (serverChatChannel) {
                    serverChat.push(chat);
                    setInterval(() => {
                        if (serverChatChannel === undefined) return;
                        if (serverChat.length === 0) return;
                        serverChatChannel.send(`\`\`\`${serverChat.join('\n')}\`\`\``)
                        serverChat = [];
                    }, 3000);
                }
            }

            if (saving.ftopsearch === true) {
                chatData.push(chat);
            };
            if (saving.flistsearch === true) {
                chatData.push(chat);
            };
            if (saving.fwhosearch === true) {
                chatData.push(chat);
            };
            if (saving.saving === true) {
                chatData.push(chat);
            };

            let split = chat.split(/ +/g);
            let usernames = [];
            let user;

            for (let i in bot.players) {
                usernames.push(i)
            }

            for (let i = 0; i < split.length; i++) {
                if (usernames.includes(split[i].replace(/[:<>()+*✯-]+/g, ""))) {
                    user = split[i].replace(/[:<>()+*✯-]+/g, "")
                    userarg = i
                    split[i] = split[i].replace(/[:<>()+*✯-]+/g, "")
                    break;
                }
            }
            if (user) {
                if (database.isUserVerified(user)) {
                    if (chat.includes(config.discord.prefix)) {
                        let cmdMsg

                        for (let i = split.indexOf(user); i < split.length; i++) {
                            if (split[i].startsWith(config.discord.prefix)) {
                                cmdMsg = split.slice(i--)
                                break;
                            }
                        }
                        if (cmdMsg) {
                            let args = cmdMsg
                            let cmd = args[0].slice(config.discord.prefix.length).toLowerCase()
                            args = args.slice(1)
                            if (!cmd) return

                            if (cmd === "tps") {
                                return bot.chat(`Server TPS is currently : ${bot.getTps()}`)
                            }
                            if (cmd === "8ball") {
                                let question = args.join(" ");
                                if (!question) {
                                    return bot.chat(`You forgot to add a question!`)
                                } else {
                                    let answers = [
                                        "It is certain.",
                                        "It is decidedly so.",
                                        "Without a doubt.",
                                        "Yes - definitely.",
                                        "You may rely on it.",
                                        "As I see it, yes.",
                                        "Most likely.",
                                        "Outlook good.",
                                        "Yes.",
                                        "Signs point to yes.",
                                        "Reply hazy, try again.",
                                        "Ask again later.",
                                        "Better not tell you now.",
                                        "Cannot predict now.",
                                        "Concentrate and ask again.",
                                        "Don't count on it.",
                                        "My reply is no.",
                                        "My sources say no.",
                                        "Outlook not so good.",
                                        "Very doubtful."
                                    ]
                                    let answer = answers[Math.floor(Math.random() * answers.length)];

                                    return bot.chat(answer);
                                }
                            }
                            if (cmd === "checked") {
                                const wallcheckchannel = client.channels.cache.find(
                                    (channel) => channel.id === database.getChannelID("c_wallChecks")
                                );

                                if (!wallcheckchannel) {
                                    return bot.chat(`[Bot] Wall checks channel is not setup on discord!`);
                                }
                                if (database.getBoolean("b_shield")) {
                                    return bot.chat(`[Bot] Shield is currently enabled!`);
                                }

                                let today = new Date();
                                let currentTime = today.getTime();

                                let userWallObject = database.getUserObject(user);

                                const embed = new discord.MessageEmbed()
                                    .setColor("GREEN")
                                    .setTitle("✅ Wall Check")
                                    .setThumbnail(`https://crafatar.com/avatars/` + bot.players[user].uuid)

                                userWallObject = userWallObject.get("userWallChecks");

                                const timeDifference = functions.getDifference(
                                    userWallObject.value().lastWallChecked,
                                    currentTime
                                );
                                if (timeDifference.minutes >= 1) {
                                    database.updateWallChecked(userWallObject, currentTime);
                                    bot.chat("/f c f")
                                    bot.chat("[Bot] Walls Checked by " + user + ", who has total " + userWallObject.get("wallChecks").value() + " wall checks.");
                                    embed.addField("Walls have been checked by:", `\`${user}\``)
                                    embed.addField("Total Checks:", `\`${userWallObject.get("wallChecks").value()}\``)
                                    return wallcheckchannel.send(embed);
                                } else {
                                    let coolDown = Math.abs(60 - timeDifference.seconds);

                                    const cooldown = new discord.MessageEmbed()
                                        .setTitle("⏳ Cooldown")
                                        .setColor("ORANGE")
                                        .setDescription(`\`${user}\`` + " you are in a **" + coolDown.toFixed(2) + "** seconds cooldown.")
                                    bot.chat("[Bot] " + user + " you are in a " + coolDown.toFixed(2) + " seconds cooldown.");
                                    return wallcheckchannel.send(cooldown);
                                }
                            }
                            if (cmd === "bchecked") {
                                const buffercheckchannel = client.channels.cache.find(
                                    (channel) => channel.id === database.getChannelID("c_bufferChecks")
                                );

                                if (!buffercheckchannel) {
                                    return bot.chat(`[Bot] Buffer checks channel is not setup on discord!`)
                                }
                                if (database.getBoolean("b_shield")) {
                                    return bot.chat(`[Bot] Shield is currently enabled!`);
                                }
                                let today = new Date();
                                let currentTime = today.getTime();

                                let userWallObject = database.getUserObject(user);

                                const embed = new discord.MessageEmbed()
                                    .setColor("GREEN")
                                    .setTitle("✅ Buffer Check")
                                    .setThumbnail(`https://crafatar.com/avatars/` + bot.players[user].uuid)

                                userWallObject = userWallObject.get("userWallChecks");

                                const timeDifference = functions.getDifference(
                                    userWallObject.value().lastBufferChecked,
                                    currentTime
                                );

                                if (timeDifference.minutes >= 1) {
                                    database.updateBufferChecked(userWallObject, currentTime);
                                    bot.chat("/f c f")
                                    bot.chat("[Bot] Buffers Checked by " + user + ", who has total " + userWallObject.get("bufferChecks").value() + " buffer checks.");
                                    embed.addField("Buffers have been checked by:", `\`${user}\``)
                                    embed.addField("Total Checks:", `\`${userWallObject.get("bufferChecks").value()}\``)
                                    return buffercheckchannel.send(embed);
                                } else {
                                    let coolDown = Math.abs(60 - timeDifference.seconds);

                                    const cooldown = new discord.MessageEmbed()
                                        .setTitle("⏳ Cooldown")
                                        .setColor("ORANGE")
                                        .setDescription(`\`${user}\`` + " you are in a **" + coolDown.toFixed(2) + "** seconds cooldown.")
                                    bot.chat("[Bot] " + user + " you are in a " + coolDown.toFixed(2) + " seconds cooldown.");
                                    return buffercheckchannel.send(cooldown);
                                }
                            }
                            if (cmd === "weewoo") {
                                const weewoochannel = client.channels.cache.find(
                                    (channel) => channel.id === database.getChannelID("c_weewoo")
                                );

                                if (!weewoochannel) {
                                    return bot.chat(`[Bot] WeeWoo channel is not setup on discord!`);
                                }
                                if (database.getBoolean("b_shield")) {
                                    return bot.chat(`[Bot] Shield is currently enabled!`);
                                }
                                const embed = new discord.MessageEmbed()
                                    .setColor("RED")
                                    .setThumbnail("https://i.imgur.com/oAJOKSy.jpg")
                                    .setTitle("We are getting raided!")
                                    .addField("Triggered by", `\`${user}\``, true)
                                    .setFooter(config.minecraft.serverIP)
                                weewoochannel.send(embed)

                                for (i = 0; i < 5; i++) {
                                    bot.chat(`[Bot] WEEWOO We are getting raided!! x${i}`)
                                    weewoochannel.send("@everyone")
                                    weewoochannel.send(embed)
                                }
                            }
                            if (cmd === "play") {
                                console.log(chat)
                                console.log(args.join(" "))
                                client.distube.play(chat, args.join(" "));
                            }
                        }
                    }
                }
                if (database.isTempUser(user)) {
                    let args = chat.split(" ");

                    let code;
                    for (let i = 0; i < args.length; i++) {
                        if (database.isGoodCode(args[i])) {
                            code = args[i];
                        }
                    }
                    let player = database.getDiscordTempUser(user)
                    if (player == undefined) return;
                    database.addUser(user, player.discordID)
                    database.removeTempCode(code);
                    try {
                        bot.chat("/msg " + user + " You have been verified! You can now use ingame commands!");
                        const channel = client.channels.cache.get(database.getChannelID("c_iam"))
                        const embed = new discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`:white_check_mark: <@${player.discordID}> **is now linked to the bot! With the ign \`${user}\`**`)
                        return channel.send(embed)
                    } catch (error) {
                        const channel = client.channels.cache.get(database.getChannelID("c_iam"))
                        const embed = new discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`:white_check_mark: <@${player.discordID}> **is now linked to the bot! With the ign \`${user}\`**`)
                        return channel.send(embed)
                    }
                }
            }
            return;
        });
    }, time);
}

setTimeout(() => {
    if (database.getBoolean("b_autoHubCmd")) {
        if (bot == null) return;
        bot.chat(config.minecraft.joinCMD);
    }
}, database.getTime("t_autoHubCmd") * 60000)

setTimeout(() => {
    if (database.getBoolean("b_autoFtop")) {
        const ftopchannel = client.channels.cache.get(database.getChannelID("c_ftop"));
        if (!ftopchannel) return;
        saving.ftopsearch = true;
        bot.chat(config.minecraft.ftopCMD);
        let currentFtop = [];
        let facName = "";
        let value = "";
        let change = "";

        setTimeout(() => {
            saving.ftopsearch = false;
            if (!chatData.length) {
                chatData[0] = "Error while trying to fetch ftop data!";
                const error = new discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: Error")
                    .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
                chatData.length = 0
                ftopchannel.send(error);
            } else {
                chatData.forEach(eachLine => {
                    let ftopmsg = database.getLayout("l_ftop");
                    let matchResult = matcher.match(eachLine, ftopmsg);

                    let data = [];
                    let ftop = false
                    for (let i in matchResult) {
                        if (matchResult[i] !== null) {
                            data.push(matchResult[i])
                            ftop = true
                        }
                    }

                    if (ftop) {
                        facName += "**" + data[0] + ".** " + data[1] + "\n";
                        value += "$" + data[2] + "\n";

                        let val = data[2].toLocaleString().split(",").join("")

                        currentFtop.push({
                            factionName: data[1],
                            value: val,
                        });
                        let facObj = database.findFaction(data[1]);
                        if (facObj.value() != undefined) {
                            let tempChange =
                                currentFtop.find((faction) => faction.factionName == data[1])
                                .value - facObj.get("value").value();
                            if (tempChange >= 0) {
                                tempChange = tempChange.toLocaleString();
                                change += "+$" + tempChange + "\n";
                            } else {
                                tempChange = Math.abs(tempChange);
                                tempChange = tempChange.toLocaleString();
                                change += "-$" + tempChange + "\n";
                            }
                        } else {
                            change += "N/A\n";
                        }
                    }
                    data.length = 0;
                });
                if (!facName.length || !value.length || !change.length) {
                    const error = new discord.MessageEmbed()
                        .setColor("BLUE")
                        .setTitle("Factions Top")
                        .setDescription(`\`\`\`${chatData.join('\n')}\`\`\``)
                    chatData.length = 0
                    ftopchannel.send(error);
                }
                database.pushFtop(currentFtop);

                chatData.length = 0;
                const embed = new discord.MessageEmbed()
                    .setTitle("Factions Top")
                    .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
                    .setColor("BLUE")
                    .setFooter(config.minecraft.serverIP)
                    .addField("Factions", facName, true)
                    .addField("Value", value, true)
                    .addField("Change", change, true)
                return ftopchannel.send(embed);
            }
        }, 250);
    }
}, database.getTime("t_autoFtop") * 60000);

setTimeout(() => {
    if (database.getBoolean("b_autoFlist")) {

        const flistchannel = client.channels.cache.get(database.getChannelID("c_flist"));
        if (!flistchannel) return;
        let facName = "";
        let value = "";

        bot.chat("/f list");
        setTimeout(() => {
            saving.flistsearch = false;
            chatData.forEach(eachLine => {
                let flistmsg = database.getLayout("l_flist");
                let matchResult = matcher.match(eachLine, flistmsg);

                let flist = false;
                for (let i in matchResult) {
                    if (matchResult[i] !== null) {
                        flist = true
                    }
                }
                if (flist) {
                    facName += matchResult.Faction + "\n";
                    value += `${matchResult.Online} / ${matchResult.Max}` + "\n";
                } else {
                    return;
                }
            });
            if (!facName.length || !value.length) {
                const embed = new discord.MessageEmbed()
                    .setTitle("Factions List")
                    .setColor("BLUE")
                    .setDescription("```" + chatData.join("\n") + "```")
                    .setFooter(config.minecraft.serverIP)
                chatData.length = 0;
                return flistchannel.send(embed);
            } else {
                chatData.length = 0;
                const embed = new discord.MessageEmbed()
                    .setTitle("Factions List")
                    .setThumbnail(`https://api.minetools.eu/favicon/${config.minecraft.serverIP}`)
                    .setColor("BLUE")
                    .setFooter(config.minecraft.serverIP)
                    .addField("Factions", facName, true)
                    .addField("Online", value, true)
                return flistchannel.send(embed);
            }
        }, 500)
    }
}, database.getTime("t_autoFlist") * 60000 + 5000);

setInterval(() => {
    delete require.cache[require.resolve('./utils/dataStorage.json')];
    return require('./utils/dataStorage.json');
}, 5000);