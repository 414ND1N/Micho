const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Busqueda de gifs en tenor")
    .addStringOption(option =>
        option.setName("busqueda")
        .setDescription('Gif que deseas buscar 🔍')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){

        let busqueda = interaction.options.getString("busqueda");

        let url_api = `https://tenor.googleapis.com/v2/search?q=${new URLSearchParams({busqueda})}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=15`;
        
        const response = await axios.get(url_api);
        let randomIndex = Math.floor(Math.random() * response.data.results.length);
        let gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} envió un GIF.`)
                    .setColor(process.env.COLOR)
                    .setDescription(`\`${busqueda}\``)
                    .setImage(gif_url)
            ]
        })
    }
}