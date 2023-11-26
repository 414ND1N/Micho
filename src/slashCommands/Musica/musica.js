const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("musica")
        .setNameLocalizations({
            "en-US": "music"
        })
        .setDescription("Control de la reproducción de música")
        .setDescriptionLocalizations({
            "en-US": "Music playback control"
        })
        .addSubcommand(subcommand =>
            subcommand.setName('reproducir')
                .setNameLocalizations({ "en-US": 'play' })
                .setDescription('Reproduce una canción')
                .setDescriptionLocalizations({
                    "en-US": 'Play a song'
                })
                .addStringOption(option =>
                    option.setName('cancion')
                        .setNameLocalizations({ "en-US": 'song' })
                        .setDescription('Canción a reproducir (url o nombre)')
                        .setDescriptionLocalizations({
                            "en-US": 'Song to play (url or name)'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('detener')
                .setNameLocalizations({ "en-US": 'stop' })
                .setDescription('Detiene la reproducción de la música')
                .setDescriptionLocalizations({
                    "en-US": 'Stop music playback'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('reproduciendo')
                .setNameLocalizations({ "en-US": 'playing' })
                .setDescription('Muestra información de la canción que se está reproduciendo')
                .setDescriptionLocalizations({
                    "en-US": 'Show information about the song that is playing'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('controlar')
                .setNameLocalizations({ "en-US": 'control' })
                .setDescription('Controlar la música en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Control the music playing'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('volumen')
                .setNameLocalizations({ "en-US": 'volume' })
                .setDescription('Volumen para la música en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Volume for music playback'
                })
                .addNumberOption(option =>
                    option.setName('porcentaje')
                        .setDescription('Porcentaje para la música en reproducción')
                        .setDescriptionLocalizations({
                            "en-US": 'Percentage for music playback'
                        })
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(200)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('cola')
                .setNameLocalizations({ "en-US": 'queue' })
                .setDescription('Lista la música que está en la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'List the music that is in the playback queue'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('saltar')
                .setNameLocalizations({ "en-US": 'skip' })
                .setDescription('Saltar a una canción de la lista en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Skip to a song on the playback list'
                })
                .addNumberOption(option =>
                    option.setName('poscicion')
                        .setNameLocalizations({ "en-US": 'position' })
                        .setDescription('Número de la canción en la lista')
                        .setDescriptionLocalizations({
                            "en-US": 'Song number on the list'
                        })
                        .setRequired(true)
                        .setMinValue(2)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('repeticion')
                .setNameLocalizations({ "en-US": 'repeat' })
                .setDescription('Controlar el comportamiento de la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Control the behavior of the playback queue'
                })
        ),

    async execute(client, interaction) {
        //constantes
        const SUB = interaction.options.getSubcommand()
        const channel = client.channels.cache.get(process.env.ID_CANAL_DISCO)
        const COM_NO_QUEUE = ['detener', 'reproducir'] //Comandos que no necesitan una cola de reproducción
        const COM_NO_VOICECHANNEL = [] //Comandos que no necesitan un canal de voz
        const VOICE_CHANNEL = interaction.member.voice?.channel ?? null //Canal de voz

        //Comprobaciones previas y que no sea un comando que no lo necesite
        if (!VOICE_CHANNEL && !COM_NO_VOICECHANNEL.includes(SUB)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)  
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        }

        const QUEUE = await client.distube.getQueue(VOICE_CHANNEL) ?? null //Cola de reproducción

        //Verificar si hay una cola de reproducción y que no sea un comando que no lo necesite
        if (!QUEUE && !COM_NO_QUEUE.includes(SUB)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`No hay música en reproducción para ejecutar este comando`)
                ],
                ephemeral: true
            })
        }

        await interaction.deferReply() // Defer para respuestas de más de 3 segundos

        // Accion a realizar segun el subcomando
        switch (SUB) {
            case 'reproducir':

                const cancion = interaction.options.getString('cancion')

                client.distube.play(VOICE_CHANNEL, cancion, {
                    member: interaction.member ?? undefined,
                    textChannel: channel
                }).catch(err => {
                    console.log('Error con la reproducción de la música:'.red)
                    console.log(err)
                })
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
            case 'detener':
                await client.distube.stop(VOICE_CHANNEL)
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Detener música')
                            .setThumbnail('https://i.imgur.com/WnsPmQz.gif')
                            .setColor(process.env.COLOR)
                            .setDescription(`Se detuvo la reproducción de música`)
                    ]
                })
            case 'reproduciendo':

                function getTimeString(time) {
                    const minutes = Math.floor(time / 60)
                    const seconds = Math.round(time % 60)
                    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                    return timeString
                }

                const cancion_actual = QUEUE.songs[0]
                const tiempo_reproduccion = getTimeString(QUEUE.currentTime)
                const tiempo_total = cancion_actual.formattedDuration

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Canción reproduciendose')
                            .setColor(process.env.COLOR)
                            .setDescription(`\`${cancion_actual.name}\``)
                            .setThumbnail(cancion_actual.thumbnail)
                            .setURL(cancion_actual.url)
                            .addFields(
                                { name: `👁 Vistas`, value: `\`${cancion_actual.views}\``, inline: true },
                                { name: `⏳ Tiempo`, value: `\`${tiempo_reproduccion} / ${tiempo_total}\``, inline: true }
                            )
                            .setFooter({ text: `👍 ${cancion_actual.likes} / 👎 ${cancion_actual.dislikes}` })
                    ]})
            case 'controlar':
                // Creacion de los embed
                const embed_control = new EmbedBuilder()
                    .setTitle(`Controla la canción en reproducción`)
                    .setColor(process.env.COLOR)
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .addFields(
                        { name: `⏮ Anterior canción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏯ Resumir - Pausar reproducción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏹ Detener reproducción`, value: `Detiene la reproducción de la música actual` },
                        { name: `🔀 Mezclar cola música`, value: `Mezcla la cola de reproducción` },
                        { name: `⏭ Siguiente canción`, value: `Reanuda la reproducción de la música actual` },
                    )
                
                // Botones
                const row_control = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji('⏮')
                        .setCustomId('anterior')
                        .setStyle(ButtonStyle.Primary)
                    ,
                    new ButtonBuilder()
                        .setEmoji('⏯')
                        .setCustomId('play')
                        .setStyle(ButtonStyle.Success)
                    ,
                    new ButtonBuilder()
                        .setEmoji('⏹')
                        .setCustomId('detener')
                        .setStyle(ButtonStyle.Danger)
                    ,
                    new ButtonBuilder()
                        .setEmoji('🔀')
                        .setCustomId('mezclar')
                        .setStyle(ButtonStyle.Success)
                    ,
                    new ButtonBuilder()
                        .setEmoji('⏭')
                        .setCustomId('siguiente')
                        .setStyle(ButtonStyle.Primary)
                    
                ) 
                
                //Creacion del Embed principal
                let embed_music_control = await interaction.channel.send({
                    embeds: [embed_control],
                    components: [row_control],
                    ephemeral: true
                })

                //Creacion del collector
                const collector_control = embed_music_control.createMessageComponentCollector({time: 15e3}) //15 segundos de tiempo de espera
                collector_control.on("collect", async (i) => {
                    if(i?.user.id != interaction.user.id){
                        return await i.reply({content: `❌ Solo quien uso el comando puede navegar entre categorías.`, ephemeral: true})
                    }
                    switch (i?.customId){
                        case 'mezclar':
                            client.distube.shuffle(VOICE_CHANNEL)
                            collector_control.resetTimer()
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Mezcla lista música')
                                        .setThumbnail('https://i.imgur.com/8L4WreH.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se mezcló la lista de música`, value: `🎶 😎👍` })
                                ]
                            })
                            await i?.deferUpdate()
                            break
                        case 'play':{
                            let accion_usada = 'resumió'
                            if (QUEUE.paused) {
                                client.distube.resume(VOICE_CHANNEL)
                            }else{
                                accion_usada = 'pausó'
                                client.distube.pause(VOICE_CHANNEL)
                            }

                            collector_control.resetTimer()
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Se ${accion_usada} la música`)
                                        .setThumbnail('https://i.imgur.com/kY0gh91.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se pausó la música`, value: `🚦🛑` })
                                ]
                            })
                            await i?.deferUpdate()
                            break
                        }   
                        case 'detener':{
                            await client.distube.stop(VOICE_CHANNEL)
                            collector_control.resetTimer()
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Detener música')
                                        .setThumbnail('https://i.imgur.com/WnsPmQz.gif')
                                        .setColor(process.env.COLOR)
                                        .setDescription(`Se detuvo la reproducción de música`)
                                ]
                            })
                            await i?.deferUpdate()
                            break
                        }
                        case 'siguiente':{
                            if ((!QUEUE.autoplay && QUEUE.songs.length <= 1) || QUEUE.songs.length <= 1) { //Si no hay más canciones en la lista y no está activado el autoplay
                                interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(process.env.COLOR_ERROR)
                                            .setDescription(`No hay más música en la lista para reproducir`)
                                    ]
                                })
                                break
                            }
                            client.distube.skip(VOICE_CHANNEL)
                            collector_control.resetTimer()
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Siguiente música')
                                        .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se saltó a la siguiente música`, value: `⏭ ⏭ ⏭ ` })
                                ]
                            })
                            await i?.deferUpdate()
                            break
                        }
                        case 'anterior':{
                            client.distube.previous(VOICE_CHANNEL)
                            collector_control.resetTimer()
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Música anterior')
                                        .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se saltó a la canción anterior`, value: `⏮ ⏮ ⏮` })
                                ]
                            })
                            await i?.deferUpdate()
                            break
                        }
                    }

                })
                collector_control.on("end", async () => {
                    //se actualiza el mensaje y se elimina la interacción
                    embed_music_control.edit({content: "", embeds:[
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setThumbnail("https://i.imgur.com/bDO4VTw.gif")
                    ], components:[], ephemeral: true}).catch(() => {})
                    await interaction.deleteReply()
                    return
                })
                break
            case 'repeticion':
                // Creacion de los embed
                const embed_repeticion = new EmbedBuilder()
                    .setTitle(`Controla la canción en reproducción`)
                    .setColor(process.env.COLOR)
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .addFields(
                        { name: `🔂 Repetir canción actual`, value: `Repetir la canción actual` },
                        { name: `🔁 Repetir lista completa`, value: `Repetir la cola completa` },
                        { name: `❌ Desactivar repetición`, value: `Desactiva la repetición de la música o cola` },
                        { name: `🚪 Salir`, value: `Cerrar el menú de control` },
                    )
                
                // Botones

                const row_repeticion = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji('🔂')
                        .setCustomId('rep_actual')
                        .setStyle(ButtonStyle.Primary)
                    ,
                    new ButtonBuilder()
                        .setEmoji('🔁')
                        .setCustomId('rep_lista')
                        .setStyle(ButtonStyle.Primary)
                    ,
                    new ButtonBuilder()
                        .setEmoji('❌')
                        .setCustomId('rep_no')
                        .setStyle(ButtonStyle.Danger)
                    ,
                    new ButtonBuilder()
                        .setEmoji('🚪')
                        .setCustomId('exit')
                        .setStyle(ButtonStyle.Success)
                    
                ) 
                
                //Creacion del Embed principal
                let embed_music_repeticion = await interaction.channel.send({
                    embeds: [embed_repeticion],
                    components: [row_repeticion],
                    ephemeral: true
                })

                //Creacion del collector
                const collector_repeticion = embed_music_repeticion.createMessageComponentCollector({time: 18e3}) //18 segundos de tiempo de espera
                collector_repeticion.on("collect", async (b) => {
                    if(b?.user.id != interaction.user.id){
                        return await b.reply({content: `❌ Solo quien uso el comando puede navegar entre categorías.`, ephemeral: true})
                    }

                    switch (b.customId){
                        case 'rep_actual':
                        case 'rep_lista':
                        case 'rep_no':
                            let repeticion_value = 0
                            let modo_rep = ''
                            switch (b?.customId) {
                                case 'rep_actual':
                                    repeticion_value = 1
                                    modo_rep = "cancion actual"
                                    break
                                case 'rep_lista':
                                    repeticion_value = 2
                                    modo_rep = "lista completa"
                                    break
                                case 'rep_no':
                                    repeticion_value = 0
                                    modo_rep = "desactivado"
                                    break
                            }

                            client.distube.setRepeatMode(VOICE_CHANNEL, repeticion_value)
                            collector_repeticion.resetTimer()
                        
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Repetición cola música')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se cambió la repetición a \`${modo_rep}\``, value: `🔄 🎶 🎵` })
                                        .setThumbnail('https://i.imgur.com/Cm5hy47.gif')
                                ]
                            })
                            await b?.deferUpdate()
                            break
                        
                        case 'exit':
                            // Finalizar el collector
                            collector_repeticion.stop()
                        
                    }

                })
                collector_repeticion.on("end", async () => {
                    //se actualiza el mensaje y se elimina la interacción
                    embed_music_repeticion.edit({content: "", embeds:[
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setThumbnail("https://i.imgur.com/bDO4VTw.gif")
                    ], components:[], ephemeral: true}).catch(() => {})
                    await interaction.deleteReply()
                    return
                })
                break
            case 'volumen':
                const porcentaje = interaction.options.getNumber('porcentaje')
                const volumen_previo = QUEUE.volume

                client.distube.setVolume(VOICE_CHANNEL, porcentaje)
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Volúmen música')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se cambió el volúmen de \`${volumen_previo} %\` a \`${porcentaje} %\``, value: `🔈🔉 🔊` })
                            .setThumbnail('https://i.imgur.com/IPLiduk.gif')
                    ]
                })
            case 'cola':

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
                        .setLabel('❌ Salir')
                        .setStyle(ButtonStyle.Danger)

                    //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
                    if (embeds.length === 1) {

                        row = new ActionRowBuilder().addComponents(btn_salir)

                        embedpaginas = await interaction.channel.send({
                            embeds: [embeds[0]],
                            components: [row]
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
                            components: [row]
                        })
                    }

                    //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (el bot)
                    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id == client.user.id, time: 30e3 })
                    //Escuchamos los eventos del collector
                    collector.on("collect", async b => {
                        //Si el usuario que hace click al boton no es el mismo a que puso el comando, se lo indicamos
                        if (b?.user.id != interaction.user.id) return b?.reply({ content: `❌ Solo quien uso el comando de queue puede navegar entre páginas` })

                        switch (b?.customId) {
                            case 'atras': {
                                
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
                            }
                                break
                            case 'siguiente': {
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
                            }
                                break
                            case 'inicio': {
                                collector.resetTimer()
                                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                                pag_actual = 0
                                await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { })
                                await b?.deferUpdate()
                            }
                                break
                            case 'exit': {
                                collector.stop()
                            }
                                break
                            default:
                                break
                        }
                    })
                    collector.on("end", async () => {
                        //se actualiza el mensaje y se elimina la interacción
                        embedpaginas.edit({content: "", embeds:[
                            new EmbedBuilder()
                                .setColor(process.env.COLOR)
                                .setThumbnail("https://i.imgur.com/bDO4VTw.gif")
                        ], components:[], ephemeral: true}).catch(() => {})
                        await interaction.deleteReply()
                        return
                    })
                }
            case 'saltar':
                const poscicion = interaction.options.getNumber('poscicion')

                //Comprobaciones previas
                if (poscicion > (QUEUE.songs.length)) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR_ERROR)
                                .setDescription(`La lista unicamente cuenta con \`${QUEUE.songs.length}\` canciones`)
                        ],
                        ephemeral: true
                    })
                }

                client.distube.jump(VOICE_CHANNEL, poscicion - 1)
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Salto en lista de música')
                            .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se saltó a la canción número \`${poscicion}\``, value: `🐱‍🏍 🎶🎵` })
                    ]
                })               
        }
    }
}  