const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

// musicCommands.js
const handleMusicQueue = async (interaction, client, VOICE_CHANNEL, QUEUE, channel) => {
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
        await embeds.push(el_embed)
    }
    return paginacion()

    //función para paginacion
    async function paginacion() {
        let pag_actual = 0
        let embedpaginas = null
        let row = null

        //Creacion boton salir para el menú
        let btn_salir = new ButtonBuilder()
            .setCustomId('exit')
            .setEmoji('🚪')
            .setLabel('Salir')
            .setStyle(ButtonStyle.Danger)

        //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
        if (embeds.length === 1) {

            row = new ActionRowBuilder().addComponents(btn_salir)

            embedpaginas = await interaction.channel.send({
                embeds: [embeds[0]],
                components: [row],
                ephemeral: true
            }).catch(() => { })

            //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
        } else {

            let btn_atras = new ButtonBuilder()
                .setCustomId('atras')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`⬅`)

            let btn_siguiente = new ButtonBuilder()
                .setCustomId('siguiente')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`➡`)

            let btn_inicio = new ButtonBuilder()
                .setCustomId('inicio')
                .setLabel('Inicio')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🏠`)


            row = new ActionRowBuilder().addComponents(btn_inicio, btn_atras, btn_siguiente, btn_salir)

            //Enviamos el mensaje embed con los botones
            embedpaginas = await interaction.channel.send({
                content: `**Navega con los _botones_ en el menú**`,
                embeds: [embeds[0].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })],
                components: [row],
                ephemeral: true
            })
        }

        //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (el bot)
        const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id == client.user.id, time: 30e3 })
        //Escuchamos los eventos del collector
        collector.on("collect", async b => {
            //Si el usuario que hace click al boton no es el mismo a que puso el comando, se lo indicamos
            if (b?.user.id != interaction.user.id) return b?.reply({ content: `❌ Solo quien uso el comando de queue puede navegar entre páginas` })

            switch (b?.customId) {
                case 'atras':

                    //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                    if (pag_actual !== 0) {
                        pag_actual -= 1
                        //Editamos el embed
                        await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                        await b?.deferUpdate()
                    } else {
                        //Reseteamos la cantidad de embeds -1
                        pag_actual = embeds.length - 1
                        //Editamos el embed
                        await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                        await b?.deferUpdate()

                    }

                    break
                case 'siguiente':
                    collector.resetTimer()
                    //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                    if (pag_actual < embeds.length - 1) {
                        //Aumentamos el valor de la pagina actual +1
                        pag_actual++
                        //Editamos el embed
                        await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                        await b?.deferUpdate()
                    } else {
                        //Reseteamos la cantidad al inicio
                        pag_actual = 0
                        //Editamos el embed
                        await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                        await b?.deferUpdate()
                    }
                    break
                case 'inicio':
                    collector.resetTimer()
                    //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                    pag_actual = 0
                    await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                    await b?.deferUpdate()
                    break
                case 'exit':
                    collector.stop()
                    break
            }
        })
        collector.on("end", async () => {
            //se actualiza el mensaje y se elimina la interacción
            embedpaginas.edit({
                content: "", embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setThumbnail("https://i.imgur.com/DeMOi0v.gif")
                ], components: [], ephemeral: true
            }).catch(() => { })
            embedpaginas.suppressEmbeds(true)
            await interaction.deleteReply()
            return
        })
    }

}

module.exports = {
    handleMusicQueue
};
