const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("minecraft")
        .setDescription("Obtiene información de Minecraft")
        .setDescriptionLocalizations({
            "en-US": "Get Minecraft information"
        })
        .addSubcommand(subcommand =>
            subcommand.setName('skin')
                .setDescription('Visualiza la skin de un jugador en específico')
                .setDescriptionLocalizations({
                    "en-US": "Visualize the skin of a specific player"
                })
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del jugador')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setDescription('Tipo en la que se visualizará la skin')
                        .setDescriptionLocalizations({
                            "en-US": "Type in which the skin will be displayed"
                        })
                        .addChoices(
                            { name: 'Cuerpo', value: 'body' },
                            { name: 'Cabeza', value: 'helm' },
                            { name: 'Busto', value: 'bust' },
                            { name: 'Skin', value: 'skin' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('servidor')
                .setDescription('Mira información del servidor de Pana Land')
                .setDescriptionLocalizations({
                    "en-US": "Get information from Pana Land server"
                })
        ),

    async execute(client, interaction) {

        await interaction.deferReply(); // Defer si la respuesta tarda más de 3 segundos

        //constantes
        const SUB = interaction.options.getSubcommand();

        switch (SUB) {
            case 'skin':
                const nombre = interaction.options.getString('nombre');
                //comprobar si viene tipo, si no, poner por defecto body
                const tipo = interaction.options.getString('tipo') == null ? 'body' : interaction.options.getString('tipo');

                let img_url = `https://mineskin.eu/armor/${tipo}/${nombre}.png`;

                //Si es helm o skin, cambiar el formato del URL
                if(tipo == 'helm' || tipo == 'skin'){
                    img_url = `https://mineskin.eu/${tipo}/${nombre}.png`;
                }

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setTitle(`Minecraft | Skin de \`${nombre}\``)
                            .setImage(img_url) // Nombre del archivo adjunto
                    ]
                })

            case 'servidor':
                //USO DE API: api.mcsrvstat.us

                const url_api = `https://api.mcsrvstat.us/2/${process.env.MINECRAFT_IP}`;
                const response = await axios.get(url_api);

                if(response.data.length == 0){ // Si no se encuentra ningún anime con el nombre, se envía un mensaje de error
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`No se encontró información del servidor.`)
                            .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
                        ]
                    })
                }

                //Si el servidor está online
                if(response.data.online){ 
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR)
                                .setTitle(`Minecraft | \`Panaserver\``)
                                .setDescription(`El servidor está online ✅`)
                                .addFields(
                                    { name: 'Version', value: `${response.data.version} | ${response.data.software}`, inline: true},
                                    { name: `Jugadores`, value: `${response.data.players.online} / ${response.data.players.max}`, inline: true},
                                    { name: 'Motd', value: `${response.data.motd.clean[0]}`},
                                    { name: `IP Java`, value: `${process.env.MINECRAFT_IP}`},
                                    { name: `IP y PORT Bedrock`, value: `${response.data.ip} - ${response.data.port}`},
                                    
                                )
                                .setThumbnail('https://i.imgur.com/hLOfOwk.png')
                                .setURL(process.env.MINECRAFT_SERVER_PAGE)
                        ]
                    })

                }

                //Si el servidor está offline
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle(`Minecraft | \`Panaserver\``)
                            .setDescription(`El servidor está offline ❌`)
                            .addFields(
                                { name: 'Version', value: `${response.data.version} | ${response.data.software}`, inline: true},
                                { name: `IP Java`, value: `${process.env.MINECRAFT_IP}`},
                                { name: `IP y PORT Bedrock`, value: `${response.data.ip} - ${response.data.port}`},
                            )
                            .setThumbnail('https://i.imgur.com/hLOfOwk.png')
                            .setURL(process.env.MINECRAFT_SERVER_PAGE)
                    ]
                })
                
            default:
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle(`Subcomando no encontrado`)
                    ]
                })
        }
    }
}