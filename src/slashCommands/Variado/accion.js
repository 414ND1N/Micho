const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para hacer una acción a otro usuario")
    .addUserOption(option => 
        option.setName('usuario')
            .setDescription('Usuario al que se desea hacer acción 🧐')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('accion')
            .setDescription('Acción que se desea realizar')
            .addChoices(
                {name: "Abrazar", value:"cuddle"},
                {name: "Besar", value:"kiss"},
                {name: "Golpear", value:"punch"},
                {name: "Palmadas", value:"pat"},
                {name: "Mirar fijamente", value:"stare"},
                {name: "Bofetear", value:"slap"},
                {name: "Dar toques", value:"poke"},
                {name: "Presumir", value:"smug"},
                {name: "Lamer", value:"lick"},
                {name: "Pulgar arriba", value:"thumbsup"},
                {name: "Berrinche", value:"pout"},
                {name: "Sonrojar", value:"blush"}
            )
            .setRequired(true)
    ),
    
    async execute(client, interaction, prefix){
        const user = interaction.options.getUser('usuario');
        const busqueda = interaction.options.getString('accion');

        let texto_busqueda = 'hello';
        let opcion = 'saludó';

        switch(busqueda){
            case "cuddle":{
                texto_busqueda = 'cuddle';
                opcion = 'abrazó'
            }
                break;
            case "kiss":{
                texto_busqueda = 'kiss';
                opcion = 'besó'
            }
                break;
            case "punch":{
                texto_busqueda = 'punch';
                opcion = 'golpeó'
            }
                break;
            case "pat":{
                texto_busqueda = 'pat';
                opcion = 'dió palmadas'
            }
                break;
            case "stare":{
                texto_busqueda = 'stare';
                opcion = 'miró fijamente'
            }
                break;
            case "slap":{
                texto_busqueda = 'slap';
                opcion = 'abofeteó'
            }
                break;
            case "poke":{
                texto_busqueda = 'poke';
                opcion = 'dió toques'
            }
                break;
            case "smug":{
                texto_busqueda = 'smug';
                opcion = 'presumió'
            }
                break;
            case "lick":{
                texto_busqueda = 'lick';
                opcion = 'lamió'
            }
                break;
            case "thumbsup":{
                texto_busqueda = 'thumbsup';
                opcion = 'dió un pulgar arriba'
            }
                break;
            case "pout":{
                texto_busqueda = 'pout';
                opcion = 'hizó un berrinche'
            }
                break;
            case "blush":{
                texto_busqueda = 'blush';
                opcion = 'le sonrojó'
            }
                break;
            
        }

        let url_api = `https://tenor.googleapis.com/v2/search?q=anime-${texto_busqueda}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=30`;
        
        const response = await axios.get(url_api);
        let randomIndex = Math.floor(Math.random() * response.data.results.length);
        let gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];
        
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${interaction.user?.username} ${opcion} a ${user.username}\``)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        })
    }
} 