const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const minecraftServer = require('../../../schemas/minecraftServer')
const buttonPagination = require('../../../utils/buttonPagination')

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
                        .setNameLocalizations({
                            "en-US": "name"
                        })
                        .setDescription('Nombre del jugador')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
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
                .setNameLocalizations({
                    "en-US": "server"
                })
                .setDescription('Mira información del servidor de Pana Land')
                .setDescriptionLocalizations({
                    "en-US": "Get information from Pana Land server"
                })
        ),

    async execute(interaction) {
        //constantes
        const SUB = interaction.options.getSubcommand();

        switch (SUB) {
            case 'skin':

                await interaction.deferReply(); // Defer si la respuesta tarda más de 3 segundos

                const nombre = interaction.options.getString('nombre');
                //comprobar si viene tipo, si no, poner por defecto body
                const tipo = interaction.options.getString('tipo') == null ? 'body' : interaction.options.getString('tipo');

                let img_url = `https://mineskin.eu/armor/${tipo}/${nombre}.png`;

                //Si es helm o skin, cambiar el formato del URL
                if (tipo == 'helm' || tipo == 'skin') {
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
                try {

                    //Páginas
                    let embeds = []

                    const servers = await minecraftServer.find({})
                    if (!servers) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(process.env.COLOR_ERROR)
                                    .setDescription(`No se encontró información del servidor.`)
                                    .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
                            ]
                        })
                    }

                    servers.forEach(async (server) => {

                        // Obtener el registro guardado en la base de datos
                        const url_api = `https://api.mcsrvstat.us/2/${server.IP}`
                        const response = await axios.get(url_api)

                        if (response.data.length != 0) {
                            //Se encontró información del servidor
                            let embed = new EmbedBuilder()
                                .setColor(process.env.COLOR)
                                .setTitle(`Minecraft | \`${server.Nombre}\``)
                                .addFields(
                                    { name: 'Version', value: `${response.data.version} | ${response.data.software}`, inline: true },
                                    { name: 'Motd', value: `${response.data.motd.clean[0]}` },
                                    { name: `IP Java 1`, value: `${server.JavaIP}` },
                                    { name: `IP Java 2`, value: `${response.data.ip}:${response.data.port}` },
                                    { name: `IP y PORT Bedrock`, value: `${response.data.ip} - ${response.data.port}` },
                                )
                                .setThumbnail(server.IconUrl)
                                .setTimestamp()

                            // Si el servidor está online
                            if (response.data.online) {
                                embed.setDescription(`El servidor está online ✅`)
                                embed.addFields(
                                    { name: `Jugadores`, value: `${response.data.players.online} / ${response.data.players.max}`, inline: true },
                                )
                            } else {
                                embed.setDescription(`El servidor está offline ❌`)
                            }

                            embeds.push(embed)
                        }
                    })
                    await buttonPagination(interaction, embeds, 80_000, false)
                } catch (error) {
                    console.error(error)
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR_ERROR)
                                .setDescription(`Ocurrió un error al mostrar la información de los servidores`)
                        ]
                        , ephemeral: true
                    })
                }
        }
    }
}