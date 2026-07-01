const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const buttonPagination = require('@/utils/button_pagination')
const axios = require('axios')
const { COLOR_ERROR } = require('@/config')

module.exports = {
    cooldown: 10,
    CMD: new SlashCommandBuilder()
        .setName("amiibo")
        .setNameLocalizations({
            "en-US": "amiibo"
        })
        .setDescription("Mostrar información de amiibos")
        .setDescriptionLocalizations({
            "en-US": "Show amiibo information"
        })
        .addStringOption(option =>
            option.setName("personaje")
                .setNameLocalizations({
                    "en-US": "character"
                })
                .setDescription('Personaje a buscar amiibos 🔍')
                .setDescriptionLocalizations({
                    "en-US": "Character to search for amiibos 🔍"
                })
                .setRequired(true)
        ),
    async execute(interaction) {

        try {
            //USO DE LA API github.com/N3evin/AmiiboAPI

            const character = interaction.options.getString("personaje")
            const url_api = `https://amiiboapi.com/api/amiibo/?character=${character}`
            let response = null

            //Verificar si existe el amiibo
            try {
                response = await axios.get(url_api)
            } catch (error) {
                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(`No se encontró ningún amiibo de \`${character}\``)
                    ],
                    ephemeral: true
                })
            }
            
            const amiibos = response.data.amiibo

            if (amiibos.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(COLOR_ERROR)
                            .setDescription(`No se encontró ningún amiibo de \`${character}\``)
                    ],
                    ephemeral: true
                })
            }

            await interaction.channel.sendTyping()

            //Páginas
            var embeds = []

            amiibos.forEach(async amiibo => {
                //Agregar pagina al array embeds
                embeds.push(
                    new EmbedBuilder()
                        .setTitle(`Amiibo | \`${amiibo.name}\``)
                        .setImage(amiibo.image)
                        .addFields(
                            { name: `Serie`, value: `\`${amiibo.amiiboSeries}\``, inline: true},
                            { name: `Videojuego`, value: `\`${amiibo.gameSeries}\``, inline: true},
                            { name: `Tipo`, value: `\`${amiibo.type}\``, inline: true },
                            { name: 'EU', value: `\`${amiibo.release.eu??'s/d'}\``, inline: true},
                            { name: 'JP', value: ` \`${amiibo.release.jp??'s/d'}\``, inline: true},
                            { name: 'NA', value: ` \`${amiibo.release.na??'s/d'}\``, inline: true},
                        )
                        .setColor("Random")
                )
            })

            await buttonPagination(interaction, embeds, 80_000, false)
        } catch (error) {
            console.error(error)
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Ocurrió un error al mostrar la información de amiibos`)
                ]
                , ephemeral: true
            })
        }
    }
}