const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("ayuda")
        .setNameLocalizations({
            "en-US": "help"
        })
        .setDescription(`Listar los comandos disponibles de ${process.env.BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `List the available commands of ${process.env.BOT_NAME}`
        }),
    async execute(client, interaction){

        await interaction.deferReply() // Respuestas mayores a 3 segundos

        //Creacion de los embed
        const embed_menu = new EmbedBuilder()
            .setTitle('Menú')
            .setDescription(`Selecciona una categoría para ver los comandos disponibles`)
            .setColor(process.env.COLOR)
            .addFields(
                {name: `\`Información\``, value: `Comandos para pedir informacion sobre el bot o al grupo.`},
                {name: `\`Música\``, value: `Comandos para reproducir música en el canal de voz.`},
                {name: `\`Variedad\``, value: `Comandos para funciónes variadas.`}
            )
            .setThumbnail("https://i.imgur.com/xbzkVJh.gif")

        const embed_menu_informacion = new EmbedBuilder()
            .setTitle('Información')
            .setDescription(`Comandos que brindan información del bot y/o servidor`)
            .setColor(`#3a7c21`)
            .addFields(
                {name: `ayuda | help`, value:`Sirve para ver el menú de ayuda con los comandos.`},
                {name: `anime informacion | anime information`, value:`Sirve para ver la información de un anime dado.`},
                {name: `codigo | code`, value:`Muestra el link del repositorio con el código de \`${process.env.BOT_NAME}\`.`},
                {name: `diccionario | dictionary`, value:`Definición de un \`término\` del diccionario urbano.`},
                {name: `ping`, value:`Sirve para ver el ping en ms de \`${process.env.BOT_NAME}\`.`},
                {name: `pagina | page`, value:`Muestra el link de la pana página.`},
                {name: `preguntar grupo | ask group`, value:`Sirve para que destaque tu pregunta en el servidor.
                    > Podran reaccionar a tu pregunta.`},
                {name: `preguntar | ask ${process.env.BOT_NAME.toLocaleLowerCase()} | `, value:`Sirve para realizar una pregunta a ${process.env.BOT_NAME}.
                    > Te respondera con su inteligencia artificial.`},
            )  
            .setThumbnail(`https://i.imgur.com/Ud2cXN5.jpg`)

        const embed_menu_musica = new EmbedBuilder()
            .setTitle('Música')
            .setDescription(`Comandos para reproducir música.`)
            .setColor(`#c72a2a`)
            .addFields(
                {name: `djpanas`, value:`Sirve para reproducir DJPANAS.\n> Se puede elegir entre las distintas variaciones.`},
                {name: `\u200b`, value:`\`Estos comandos son subcomandos del comando principal music:\``},
                {name: `reproducir | pay`, value:`Sirve para reproducir una canción dada (link o nombre).\n
                    > Admite links de \`YouTube\`, \`Spotify\` y \`Soundcloud\`.`},
                {name: `detener | stop`, value:`Detiene la reproducción de la canción actual.`},
                {name: `reproduciendo | playing`, value:`Muestra información de la canción que se está reproduciendo.`},
                {name: `control | control`, value:`Entre las acciones que cuenta estan: \n
                    > \`Resumir\`, \`Pausar\`, \`Siguiente\`, \`Anterior\`, \`Detener\`, \`Mezclar\`.`},
                {name: `volumen | volume`, value:`Sirve para indicar el volumen de la canción.\n
                    > Admite de \`0%\` a \`200%\`.`},
                {name: `cola | queue`, value:`Sirve para ver la lista la música que está en la cola de reproducción.\n
                    > Muestra un menú con botones de navegación.`},
                {name: `saltar | jump`, value:`Sirve para saltar a una canción de la lista en reproducción.\n
                    > El número de canción se puede ver en la queue.`},
                {name: `repeticion | repeat`, value:`Sirve para cambiar el modo de repetición de la cola en reproducción.\n
                    > \`Cancion actual\`, \`Cola actual\`, \`Detener repéticion\`.`},
            )  
            .setThumbnail(`https://i.imgur.com/9PzViPP.jpg`)

        const embed_menu_variedad = new EmbedBuilder()
            .setTitle('Variedad')
            .setDescription(`Comandos de variedad.`)
            .setColor(`#0c6bc2`)
            .addFields(
                {name: `bola8 | 8ball`, value:`Sirve para que la bola 8 de una respuesta a una pregunta.`},
                {name: `accion | action `, value:`Sirve para hacer una acción a otro usuario.\n
                    > Entre las acciones esta \`saludar\`, \`felicitar\`, \`tocar\`, \`abrazar\`, \`besar\`, \`golpear\`,
                    \`dar palmadas\`, \`abofetear\`, \`lamer\`, \`pulgar arriba\`, \`sonrojar\`, \`guiñar\`, \`acariciar\`.\n
                    _Puedes indicar que tipo de imagen buscar_.`},
                {name: `amiibo`, value:`Sirve para mostrar información de amiibos
                    > Se indica el \`nombre\` del personaje a buscar.`},
                {name: `dogo`, value:`Sirve para mandar la imágen aleatoria de un perro.`},
                {name: `elegir opciones | choose options`, value:`Sirve para eligir entre las opciones dadas.\n
                    > Las opciones se dan separadas por coma \`,\`.`},
                {name: `elegir numero | choose number`, value:`Sirve paraeligir entre un rango dado.\n
                    >  Se indica rango inferior (si no se da se tomará como 0) y rango máximo.`},
                {name: `fortuna | fortune`, value:`Mensaje de la galleta de la fortuna.`},
                {name: `meme personalizado | meme custom`, value:`Crea un meme con tu propia imagen\n
                    > Se manda la \`url\` de tu imagen y los textos del meme separados por \`;\`.`},
                {name: `meme predefinido | meme predifined`, value:`Crea un meme con una plantilla\n
                > Se elige un tipo de \`plantilla\` y los textos del meme separados por \`;\`.`},
                {name: `micho | michi`, value:`Sirve para mandar la imágen aleatoria de un gato.`},
                {name: `minecraft servidor | minecraft server`, value:`Muestra informacion del \`panaserver\`.`},
                {name: `minecraft skin`, value:`Visualiza la skin de un jugador en específico.\n
                    > Los tipos de mostrar la skin son \`cuerpo\`, \`cabeza\`, \`busto\` o \`skin\`.`},
                {name: `pananoche alerta | alert`, value:`Sirve para mandar una alerta de el último en salir es jei\n
                    > Se manda en con un retraso random (se puede mandar el minimo y maximo de tiempo que puede toamr).`},
                {name: `pananoche ultimo | last`, value:`Cambia el rol de un usuario por ser el último en salir\n
                    > Agrega al usuario elegido y quita a los demás usuarios del rol si se indica.`},
                {name: `pokedex`, value:`Sirve para mostrar información de un pokemón según su id\n
                    > Disponible desde el pokemón \`1\` al \`1010\`.`},
                {name: `sugerir | suggest`, value:`Sirve para dar una sugerencia al \`canal de sugerencias\`.`},
                {name: `waifu`, value:`Sirve para mostrar la imagen de una waifu aleatoria.\n
                    > Se indica el \`tipo\` (sfw/nsfw) y la \`categoria\` segun el tipo.`},
            )
            .setThumbnail(`https://i.imgur.com/s2lV0y5.png`)
        
        //Creacion del dropdown para seleccionar el menu
        const select = new StringSelectMenuBuilder()
			.setCustomId('help-menu')
			.setPlaceholder('Selecciona una categoría')
			.addOptions(
                new StringSelectMenuOptionBuilder()
					.setLabel('Menú principal | Home menu')
					.setDescription('Menu principal de ayuda.')
					.setValue('menu')
                    .setEmoji(`🏠`),
				new StringSelectMenuOptionBuilder()
					.setLabel('información | information')
					.setDescription('Comandos que brindan información sobre el bot o el grupo.')
					.setValue('info')
                    .setEmoji(`💬`),
				new StringSelectMenuOptionBuilder()
					.setLabel('Música | Music')
					.setDescription('Comandos para reproducir música en el canal de voz.')
					.setValue('music')
                    .setEmoji(`🎶`),
				new StringSelectMenuOptionBuilder()
					.setLabel('Variedad | Variety')
					.setDescription('Comandos para funciones variadas.')
					.setValue('var')
                    .setEmoji(`✨`),
                new StringSelectMenuOptionBuilder()
					.setLabel('Salir | Exit')
					.setDescription('Cerrar el menú de ayuda.')
					.setValue('exit')
                    .setEmoji(`❌`),
			)

        const row = new ActionRowBuilder().addComponents(select) 
        
        //Creacion del Embed principal
        let embed_help = await interaction.channel.send({
            embeds: [embed_menu],
            components: [row],
            ephemeral: true
        })

        const collector = embed_help.createMessageComponentCollector({time: 60e3})  
        
        collector.on("collect", async (i) => {
            if(i?.user.id != interaction.user.id){
                return await i.reply({content: `❌ Solo quien uso el comando puede navegar entre categorías.`, ephemeral: true})
            }
            switch (i?.values[0]){
                case 'info':{
                    collector.resetTimer()
                    await i.update({embeds: [embed_menu_informacion], components:[row]})
                }
                    break
                case 'music':{
                    collector.resetTimer()
                    await i.update({embeds: [embed_menu_musica], components:[row]})
                }
                    break
                case 'var':{
                    collector.resetTimer()
                    await i.update({embeds: [embed_menu_variedad], components:[row]})
                }
                    break
                case 'exit':{
                    collector.stop()
                }
                    break
                default: {//Si no es ninguna de las opciones anteriores se envia el menu principal
                    collector.resetTimer()
                    await i.update({embeds: [embed_menu], components:[row]})
                }
                    break
            }
        })
        collector.on("end", async () => {
            //se actualiza el mensaje y se elimina la interacción
            embed_help.edit({content: "", embeds:[
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setThumbnail("https://i.imgur.com/oEqd4ju.gif")
            ], components:[], ephemeral: true}).catch(() => {})
            await interaction.deleteReply()
        })
    }
}