const {EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
module.exports = {
    ALIASES: ["ayuda"],
    DESCRIPTION: "Sirve para ver los comandos disponibles",
    async execute(client, message, args, prefix){
        try{
            let btn_menu = new ButtonBuilder()
                .setCustomId('menu')
                .setLabel('Menú')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`🏠`);
            
            let btn_info =  new ButtonBuilder()
                .setCustomId('info')
                .setLabel('Info')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`<:facts:1061057414876639292>`);

            let btn_music =  new ButtonBuilder()
                .setCustomId('music')
                .setLabel('Música')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`<:rolas:1051012560054407219>`);

            let btn_var =  new ButtonBuilder()
                .setCustomId('var')
                .setLabel('Variedad')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`<:sus:1061064541179486218>`);

            let btn_salir =  new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('❌ Salir')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(btn_menu,btn_info,btn_music,btn_var,btn_salir);    

            const embed_menu = new EmbedBuilder()
                .setTitle('Menú')
                .setDescription(`Los comandos compatibles con **Toffu**, tanto con \`/\` o con \`tf.\``)
                .setColor(process.env.COLOR)
                .addFields(
                    {name: `\`Información\``, value: `Comandos que brindan información del bot y/o servidor.`},
                    {name: `\`Música\``, value: `Comandos para reproducir música en el canal de voz que te encuentres conectado.`},
                    {name: `\`Variedad\``, value: `Comandos para funciónes miscelaneo.`}
                ) 
                .setThumbnail("https://i.imgur.com/xbzkVJh.gif");

            const embed_menu1 = new EmbedBuilder()
                .setTitle('Información')
                .setDescription(`Comandos que brindan información del bot y/o servidor`)
                .setColor(`#3a7c21`)
                .addFields(
                    {name: `help`, value:`Sirve para ver el menú de ayuda con los comandos.`},
                    {name: `ping`, value:`Sirve para ver el ping en ms de \`Toffu\`.`},
                    {name: `pagina`, value:`Muestra el link de la pana página.`},
                    {name: `codigo`, value:`Muestra el link del repositorio con el código de \`Toffu\`.`}
                )  
                .setThumbnail(`https://i.imgur.com/Ud2cXN5.jpg`);
    
            const embed_menu2 = new EmbedBuilder()
                .setTitle('Música')
                .setDescription(`Comandos para reproducir música en el canal de voz en el que te encuentres conectado`)
                .setColor(`#c72a2a`)
                .addFields(
                    {name: `djpanas`, value:`Sirve para reproducir DJPANAS.\n> Se puede elegir entre las distintas variaciones.`},
                    {name: `**SUBCOMANDOS**`, value:`Estos comandos son subcomandos del comando principal \`music\`.`},
                    {name: `▪  play`, value:`Sirve para reproducir una canción dada (link o nombre).\n
                        > Admite links de \`YouTube\`, \`Spotify\` y \`Soundcloud\`.`},
                    {name: `▪  stop`, value:`Detiene la reproducción de la canción actual.`},
                    {name: `▪  control`, value:`Entre las acciones que cuenta estan: \n
                        > \`Resumir\`, \`Pausar\`, \`Siguiente\`, \`Anterior\`, \`Mezclar\`.`},
                    {name: `▪  volumen`, value:`Sirve para indicar el volumen de la canción.\n
                        > Admite de \`0%\` a \`200%\`.`},
                    {name: `▪  lista`, value:`Sirve para ver la lista de canciones.\n
                        > Muestra un menú con botones de navegación.`},
                    {name: `▪  nowplaying`, value:`Muestra la duración que esta en reproducción`},
                    {name: `▪  saltar`, value:`Sirve para saltar a una canción de la lista en reproducción.\n
                        > El número de canción se puede ver en la queue.`},
                    {name: `▪  repetir`, value:`Sirve para cambiar el modo de repetición de la música en reproducción.\n
                        > Puede ser \`desactivado\`, \`canción actual\`, \`lista completa\`.`}
                )  
                .setThumbnail(`https://i.imgur.com/GLPfwSa.jpg`);
    
            const embed_menu3 = new EmbedBuilder()
                .setTitle('Variedad')
                .setDescription(`Comandos para funciónes miscelaneo`)
                .setColor(`#0c6bc2`)
                .addFields(
                    {name: `8ball`, value:`Sirve para que la bola 8 de una respuesta a una pregunta.`},
                    {name: `accion`, value:`Sirve para hacer una acción a otro usuario.\n
                    > Entre las acciones esta \`saludar\`, \`felicitar\`, \`sorprender\`, \`abrazar\`, \`besar\`, \`golpear\`, \`dar palmadas\`, \`mirar fijamente\`, \`bofetear\`, \`dar toques\`, \`presumir\`, \`lamer\`, \`pulgar arriba\`, \`berrinche\`, \`sonrojar\`.\n
                    _Puedes indicar que tipo de imagen buscar_.`},
                    {name: `buscaminas`, value:`Sirve para jugar al buscaminas.
                        > Se indica el número de \`columnas\`, \`filas\` y la \`dificultad\` (en ese orden 😊).`},
                    {name: `decir`, value:`Sirve para que Toffu diga el texto dado.`},
                    {name: `elegir`, value:`Sirve para que Toffu eliga entre las opciones dadas.\n
                        > Las opciones se dan separadas por coma \`,\`.`},
                    {name: `gif`, value:`Sirve para mostrar el gif que se desee buscar.\n
                        > Mostrara un gif aleatorio de \`tenor.com\`.`},
                    {name: `pokedex`, value:`Sirve para mostrar información de un pokemón según su id\n
                        > Disponible desde el pokemón \`1\` al \`1010\`.`},
                    {name: `pregunta`, value:`Sirve para realizar una pregunta.`},
                    {name: `sugerir`, value:`Sirve para dar una sugerencia al canal de sugerencias.`},   
                )
                .setThumbnail(`https://i.imgur.com/s2lV0y5.png`);

            let embed_help = await message.channel.send({
                content: `**Navega con los _botones_ en el menú**`,
                embeds: [embed_menu],
                components: [row]
            });

            const collector = embed_help.createMessageComponentCollector({time: 60e3});  
            
            collector.on("collect", async (i) => {
                if(i?.user.id != message.author.id){
                    return await i.reply({content: `❌ Solo quien uso el comando de queue puede navegar entre páginas`});
                }
                switch (i?.customId){
                    case 'menu':{
                        collector.resetTimer();
                        await i.update({embeds: [embed_menu], components:[row]})
                    }
                        break;
                    case 'info':{
                        collector.resetTimer();
                        await i.update({embeds: [embed_menu1], components:[row]})
                    }
                        break;
                    case 'music':{
                        collector.resetTimer();
                        await i.update({embeds: [embed_menu2], components:[row]})
                    }
                        break;
                    case 'var':{
                        collector.resetTimer();
                        await i.update({embeds: [embed_menu3], components:[row]})
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
            collector.on("end", () => {
                //desactivamos botones y editamos el mensaje
                embed_help.edit({content: "El tiempo ha expirado ⏳, utiliza denuevo el comando help  😊", components:[]}).catch(() => {});
                embed_help.suppressEmbeds(true);
            });

        }catch(e){
            message.reply({content: `**Ha ocurrido un error con help**`});
            return console.log(e);
        }
    }
}