const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para mostrar una foto aleatoria de un gato"),

    async execute(client, interaction, prefix){


        let url_api = `https://api.thecatapi.com/v1/images/search`;
        const response = await axios.get(url_api);
        let img_url = response.data[0].url;
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} envió un GATO`)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
    }
}