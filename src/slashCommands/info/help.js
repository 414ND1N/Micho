const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver los comandos disponibles"),
    async execute(client, interaction, prefix){
        
        let btn_menu = new ButtonBuilder()
            .setCustomId('menu')
            .setLabel('Menú')
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`🏠`);
        
        let btn_info =  new ButtonBuilder()
            .setCustomId('info')
            .setLabel('Información')
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

        const row = new ActionRowBuilder().addComponents(btn_menu,btn_info,btn_music,btn_var);    

        const embed_menu = new EmbedBuilder()
        .setTitle('Menú')
        .setDescription(`Los comandos compatibles con **Toffu**, tanto con \`/\` o con \`tf.\``)
        .setColor(process.env.COLOR)
        .addFields(
            {name: `\`Información\``, value: `Comandos que brindan información del bot y/o servidor`},
            {name: `\`Música\``, value: `Comandos para reproducir música en el canal de voz que te encuentres conectado`},
            {name: `\`Variedad\``, value: `Comandos para funciónes miscelaneo`}
        ) 
        .setThumbnail("https://i.imgur.com/WHCwA6t.gif");

        const embed_menu1 = new EmbedBuilder()
            .setTitle('Información')
            .setDescription(`Comandos que brindan información del bot y/o servidor`)
            .setColor(`#3a7c21`)
            .addFields(
                {name: `help`, value:`Sirve para ver el menú de ayuda con los comandos`},
                {name: `ping`, value:`Sirve para ver el ping en ms de \`Toffu\``},
                {name: `pagina`, value:`Muestra el link de la pana página`},
                {name: `codigo`, value:`Muestra el link del repositorio con el código de \`Toffu\``}
            ) 
            .setThumbnail(`https://i.imgur.com/Ud2cXN5.jpg`);

        const embed_menu2 = new EmbedBuilder()
            .setTitle('Música')
            .setDescription(`Comandos para reproducir música en el canal de voz en el que te encuentres conectado`)
            .setColor(`#c72a2a`)
            .addFields(
                {name: `djpanas`, value:`Sirve para reproducir DJPANAS \n> Se puede elegir entre las distintas variaciones`},
                {name: `play`, value:`Sirve para reproducir una canción dada \n> Admite links de \`Youtube\`, \`Spotify\`, \`Soundcloud\` o \`nombres\``},
                {name: `pause`, value:`Sirve para pausar la música en reproducción`},
                {name: `skip`, value:`Sirve para saltar a la siguiente canción en la lista de reproducción`},
                {name: `previous`, value:`Sirve para saltar a la canción anterior en la lista de reproducción`},
                {name: `volume`, value:`Sirve para indicar el volumen de la canción \n> Admite de \`0%\` a \`200%\``},
                {name: `shuffle`, value:`Sirve para mezclar las canciónes de la lista`},
                {name: `queue`, value:`Sirve para ver la lista de canciones \n> Muestra un menú con botones de navegación`},
                {name: `jump`, value:`Sirve para saltar a una canción de la lista en reproducción \n> El número de canción se puede ver en la queue`},
                {name: `stop`, value:`Sirve para desconectar al bot de la sala de voz`}
            ) 
            .setThumbnail(`https://i.imgur.com/GLPfwSa.jpg`);

        const embed_menu3 = new EmbedBuilder()
            .setTitle('Variedad')
            .setDescription(`Comandos para funciónes miscelaneo`)
            .setColor(`#0c6bc2`)
            .addFields(
                {name: `decir`, value:`Sirve para que Toffu diga el texto dado`},
                {name: `elegir`, value:`Sirve para que Toffu eliga entre las opciones dadas \n> Las opciones se dan separadas por coma \`,\``},
                {name: `8ball`, value:`Sirve para que la bola 8 de una respuesta a una pregunta`},
                {name: `sugerir`, value:`Sirve para dar una sugerencia para poder votar`},
                {name: `accion`, value:`Sirve para dar una sugerencia para poder votar\n> Entre las acciones esta \`abrazar\`, \`besar\`, \`golpear\`, \`dar palmadas\`, \`mirar fijamente\`, \`bofetear\`, \`dar toques\`, \`presumir\`, \`lamer\`, \`pulgar arriba\`, \`berrinche\`, \`sonrojar\`.`},
                {name: `gif`, value:`Sirve para mostrar el gif que se desee buscar\n> Mostrara un gif aleatorio de \`tenor.com\``},
            ) 
            .setThumbnail(`https://i.imgur.com/s2lV0y5.png`);

        let embed_help = await interaction.channel.send({
            content: `**Navega con los _botones_ en el menú**`,
            embeds: [embed_menu],
            components: [row]
        });

        await interaction.reply('<:dudas:1061075189347123271> Lista de comandos');

        const collector = embed_help.createMessageComponentCollector({time: 30e3});  
        
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
                default:
                    break;
            }
        });
        collector.on("end", async () => {
            //desactivamos botones y editamos el mensaje
            embed_help.edit({content: "El tiempo ha expirado ⏳, utiliza denuevo el comando help  😊", components:[], ephemeral: true}).catch(() => {});
            embed_help.suppressEmbeds(true);
            await interaction.deleteReply();
        });
    }
}