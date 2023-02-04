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
                {name: "Saludar", value:"hello"},
                {name: "Felicitar", value:"congratulation"},
                {name: "Sorprender", value:"surprise"},
                {name: "Abrazar", value:"cuddle"},
                {name: "Besar", value:"kiss"},
                {name: "Golpear", value:"punch"},
                {name: "Dar palmadas", value:"pat"},
                {name: "Mirar fijamente", value:"stare"},
                {name: "Abofetear", value:"slap"},
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

        let texto_busqueda = busqueda;
        let opcion = 'saludó';

        switch(busqueda){
            case "congratulation":{
                opcion = 'felicitó'
            }
                break;
            case "surprise":{
                opcion = 'sorprendió'
            }
                break;
            case "cuddle":{
                opcion = 'abrazó'
            }
                break;
            case "kiss":{
                opcion = 'besó'
            }
                break;
            case "punch":{
                opcion = 'golpeó'
            }
                break;
            case "pat":{
                opcion = 'dió palmadas'
            }
                break;
            case "stare":{
                opcion = 'miró fijamente'
            }
                break;
            case "slap":{
                opcion = 'abofeteó'
            }
                break;
            case "poke":{
                opcion = 'dió toques'
            }
                break;
            case "smug":{
                opcion = 'presumió'
            }
                break;
            case "lick":{
                opcion = 'lamió'
            }
                break;
            case "thumbsup":{
                opcion = 'dió un pulgar arriba'
            }
                break;
            case "pout":{
                opcion = 'hizó un berrinche'
            }
                break;
            case "blush":{
                opcion = 'le sonrojó'
            }
                break;
        };

        const tipos = ['peppo', 'anime', 'adventure time'];
        const randomIndexOpts = Math.floor(Math.random() * tipos.length);
        const tipo_busqueda = tipos[randomIndexOpts];
        let url_api = `https://tenor.googleapis.com/v2/search?q=${tipo_busqueda}-${texto_busqueda}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=35`;
        
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
        });
    }
} 