const { EmbedBuilder } = require('discord.js')
const { Events } = require('discord.js')
const Channels = require('@/schemas/channels')
const { PEEPO_SURPRISE } = require('@/images')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        // Buscar el canal de bienvenida en la base de datos
        const CHANNEL_DATA = await Channels.findOne({ guild_id: member.guild.id, key: "welcome" })
        if (!CHANNEL_DATA) {
            console.log('❌ No se ha encontrado el canal de bienvenida en la base de datos')
            return
        }

        // Obtener el canal de bienvenida del servidor
        const welcomeChannel = await member.guild.channels.cache.find(channel => channel.id === CHANNEL_DATA.channel_id)
        await welcomeChannel.fetch()

        if (!welcomeChannel){
            return console.log(`No se ha encontrado el canal de bienvenida`)
        }

        welcomeChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: welcomeChannel.guild.name, iconURL: welcomeChannel.guild.iconURL() })
                    .setTitle(`¡ Nuevo \`pana\` se ha unido al grupo !`)
                    .setDescription(`Bienvenido a \`${member.guild.name}\``)
                    .setThumbnail(`${member.user.avatarURL({ forceStatic: false })}`)
                    .setImage(PEEPO_SURPRISE)
                    .setColor('Random')
                    .setTimestamp()
            ]
        })
    }
}