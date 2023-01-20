const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver la lista de canciones"),
    async execute(client, interaction, prefix){
        await interaction.deferReply();

        const voicechannel = interaction.member.voice.channel
        const queue = client.distube.getQueue(voicechannel);

        if (!queue) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay música reproduciendose`)
                ],
                ephemeral: true
            })
        };
        
        if (!voicechannel){
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        };
        
        let listaqueue = []; //Array vació donde estaran las canciones
        var maxsongs = 10; //Número de canciones que se mostraran por página del embed

        //mapeado canciones al array
        for (let i = 0; i < queue.songs.length; i+= maxsongs){
            var canciones = queue.songs.slice(i, i + maxsongs);
            listaqueue.push(canciones.map((cancion, index) => `**\`${i+ ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "));
        } 
        var limite = listaqueue.length;
        var embeds = [];
        //loop entre todas las canciones hasta el límite
        for (let i = 0; i < limite; i++){
            let desc = String(listaqueue[i]).substring(0,2048); //Asegurar la longitud del mensaje para evitar errores
            //Creación embed por cada limite (maxsongs)
            const el_embed = new EmbedBuilder()
                .setTitle(`🎶  Cola de reproducción - \`[${queue.songs.length} ${queue.songs.length > 1 ? "canciones": "canción"}]\``)
                .setColor(process.env.COLOR)
                .setDescription(desc)
            
            //Si el numero de canciones a mostrar es mayor a 1 especificamos en el embed que canción se esta reproduciendo en ese momento
            if (queue.songs.length > 1) el_embed.addFields({name: `🎧 Canción actual`, value: `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`});
            await embeds.push(el_embed);
        }
        return paginacion();

        //función para paginacion
        async function paginacion(){
            let pag_actual = 0
            //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
            if (embeds.length === 1) {
                interaction.channel.send({embeds: [embeds[0]]}).catch(() => {});
                return await interaction.reply('<:rolas:1051012560054407219> Lista de canciónes en cola');
            }
            //Si el numero de embeds es mayor a 1 ponemos botoines de paginacion
            let btn_atras =  new ButtonBuilder()
                .setCustomId('atras')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`⬅`);
            
            let btn_siguiente =  new ButtonBuilder()
                .setCustomId('siguiente')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`➡`);

            let btn_inicio = new ButtonBuilder()
                .setCustomId('inicio')
                .setLabel('Inicio')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🏠`);
            
            let btn_salir =  new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('❌ Salir')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(btn_inicio, btn_atras, btn_siguiente, btn_salir);

            //Enviamos el mensaje embed con los botones
            let embedpaginas = await interaction.channel.send({
                content: `**Navega con los _botones_ en el menú**`,
                embeds: [embeds[0].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})],
                components: [row]
            });

            //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (Toffu)
            const collector = embedpaginas.createMessageComponentCollector({filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id  == client.user.id, time: 30e3});
            //Escuchamos los eventos del collector
            collector.on("collect", async b => {
                //Si el usuario que hace click al boton no es el mismo a que puso el comando, se lo indicamos
                if (b?.user.id != interaction.user.id) return b?.reply({content: `❌ Solo quien uso el comando de queue puede navegar entre páginas`});

                switch (b?.customId) {
                    case 'atras':{
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        if(pag_actual !== 0){
                            pag_actual -= 1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad de embeds -1
                            pag_actual = embeds.length-1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();

                        }
                    }
                        break;
                    case 'siguiente':{
                        collector.resetTimer();
                        //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                        if(pag_actual < embeds.length - 1){
                            //Aumentamos el valor de la pagina actual +1
                            pag_actual ++;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad al inicio
                            pag_actual = 0;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();

                        }
                    }
                        break;
                    case 'inicio':{
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        pag_actual = 0;
                        await embedpaginas.edit({embeds: [embeds[pag_actual].setFooter({text: `Página ${pag_actual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                        await b?.deferUpdate();
                    }
                        break;
                    case 'exit':{
                        collector.stop();
                    }
                        break;
                    default:
                        break;
                }
            });
            collector.on("end", async () => {
                //desactivamos botones y editamos el mensaje
                embedpaginas.edit({content: "El tiempo ha expirado ⏳, utiliza denuevo el comando queue  😊", components:[]}).catch(() => {});
                embedpaginas.suppressEmbeds(true);
                await interaction.deleteReply();
            });
        }
    }
}