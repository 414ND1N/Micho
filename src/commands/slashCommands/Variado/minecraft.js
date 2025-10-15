const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const minecraftServer = require('../../../schemas/minecraftServer')
const buttonPagination = require('../../../utils/buttonPagination')

module.exports = {
    cooldown: 15,
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
                        .setDescription('Tipo de visualización de la skin')
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
                            .setColor(Number(process.env.COLOR))
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
                    if (!servers || servers.length === 0) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Number(process.env.COLOR_ERROR))
                                    .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
                            ]
                        })
                    }

                    for (const server of servers) {
                        try {
                            const url_api = `https://api.mcsrvstat.us/2/${server.IP}`
                            const response = await axios.get(url_api)
                            const data = response && response.data ? response.data : {}

                            // Si no hay datos relevantes, saltar
                            if (!Object.keys(data).length) continue

                            // Valores seguros / fallback
                            const version = (data.version ?? '').toString()
                            const software = (data.software ?? '').toString()
                            const motd = (data.motd && Array.isArray(data.motd.clean) && data.motd.clean[0]) ? data.motd.clean[0].toString() : 'N/A'
                            const ip = (data.ip ?? 'N/A').toString()
                            const port = (data.port ?? 'N/A').toString()
                            const javaIP = (server.JavaIP ?? 'N/A').toString()
                            const icon = (server.IconUrl ?? null)

                            let embed = new EmbedBuilder()
                                .setColor(Number(process.env.COLOR))
                                .setTitle(`Minecraft | \`${String(server.Nombre ?? 'Servidor')}\``)
                                .addFields(
                                    { name: 'Version', value: `${version} | ${software}`, inline: true },
                                    { name: 'Motd', value: motd },
                                    { name: `IP Java 1`, value: javaIP },
                                    { name: `IP Java 2`, value: `${ip}:${port}` },
                                    { name: `IP y PORT Bedrock`, value: `${ip} - ${port}` },
                                )
                                .setTimestamp()

                            if (icon) embed.setThumbnail(icon)

                            if (data.online) {
                                const playersOnline = (data.players && (data.players.online ?? '0')).toString()
                                const playersMax = (data.players && (data.players.max ?? '0')).toString()
                                embed.setDescription('El servidor está online ✅')
                                embed.addFields({ name: 'Jugadores', value: `${playersOnline} / ${playersMax}`, inline: true })
                            } else {
                                embed.setDescription('El servidor está offline ❌')
                            }

                            embeds.push(embed)
                        } catch (err) {
                            console.error('Error al consultar servidor', server, err)
                            // continuar con el siguiente servidor
                        }
                    }

                    if (embeds.length === 0) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Number(process.env.COLOR_ERROR))
                                    .setDescription('No se encontró información válida de los servidores.')
                            ],
                            ephemeral: true
                        })
                    }

                    await buttonPagination(interaction, embeds, 80_000, false)
                } catch (error) {
                    console.error(error)
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(process.env.COLOR_ERROR))
                                .setDescription(`Ocurrió un error al mostrar la información de los servidores`)
                        ]
                        , ephemeral: true
                    })
                }
        }
    }
}