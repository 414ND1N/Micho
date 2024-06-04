const {EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    ALIASES: ["cat","gato","michi"],
    DESCRIPTION: "Sirve para mostrar una foto aleatoria de un gato",
    
    async execute(client, message, args, prefix){

        let url_api = `https://api.thecatapi.com/v1/images/search`;
        const response = await axios.get(url_api);
        let img_url = response.data[0].url;
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${message.author.username}\` envió un GATO`)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
        
    } 
} 