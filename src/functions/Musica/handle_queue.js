const { EmbedBuilder } = require('discord.js')
const buttonPagination = require('../../utils/buttonPagination')

// musicCommands.js
module.exports = async (interaction, QUEUE) => {

    try {

        let listaqueue = [] //Array vació donde estaran las canciones
        var maxsongs = 10 //Número de canciones que se mostraran por página del embed
    
        //mapeado canciones al array
        for (let i = 0; i < QUEUE.songs.length; i += maxsongs) {
            let canciones = QUEUE.songs.slice(i, i + maxsongs)
            listaqueue.push(canciones.map((cancion, index) => `**\`${i + ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "))
        }
        var limite = listaqueue.length
        var embeds = []
        //loop entre todas las canciones hasta el límite
        for (let i = 0; i < limite; i++) {
            let desc = String(listaqueue[i]).substring(0, 2048) //Asegurar la longitud del mensaje para evitar errores
            //Creación embed por cada limite (maxsongs)
            const el_embed = new EmbedBuilder()
                .setTitle(`🎶  Cola de reproducción - \`[${QUEUE.songs.length} ${QUEUE.songs.length > 1 ? "canciones" : "canción"}]\``)
                .setColor(process.env.COLOR)
                .setDescription(desc)
    
            //Si el numero de canciones a mostrar es mayor a 1 especificamos en el embed que canción se esta reproduciendo en ese momento
            if (QUEUE.songs.length > 1) el_embed.addFields({ name: `🎧 Canción actual`, value: `**[\`${QUEUE.songs[0].name}\`](${QUEUE.songs[0].url})**` })
            embeds.push(el_embed)
        }
    
        await buttonPagination(interaction, embeds, 45_000)
    } catch (error) {

        console.error(error)
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR_ERROR)
                    .setDescription(`Ocurrió un error al mostrar la cola de reproducción`)
            ]
            , ephemeral: true
        })
    }
}
