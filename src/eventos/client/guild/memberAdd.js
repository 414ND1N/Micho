const { EmbedBuilder } = require('discord.js')
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const welcomeChannel = await member.guild.channels.cache.find(channel => channel.id === process.env.ID_CANAL_BIENVENIDA)
        await welcomeChannel.fetch()

        if (!welcomeChannel){
            return console.log(`No se ha encontrado el canal de bienvenida`)
        }

        welcomeChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: welcomeChannel.guild.name, iconURL: welcomeChannel.guild.iconURL() })
                    .setTitle(`¡ Nuevo \`pana\` se ha unido al grupo !`)
                    .setDescription(`Bienvenido a \`Onanībando\``)
                    .setThumbnail(`${member.user.avatarURL({ forceStatic: false })}`)
                    .setImage(`https://i.imgur.com/KNJ57fn.gif`)
                    .setTimestamp()
                    .setColor(process.env.COLOR)
            ]
        })
    }
}