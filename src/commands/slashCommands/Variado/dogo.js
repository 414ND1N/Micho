const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("dogo")
        .setDescription("Foto aleatoria de un perro")
        .setDescriptionLocalizations({
            "en-US": "Random dog photo"
        }),

    async execute(interaction){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        const url_api = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(url_api);
        const img_url = response.data.message;

        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario
        
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${AUTHOR} envió un PERRO 🐶`)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
    }
}