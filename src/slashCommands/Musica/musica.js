const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { RepeatMode } = require("distube");

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Control de la reproducción de música")
        .addSubcommand(subcommand =>
            subcommand.setName('reproducir')
                .setDescription('Reproduce una canción')
                .addStringOption(option =>
                    option.setName('cancion')
                        .setDescription('Canción a reproducir (link o nombre)')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('detener')
                .setDescription('Detiene la reproducción de la música')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('reproduciendo')
                .setDescription('Muestra información de la canción que se está reproduciendo')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('control')
                .setDescription('Controlar la música en reproducción')
                .addStringOption(option =>
                    option.setName('accion')
                        .setDescription('Acción que deseas realizar con la música en reproducción')
                        .setRequired(true)
                        .addChoices(
                            { name: '⏯ Resumir reproducción', value: 'resume' },
                            { name: '⏸ Pausar reproducción', value: 'pause' },
                            { name: '⏭ Siguiente canción', value: 'skip' },
                            { name: '⏮ Anterior canción', value: 'previous' },
                            { name: '🔀 Mezclar lista música', value: 'shuffle' },
                            { name: '⏹ Detener reproducción', value: 'stop' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('volumen')
                .setDescription('Volumen para la música en reproducción')
                .addNumberOption(option =>
                    option.setName('porcentaje')
                        .setDescription('Porcentaje para la música en reproducción')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(200)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('cola')
                .setDescription('Lista la música que está en la cola de reproducción')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('saltar')
                .setDescription('Saltar a una canción de la lista en reproducción')
                .addNumberOption(option =>
                    option.setName('poscicion')
                        .setDescription('Número de la canción en la lista')
                        .setRequired(true)
                        .setMinValue(2)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('repetir')
                .setDescription('Repetir la música en reproducción')
                .addNumberOption(option =>
                    option.setName('tipo')
                        .setDescription('Tipo de repetición para la música')
                        .setRequired(true)
                        .addChoices(
                            { name: '🔂 Canción actual', value: 1 },
                            { name: '🔁 Lista completa', value: 2 },
                            { name: '❌ Desactivar', value: 0 }
                        )
                )
        ),

    async execute(client, interaction) {
        //constantes
        const SUB = interaction.options.getSubcommand();
        const channel = client.channels.cache.get(process.env.ID_CANAL_DISCO);
        const COM_NO_QUEUE = ['detener', 'reproducir']; //Comandos que no necesitan una cola de reproducción
        const COM_NO_VOICECHANNEL = []; //Comandos que no necesitan un canal de voz
        const VOICE_CHANNEL = interaction.member.voice?.channel ?? null; //Canal de voz

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
        };

        const QUEUE = await client.distube.getQueue(VOICE_CHANNEL) ?? null; //Cola de reproducción

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

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        // Accion a realizar segun el subcomando
        switch (SUB) {
            case 'reproducir':

                const cancion = interaction.options.getString('cancion');

                client.distube.play(VOICE_CHANNEL, cancion, {
                    member: interaction.member ?? undefined,
                    textChannel: channel
                }).catch(err => {
                    console.log('Error con la reproducción de la música'.red);
                });;
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Reproducción música')
                            .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                            .setColor(process.env.COLOR)
                            .setDescription(`Mira la lista en el canal ${channel}`)
                    ]
                    , ephemeral: true
                });
            case 'detener':
                await client.distube.stop(VOICE_CHANNEL);
                return await interaction.deleteReply();
            case 'reproduciendo':

                function getTimeString(time) {
                    const minutes = Math.floor(time / 60);
                    const seconds = Math.round(time % 60);
                    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    return timeString;
                }

                console.log(QUEUE)

                const cancion_actual = QUEUE.songs[0];
                const tiempo_reproduccion = getTimeString(QUEUE.currentTime);
                const tiempo_total = cancion_actual.formattedDuration;

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
                    ]});
            case 'control':
                const control = interaction.options.getString('accion');
                try {
                    switch (control) {
                        case 'resume':
                            if (QUEUE.playing) {
                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle('La música ya está reproduciendose')
                                            .setColor(process.env.COLOR_ERROR)
                                    ]
                                });
                            }

                            client.distube.resume(VOICE_CHANNEL);
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Resumen música')
                                        .setThumbnail('https://i.imgur.com/Zqg98ma.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se resumió la reproducción`, value: `🐱‍🏍 🎶🎵` })
                                ]
                            });
                        case 'pause':
                            if (QUEUE.paused) {
                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle('La música ya está en pausa')
                                            .setColor(process.env.COLOR_ERROR)
                                    ]
                                });
                            }

                            client.distube.pause(VOICE_CHANNEL);
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Pausar música')
                                        .setThumbnail('https://i.imgur.com/kY0gh91.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se pausó la música`, value: `🚦🛑` })
                                ]
                            });
                        case 'skip':
                            if ((!QUEUE.autoplay && QUEUE.songs.length <= 1) || QUEUE.songs.length <= 1) { //Si no hay más canciones en la lista y no está activado el autoplay
                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(process.env.COLOR_ERROR)
                                            .setDescription(`No hay más música en la lista para reproducir`)
                                    ]
                                });
                            };
                            client.distube.skip(VOICE_CHANNEL);
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Siguiente música')
                                        .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se saltó a la siguiente música`, value: `⏭ ⏭ ⏭ ` })
                                ]
                            });
                        case 'previous':
                            client.distube.previous(VOICE_CHANNEL);
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Música anterior')
                                        .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se saltó a la canción anterior`, value: `⏮ ⏮ ⏮` })
                                ]
                            });
                        case 'shuffle':
                            client.distube.shuffle(VOICE_CHANNEL);
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Mezcla lista música')
                                        .setThumbnail('https://i.imgur.com/8L4WreH.gif')
                                        .setColor(process.env.COLOR)
                                        .addFields({ name: `Se mezcló la lista de música`, value: `🎶 😎👍` })
                                ]
                            });
                        case 'stop':
                            await client.distube.stop(VOICE_CHANNEL);
                            return await interaction.deleteReply();
                    };
                } catch (error) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR_ERROR)
                                .setDescription(`Ops! Algo salió mal 😓`)
                                .setThumbnail('https://i.imgur.com/MHasiWy.gifv')
                        ],
                        ephemeral: true
                    })
                };
            case 'repetir':
                const tipo = interaction.options.getNumber('tipo');
                let modo = '';
                switch (client.distube.setRepeatMode(VOICE_CHANNEL, tipo)) {
                    case RepeatMode.DISABLED:
                        modo = "desactivado";
                        break;
                    case RepeatMode.SONG:
                        modo = "canción actual";
                        break;
                    case RepeatMode.QUEUE:
                        modo = "lista completa";
                        break;
                };
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Repetición música')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se cambió la repetición a \`${modo}\``, value: `🔄 🎶 🎵` })
                            .setThumbnail('https://i.imgur.com/Cm5hy47.gif')
                    ]
                });
            case 'volumen':
                const porcentaje = interaction.options.getNumber('porcentaje');
                const volumen_previo = QUEUE.volume;

                client.distube.setVolume(VOICE_CHANNEL, porcentaje);
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Volúmen música')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se cambió el volúmen de \`${volumen_previo} %\` a \`${porcentaje} %\``, value: `🔈🔉 🔊` })
                            .setThumbnail('https://i.imgur.com/IPLiduk.gif')
                    ]
                });
            case 'cola':

                let listaqueue = []; //Array vació donde estaran las canciones
                var maxsongs = 10; //Número de canciones que se mostraran por página del embed

                //mapeado canciones al array
                for (let i = 0; i < QUEUE.songs.length; i += maxsongs) {
                    let canciones = QUEUE.songs.slice(i, i + maxsongs);
                    listaqueue.push(canciones.map((cancion, index) => `**\`${i + ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "));
                }
                var limite = listaqueue.length;
                var embeds = [];
                //loop entre todas las canciones hasta el límite
                for (let i = 0; i < limite; i++) {
                    let desc = String(listaqueue[i]).substring(0, 2048); //Asegurar la longitud del mensaje para evitar errores
                    //Creación embed por cada limite (maxsongs)
                    const el_embed = new EmbedBuilder()
                        .setTitle(`🎶  Cola de reproducción - \`[${QUEUE.songs.length} ${QUEUE.songs.length > 1 ? "canciones" : "canción"}]\``)
                        .setColor(process.env.COLOR)
                        .setDescription(desc)

                    //Si el numero de canciones a mostrar es mayor a 1 especificamos en el embed que canción se esta reproduciendo en ese momento
                    if (QUEUE.songs.length > 1) el_embed.addFields({ name: `🎧 Canción actual`, value: `**[\`${QUEUE.songs[0].name}\`](${QUEUE.songs[0].url})**` });
                    await embeds.push(el_embed);
                }
                return paginacion();

                //función para paginacion
                async function paginacion() {
                    let pag_actual = 0
                    let embedpaginas = null;
                    let row = null;

                    //Creacion boton salir para el menú
                    let btn_salir = new ButtonBuilder()
                        .setCustomId('exit')
                        .setLabel('❌ Salir')
                        .setStyle(ButtonStyle.Danger);

                    //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
                    if (embeds.length === 1) {

                        row = new ActionRowBuilder().addComponents(btn_salir);

                        embedpaginas = await interaction.channel.send({
                            embeds: [embeds[0]],
                            components: [row]
                        }).catch(() => { });

                        //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
                    } else {

                        let btn_atras = new ButtonBuilder()
                            .setCustomId('atras')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`⬅`);

                        let btn_siguiente = new ButtonBuilder()
                            .setCustomId('siguiente')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`➡`);

                        let btn_inicio = new ButtonBuilder()
                            .setCustomId('inicio')
                            .setLabel('Inicio')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`🏠`);


                        row = new ActionRowBuilder().addComponents(btn_inicio, btn_atras, btn_siguiente, btn_salir);

                        //Enviamos el mensaje embed con los botones
                        embedpaginas = await interaction.channel.send({
                            content: `**Navega con los _botones_ en el menú**`,
                            embeds: [embeds[0].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })],
                            components: [row]
                        });
                    }

                    //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (Toffu)
                    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id == client.user.id, time: 30e3 });
                    //Escuchamos los eventos del collector
                    collector.on("collect", async b => {
                        //Si el usuario que hace click al boton no es el mismo a que puso el comando, se lo indicamos
                        if (b?.user.id != interaction.user.id) return b?.reply({ content: `❌ Solo quien uso el comando de queue puede navegar entre páginas` });

                        switch (b?.customId) {
                            case 'atras': {
                                collector.resetTimer();
                                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                                if (pag_actual !== 0) {
                                    pag_actual -= 1
                                    //Editamos el embed
                                    await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                                    await b?.deferUpdate();
                                } else {
                                    //Reseteamos la cantidad de embeds -1
                                    pag_actual = embeds.length - 1
                                    //Editamos el embed
                                    await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                                    await b?.deferUpdate();

                                }
                            }
                                break;
                            case 'siguiente': {
                                collector.resetTimer();
                                //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                                if (pag_actual < embeds.length - 1) {
                                    //Aumentamos el valor de la pagina actual +1
                                    pag_actual++;
                                    //Editamos el embed
                                    await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                                    await b?.deferUpdate();
                                } else {
                                    //Reseteamos la cantidad al inicio
                                    pag_actual = 0;
                                    //Editamos el embed
                                    await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                                    await b?.deferUpdate();

                                }
                            }
                                break;
                            case 'inicio': {
                                collector.resetTimer();
                                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                                pag_actual = 0;
                                await embedpaginas.edit({ embeds: [embeds[pag_actual].setFooter({ text: `Página ${pag_actual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                                await b?.deferUpdate();
                            }
                                break;
                            case 'exit': {
                                collector.stop();
                            }
                                break;
                            default:
                                break;
                        }
                    });
                    collector.on("end", async () => {
                        //desactivamos botones y editamos el mensaje
                        embedpaginas.edit({ content: "El tiempo ha expirado ⏳, utiliza denuevo el comando queue  😊", components: [] }).catch(() => { });
                        embedpaginas.suppressEmbeds(true);
                        await interaction.deleteReply();
                        return
                    });
                };
            case 'saltar':
                const poscicion = interaction.options.getNumber('poscicion');

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
                };

                client.distube.jump(VOICE_CHANNEL, poscicion - 1);
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Salto en lista de música')
                            .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se saltó a la canción número \`${poscicion}\``, value: `🐱‍🏍 🎶🎵` })
                    ]
                });               
        }
    }
}  