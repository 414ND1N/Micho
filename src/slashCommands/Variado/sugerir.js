const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("sugerir")
        .setNameLocalizations({
            "en-US": "suggest"
        })
        .setDescription("Dar sugerencia a votación en el canal de sugerencias")
        .setDescriptionLocalizations({
            "en-US": "Give suggestion to vote in the suggestions channel"
        })
        .addStringOption(option =>
        option.setName("sugerencia")
            .setNameLocalizations({
                "en-US": "suggestion"
            })
            .setDescription('Sugerencia para la votación')
            .setDescriptionLocalizations({
                "en-US": "Suggestion for voting"
            })
            .setRequired(true)
        ),
    async execute(client, interaction){
        let sugerencia = interaction.options.getString("sugerencia")
        const channel = client.channels.cache.get(process.env.ID_CANAL_SUGERENCIAS) //ID del canal de sugerencias
        const channel_pruebas = client.channels.cache.get(process.env.ID_CANAL_PRUEBAS) //ID del canal de pruebas
        
        const AUTHOR = interaction.member?.nickname?? interaction.user.username // Si no tiene apodo, se usa el nombre de usuario

        //Si el canal es el de pruebas se enviará la sugerencia en el canal de pruebas
        if (interaction.channel == channel_pruebas) {
            const mensaje = await channel_pruebas.send({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Sugerencia de \`${AUTHOR}\``)
                    .setDescription(`\`${sugerencia}\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
            ], fetchReply: true })
            mensaje.react(`👍`)
            mensaje.react(`👎`)
        } else{
            //Si el canal no es el de pruebas se enviará la sugerencia en el canal de sugerencias
            const mensaje = await channel.send({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Sugerencia de \`${AUTHOR}\``)
                    .setDescription(`\`${sugerencia}\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
            ], fetchReply: true })
            mensaje.react(`👍`)
            mensaje.react(`👎`)
        }

        return interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle(`Sugerencia realizada`)
                .setDescription(`Sugerencia \`${sugerencia}\` enviada a ${channel}`)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/X3E6BAy.gif`)
        ], ephemeral: true })
        
    }
} 