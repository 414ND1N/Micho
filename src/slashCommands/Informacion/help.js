const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Listar los comandos disponibles de Toffu"),
    async execute(client, interaction, prefix){

        await interaction.deferReply();

        let btn_menu = new ButtonBuilder()
            .setCustomId('menu')
            .setLabel('Menú')
            .setStyle(ButtonStyle.Success)
            .setEmoji(`🏠`);
        
        let btn_info =  new ButtonBuilder()
            .setCustomId('info')
            .setLabel('Información')
            .setStyle(ButtonStyle.Primary);

        let btn_music =  new ButtonBuilder()
            .setCustomId('music')
            .setLabel('Música')
            .setStyle(ButtonStyle.Primary);

        let btn_var =  new ButtonBuilder()
            .setCustomId('var')
            .setLabel('Variedad')
            .setStyle(ButtonStyle.Primary);

        let btn_salir =  new ButtonBuilder()
            .setCustomId('exit')
            .setLabel('❌ Salir')
            .setStyle(ButtonStyle.Danger);


        const row = new ActionRowBuilder().addComponents(btn_menu,btn_info,btn_music,btn_var,btn_salir);    

        const embed_menu = new EmbedBuilder()
            .setTitle('Menú')
            .setDescription(`Los comandos slash compatibles con **Toffu**, \`/\``)
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
                {name: `codigo`, value:`Muestra el link del repositorio con el código de \`Toffu\`.`},
                {name: `diccionario`, value:`Definición de un \`término\` del diccionario urbano.`},
                {name: `help`, value:`Sirve para ver el menú de ayuda con los comandos.`},
                {name: `ping`, value:`Sirve para ver el ping en ms de \`Toffu\`.`},
                {name: `pagina`, value:`Muestra el link de la pana página.`},
                {name: `pregunta grupo`, value:`Sirve para que destaque tu pregunta en el servidor.
                    > Podran reaccionar a tu pregunta.`},
                {name: `pregunta toffu`, value:`Sirve para realizar una pregunta a Toffu.
                    > Te respondera con su inteligencia artificial.`},
            )  
            .setThumbnail(`https://i.imgur.com/Ud2cXN5.jpg`);

        const embed_menu2 = new EmbedBuilder()
            .setTitle('Música')
            .setDescription(`Comandos para reproducir música en el canal de voz en el que te encuentres conectado`)
            .setColor(`#c72a2a`)
            .addFields(
                {name: `djpanas`, value:`Sirve para reproducir DJPANAS.\n> Se puede elegir entre las distintas variaciones.`},
                {name: `\u200b`, value:`Estos comandos son subcomandos del comando principal \`music\`:`},
                {name: `▪  reproducir`, value:`Sirve para reproducir una canción dada (link o nombre).\n
                    > Admite links de \`YouTube\`, \`Spotify\` y \`Soundcloud\`.`},
                {name: `▪  detener`, value:`Detiene la reproducción de la canción actual.`},
                {name: `▪  control`, value:`Entre las acciones que cuenta estan: \n
                    > \`Resumir\`, \`Pausar\`, \`Siguiente\`, \`Anterior\`, \`Mezclar\`,\`Detener\`.`},
                {name: `▪  volumen`, value:`Sirve para indicar el volumen de la canción.\n
                    > Admite de \`0%\` a \`200%\`.`},
                {name: `▪  cola`, value:`Sirve para ver la lista la música que está en la cola de reproducción.\n
                    > Muestra un menú con botones de navegación.`},
                {name: `▪  saltar`, value:`Sirve para saltar a una canción de la lista en reproducción.\n
                    > El número de canción se puede ver en la queue.`},
                {name: `▪  repetir`, value:`Sirve para cambiar el modo de repetición de la música en reproducción.\n
                    > Puede ser \`desactivado\`, \`canción actual\`, \`lista completa\`.`}
            )  
            .setThumbnail(`https://i.imgur.com/9PzViPP.jpg`);

        const embed_menu3 = new EmbedBuilder()
            .setTitle('Variedad')
            .setDescription(`Comandos para funciónes miscelaneo`)
            .setColor(`#0c6bc2`)
            .addFields(
                {name: `8ball`, value:`Sirve para que la bola 8 de una respuesta a una pregunta.`},
                {name: `accion`, value:`Sirve para hacer una acción a otro usuario.\n
                    > Entre las acciones esta \`saludar\`, \`felicitar\`, \`sorprender\`, \`abrazar\`, \`besar\`, \`golpear\`, \`dar palmadas\`, \`mirar fijamente\`, \`bofetear\`, \`dar toques\`, \`presumir\`, \`lamer\`, \`pulgar arriba\`, \`berrinche\`, \`sonrojar\`.\n
                    _Puedes indicar que tipo de imagen buscar_.`},
                {name: `amiibo`, value:`Sirve para mostrar información de amiibos
                    > Se indica el \`nombre\` del personaje a buscar.`},
                {name: `buscaminas`, value:`Sirve para jugar al buscaminas.
                    > Se indica el número de \`columnas\`, \`filas\` y la \`dificultad\` (en ese orden 😊).`},
                {name: `decir`, value:`Sirve para que Toffu diga el texto dado.`},
                {name: `elegir`, value:`Sirve para que Toffu eliga entre las opciones dadas.\n
                    > Las opciones se dan separadas por coma \`,\`.`},
                {name: `gif`, value:`Sirve para mostrar el gif que se desee buscar.\n
                    > Mostrara un gif aleatorio de \`tenor.com\`.`},
                {name: `image`, value:`Genera una imagen con el texto que reciba.\n
                    > Genera una imagen con un retraso de 5 segundos utilizando \`pollinations.ai\`.`},
                {name: `micho`, value:`Sirve para mandar la imágen aleatoria de un gato.`},
                {name: `minecraft servidor`, value:`Muestra informacion del \`panaserver\`.`},
                {name: `minecraft skin`, value:`Visualiza la skin de un jugador en específico.\n
                    > Los tipos de mostrar la skin son \`cuerpo\`, \`cabeza\`, \`busto\` o \`skin\`.`},
                {name: `pokedex`, value:`Sirve para mostrar información de un pokemón según su id\n
                    > Disponible desde el pokemón \`1\` al \`1010\`.`},
                {name: `sugerir`, value:`Sirve para dar una sugerencia al \`canal de sugerencias\`.`},
            )
            .setThumbnail(`https://i.imgur.com/s2lV0y5.png`);

        let embed_help = await interaction.channel.send({
            content: `**Navega con los _botones_ en el menú**`,
            embeds: [embed_menu],
            components: [row]
        });

        const collector = embed_help.createMessageComponentCollector({time: 60e3});  
        
        collector.on("collect", async (i) => {
            if(i?.user.id != interaction.user.id){
                return await i.reply({content: `❌ Solo quien uso el comando de queue puede navegar entre páginas`, ephemeral: true});
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
        collector.on("end", async () => {
            //desactivamos botones y editamos el mensaje
            embed_help.edit({content: "El tiempo ha expirado ⏳, utiliza denuevo el comando help 😊", components:[], ephemeral: true}).catch(() => {});
            embed_help.suppressEmbeds(true);
            await interaction.deleteReply();
        });
    }
}