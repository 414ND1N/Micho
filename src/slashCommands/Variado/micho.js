const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("micho")
        .setNameLocalizations({
            "en-US": "michi"
        })
        .setDescription("Foto aleatoria de un gato")
        .setDescriptionLocalizations({
            "en-US": "Random cat photo"
        }),

    async execute(client, interaction){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        const url_api = `https://api.thecatapi.com/v1/images/search`;
        const response = await axios.get(url_api);
        const img_url = response.data[0].url;
        
        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${AUTHOR} envió un GATO 🐱`)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
    }
}