const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const { ModalBuilder, TextInputBuilder, TextInputStyle , LabelBuilder } = require('discord.js')
const { ErrorEmbed } = require('@/utils/predifined_components')
const axios = require('axios')
const { COLOR, COLOR_ERROR } = require('@/config')
const { PEEPO_DOUBT } = require('@/images')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("Descubre sobre anime")
        .setDescriptionLocalizations({
            "en-US": "Discover about anime"
        })
    ,

    async execute(interaction) {

        // Modal para ingresar el nombre del anime
        const customModalId = `animeModal-${interaction.user.id}`

        const searchInputModal = new ModalBuilder()
            .setTitle('Anime')
            .setCustomId(customModalId)

        const anime_input = new TextInputBuilder()
            .setCustomId('animeInput')
            .setMaxLength(50)
            .setMinLength(3)
            .setRequired(true)
            .setPlaceholder('Ingrese el nombre del anime')
            .setStyle(TextInputStyle.Short)
            .setValue('Naruto')

        const input_label = new LabelBuilder()
            .setLabel('Nombre del anime')
            .setTextInputComponent(anime_input)

        searchInputModal.addLabelComponents(input_label)
        await interaction.showModal(searchInputModal)

        // Esperar respuesta
        const filter = (interaction) => interaction.customId === customModalId

        interaction
            .awaitModalSubmit({ filter, time: 20_000 })
            .then(async (modalInteraction) => {
                const nombreAnime = modalInteraction.fields.getTextInputValue('animeInput')
                const url_api = `https://api.jikan.moe/v4/anime?q=${nombreAnime}&sfw`
                const response = await axios.get(url_api)

                if (response.data.data.length == 0) { // Si no se encuentra ningún anime con el nombre, se envía un mensaje de error
                    return modalInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(COLOR_ERROR)
                                .setDescription(`No se encontró ningún anime con el nombre\n \`${nombreAnime}\``)
                                .setThumbnail(PEEPO_DOUBT)
                        ]
                    })
                }
                const title = response.data.data[0].title
                const title_japanese = response.data.data[0].title_japanese
                const url_anime = response.data.data[0].url
                const rank = response.data.data[0].rank
                const episodes = response.data.data[0].episodes
                const year = response.data.data[0].year
                const status = response.data.data[0].status
                const source = response.data.data[0].source
                const synopsis = response.data.data[0].synopsis
                const synopsisFormated = synopsis?.length <= 1000 ? synopsis : synopsis.slice(0, 1000) + ' ...' // Si la sinopsis es mayor a 1024 caracteres, se corta y se agrega '...'
                const genres = response.data.data[0].genres.map(genre => genre.name).join(', ')
                const themes = response.data.data[0].themes.map(theme => theme.name).join(', ')
                const score = response.data.data[0].score
                const scored_by = response.data.data[0].scored_by
                const image_url = response.data.data[0].images.webp.image_url
                const rating = response.data.data[0].rating

                modalInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Anime | \`${title} - ${title_japanese}\` `)
                            .setThumbnail(image_url)
                            .addFields(
                                { name: `Top AnimeList`, value: `${rank}`, inline: true },
                                { name: `Episodios`, value: `${episodes}`, inline: true },
                                { name: `Año salida`, value: `${year}`, inline: true },
                                { name: `Estado`, value: `${status}`, inline: true },
                                { name: `Fuente`, value: `${source}`, inline: true },
                                { name: `Rating`, value: `${rating}`, inline: true },
                                { name: `Temas`, value: `${themes}`, inline: true },
                                { name: `Generos`, value: `${genres}`, inline: true },
                                { name: `Sinopsis`, value: `${synopsisFormated}` },
                            )
                            .setURL(url_anime)
                            .setFooter({ text: `Puntuación ${score}/10 por ${scored_by} usuarios` })
                            .setColor(COLOR)
                    ]
                })
            })
            .catch(async (e) => {
                interaction.followUp({
                    embeds: [ErrorEmbed(e)],
                    ephemeral: true
                })
            })
    }
}