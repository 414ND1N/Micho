const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Foto aleatoria de un gato"),

    async execute(client, interaction, prefix){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        const url_api = `https://api.thecatapi.com/v1/images/search`;
        const response = await axios.get(url_api);
        const img_url = response.data[0].url;
        
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} envió un GATO`)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
    }
}