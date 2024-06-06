const { EmbedBuilder } = require('discord.js')

// musicCommands.js
module.exports = async (interaction, client, VOICE_CHANNEL, QUEUE, channel) => {

    try {
            
        const canciones = interaction.options.getString('cancion')

        if (interaction.options.getBoolean('nueva') && QUEUE) { // Si se especifica nueva, no se mantiene la cola anterior
            const num_canciones = QUEUE?.songs.length ?? 0;
            // se agrega la lista
            await client.distube.play(VOICE_CHANNEL, canciones, {
                member: interaction.member ?? undefined,
                textChannel: channel ?? undefined
            });
    
            // Se vacia las canciones anteriores
            if (QUEUE && QUEUE.songs.length > 0) {
                client.distube.jump(VOICE_CHANNEL, num_canciones);
            }
        } else if (interaction.options.getBoolean('saltar')) { // Si se especifica saltar, se mantiene la cola anterior
            // se agrega la lista y salta a la cancion agregada
            await client.distube.play(VOICE_CHANNEL, canciones, {
                member: interaction.member ?? undefined,
                textChannel: channel,
                skip: true
            });
        } else { // Si no se especifica nueva o saltar
            // se agrega la lista a la cola
            await client.distube.play(VOICE_CHANNEL, canciones, {
                member: interaction.member ?? undefined,
                textChannel: channel ?? undefined
            });
        }
    
        // Si se especifica un volumen, se cambia el volumen
        const volumen = interaction.options.getNumber("volumen");
        if (volumen) {
            client.distube.setVolume(VOICE_CHANNEL, volumen);
        }
    
        // Si se especifica mezclar, se mezcla la cola
        if (interaction.options.getBoolean("mezclar")) {
            client.distube.shuffle(VOICE_CHANNEL);
        }
    
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Reproducción música')
                    .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                    .setColor(process.env.COLOR)
                    .setDescription(`Mira la lista en el canal ${channel}`)
            ]
            , ephemeral: true
        })
    } catch (error) {
        
        console.error(error)
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR_ERROR)
                    .setDescription(`Ocurrió un error al reproducir la música`)
            ]
            , ephemeral: true
        })
    }
}
