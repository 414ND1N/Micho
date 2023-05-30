const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Definición de un término del diccionario urbano.")
        .addStringOption(option =>
            option.setName("term")
                .setDescription('Término a buscar')
                .setRequired(true)
        ),
    async execute(client, interaction, prefix) {
        const term = interaction.options.getString("term");
        const query = new URLSearchParams({ term });
        const url_api = `https://api.urbandictionary.com/v0/define?${query}`;
        const response = await axios.get(url_api);

        const { list } = await response.data;

        if (!list.length) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`No se encontró resultados para **${term}**.`)
                        .setThumbnail("https://i.imgur.com/WHCwA6t.gifv")
                ],
                ephemeral: true
            })
        }

        const [answer] = list;

        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle(answer.word)
                .setURL(answer.permalink)
                .addFields(
                    { name: 'Definición', value: answer.definition.substring(0, 1024) }, 
                    { name: 'Ejemplo', value: answer.example.substring(0, 1024)}, 
                    { name: 'Valoración', value: `${answer.thumbs_up} pulgar arriba. ${answer.thumbs_down} pulgar abajo.` })
                .setThumbnail("https://i.imgur.com/LwPfwE5.jpg")
            ] 
        });

    }
}