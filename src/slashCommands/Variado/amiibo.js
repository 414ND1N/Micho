const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Mostrar información de amiibos")
        .addStringOption(option =>
            option.setName("personaje")
                .setDescription('Personaje a buscar amiibos 🔍')
                .setRequired(true)
        ),
    async execute(client, interaction, prefix) {

        //USO DE LA API github.com/N3evin/AmiiboAPI

        await interaction.deferReply();

        const character = interaction.options.getString("personaje")
        const busqueda = `character=${character}`
        const url_api = `https://amiiboapi.com/api/amiibo/?${busqueda}`
        let response = null

        //Verificar si existe el amiibo
        try {
            response = await axios.get(url_api);
        } catch (error) {
            await interaction.deleteReply();
            return interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No se encontró ningún amiibo de \`${character}\``)
                ],
                ephemeral: true
            })
        }
        
        const amiibos = response.data.amiibo;
        await interaction.channel.sendTyping();

        //Páginas
        var embeds = [];

        amiibos.forEach(async amiibo => {
            //Crear embed de amiibo individual
            const embedAmiibo = new EmbedBuilder()
                .setTitle(`Amiibo | \`${amiibo.name}\``)
                .setImage(amiibo.image)
                .addFields(
                    { name: `Serie`, value: `${amiibo.amiiboSeries}`, inline: true},
                    { name: `Videojuego`, value: `${amiibo.gameSeries}`, inline: true},
                    { name: `Tipo`, value: `${amiibo.type}` },
                    { name: 'Lanzamientos', value: '\u200B' },
                    { name: `AU`, value: `\`${amiibo.release.au}\``, inline: true},
                    { name: 'EU', value: `\`${amiibo.release.eu}\``, inline: true},
                    { name: 'JP', value: ` \`${amiibo.release.jp}\``, inline: true},
                    { name: 'NA', value: ` \`${amiibo.release.na}\``, inline: true},
                )
                .setColor(process.env.COLOR);
            //Agregar pagina al array embeds
            await embeds.push(embedAmiibo);
        });
        return paginacion();

        //función para paginacion
        async function paginacion() {
            let pag_actual = 0
            let embedpaginas = null;
            let row = null;

            //Creacion boton salir para el menú
            const btn_salir = new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('❌')
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
                const btn_atras =  new ButtonBuilder()
                    .setCustomId('atras')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`⬅`);
                
                const btn_siguiente =  new ButtonBuilder()
                    .setCustomId('siguiente')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`➡`);

                const btn_inicio = new ButtonBuilder()
                    .setCustomId('inicio')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`🏠`);

                row = new ActionRowBuilder().addComponents(btn_inicio, btn_atras, btn_siguiente, btn_salir);

                embedpaginas = await interaction.channel.send({
                    embeds: [embeds[0].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})],
                    components: [row]
                });
            }

            //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (el bot)
            const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id == client.user.id, time: 80e3 });

            //Escuchamos los eventos del collector
            collector.on("collect", async action => {
                switch (action?.customId) {
                    case 'atras': {
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        if(pag_actual !== 0){
                            pag_actual -= 1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad de embeds -1
                            pag_actual = embeds.length-1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();
                        }
                    }
                        break;
                    case 'siguiente': {
                        collector.resetTimer();
                        //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                        if(pag_actual < embeds.length - 1){
                            //Aumentamos el valor de la pagina actual +1
                            pag_actual ++;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad al inicio
                            pag_actual = 0;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();

                        }
                    }
                        break;
                    case 'exit': {
                        collector.stop();
                    }
                        break;
                    default:{ // Si no es ninguno de los botones de navegacion entonces es el boton de inicio
                        collector.resetTimer();
                        //Se retrocede a la pagina 0
                        pag_actual = 0;
                        await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                        await action?.deferUpdate();
                    }
                        break;
                }
            });
            collector.on("end", async () => {
                //desactivamos botones y editamos el mensaje
                embedpaginas.edit({ content: `Búsqueda del amiibo \`${character}\`.`, components: [] }).catch(() => { });
                await interaction.deleteReply();
            });
        }

    }
}