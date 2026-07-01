const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const { COLOR, COLOR_ERROR } = require('@/config')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("diccionario")
        .setNameLocalizations({
            "en-US": "dictionary"
        })
        .setDescription("Definición de un término del diccionario urbano.")
        .setDescriptionLocalizations({
            "en-US": "Definition of a term from the urban dictionary."
        })
        .addStringOption(option =>
            option.setName("termino")
                .setNameLocalizations({ "en-US": "term" })
                .setDescription('Término a buscar')
                .setDescriptionLocalizations({
                    "en-US": 'Term to search'
                })
                .setRequired(true)
        ),
    async execute(interaction) {

        await interaction.deferReply() // Defer para respuestas de más de 3 segundos

        const query = interaction.options.getString("termino")
        const url_api = `https://api.urbandictionary.com/v0/define?term=${query}`
        const response = await axios.get(url_api)

        const { list } = await response.data

        if (!list.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`No se encontró resultados para **${term}**.`)
                        .setThumbnail("https://i.imgur.com/WHCwA6t.gifv")
                ],
                ephemeral: true
            })
        }

        const [answer] = list

        interaction.editReply({ embeds: [
            new EmbedBuilder()
                .setColor(COLOR)
                .setTitle(answer.word)
                .setURL(answer.permalink)
                .addFields(
                    { name: 'Definición', value: answer.definition.substring(0, 1024) }, 
                    { name: 'Ejemplo', value: answer.example.substring(0, 1024)}, 
                    { name: 'Valoración', value: `${answer.thumbs_up} 👍 - ${answer.thumbs_down} 👎` })
                .setThumbnail("https://i.imgur.com/LwPfwE5.jpg")
            ] 
        })

    }
}