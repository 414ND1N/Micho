const {EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    ALIASES: [],
    DESCRIPTION: "Sirve para mostrar el gif que se desee buscar",
    
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        let argumento = args[0]
        if (!argumento) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`Tienes que especificar que gif deseas buscar 🤨`)
                ]
            })
        }

        let busqueda = args.join(' ');

        let url_api = `https://tenor.googleapis.com/v2/search?q=${busqueda}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=15`;
        
        const response = await axios.get(url_api);
        let randomIndex = Math.floor(Math.random() * response.data.results.length);
        let gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`GIF por \`${message.author.username}\``)
                    .setDescription(`\`${busqueda}\``)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        })
        
    } 
} 