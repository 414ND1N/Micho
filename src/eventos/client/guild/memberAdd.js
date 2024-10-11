const { EmbedBuilder } = require('discord.js')
const { Events } = require('discord.js')
const Channels = require('../../../schemas/Channels')
const axios = require('axios')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        // Buscar el rol en la bd con el guildID y el nombre
        const CHANNEL_DATA = await Channels.findOne({ GuildID: member.guild.id, Name: "Bienvenida" })
        if (!CHANNEL_DATA) {
            console.log('❌ No se ha encontrado el canal de bienvenida en la base de datos')
            return
        }

        const welcomeChannel = await member.guild.channels.cache.find(channel => channel.id === CHANNEL_DATA.ID)
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
                    .setImage(`https://i.imgur.com/KNJ57fn.gif`)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
            ]
        })

        // Enviar mensaje a través de la API de CallMeBot a WhatsApp
        const message = encodeURIComponent(`${member.user.username} se ha unido a ${member.guild.name}`);
        const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.PHONE_NUMBER}&apikey=${process.env.API_KEY}&text=${message}`;

        try {
            await axios.get(apiUrl);
        } catch (error) {
            console.error('Error al enviar mensaje a WhatsApp:', error);
        }
    }
}