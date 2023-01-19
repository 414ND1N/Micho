const { EmbedBuilder } = require('discord.js')

module.exports = async (client, member) => {
    const channel = member.guild.channels.cache.get('975663250903543808');

    channel.send({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
                .setTitle(`¡ Nuevo \`pana\` se ha unido al grupo !`)
                .setDescription(`Bienvenido a \`Onanībando\``)
                .setThumbnail(`${member.user.avatarURL({ forceStatic: false })}`)
                .setImage(`https://i.imgur.com/KNJ57fn.gif`) 
                .setTimestamp()
                .setColor(process.env.COLOR)
        ]
    })
}