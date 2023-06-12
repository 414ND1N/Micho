const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Acción a otro usuario")
    .addStringOption(option =>
        option.setName('accion')
            .setDescription('Acción que se desea realizar')
            .addChoices(
                {name: "Saludar", value:"waving"},
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
    )
    .addUserOption(option => 
        option.setName('usuario')
            .setDescription('Usuario al que se desea hacer la acción')
    )
    .addStringOption(option =>
        option.setName('tipo')
            .setDescription('Tipo de imagenes para enviar')
    ),
    
    async execute(client, interaction, prefix){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        const user = interaction.options.getUser('usuario');
        const accion = interaction.options.getString('accion');
        const type = interaction.options.getString('tipo');
        
        let texto_accion = 'saludó';

        switch(accion){
            case "congratulation":{
                texto_accion = 'felicitó'
            }
                break;
            case "surprise":{
                texto_accion = 'sorprendió'
            }
                break;
            case "cuddle":{
                texto_accion = 'abrazó'
            }
                break;
            case "kiss":{
                texto_accion = 'besó'
            }
                break;
            case "punch":{
                texto_accion = 'golpeó'
            }
                break;
            case "pat":{
                texto_accion = 'dió palmadas'
            }
                break;
            case "stare":{
                texto_accion = 'miró fijamente'
            }
                break;
            case "slap":{
                texto_accion = 'abofeteó'
            }
                break;
            case "poke":{
                texto_accion = 'dió toques'
            }
                break;
            case "smug":{
                texto_accion = 'presumió'
            }
                break;
            case "lick":{
                texto_accion = 'lamió'
            }
                break;
            case "thumbsup":{
                texto_accion = 'dió un pulgar arriba'
            }
                break;
            case "pout":{
                texto_accion = 'hizó un berrinche'
            }
                break;
            case "blush":{
                texto_accion = 'le sonrojó'
            }
                break;
        };

        let tipo_busqueda = type;
        if (!tipo_busqueda){
            const tipos = ['zelda','pokemon','anime', 'adventure time', 'regular show'];
            const randomIndexOpts = Math.floor(Math.random() * tipos.length);
            tipo_busqueda = tipos[randomIndexOpts];
        }
        
        const query = `${tipo_busqueda} ${accion}`;
        const url_api = `https://tenor.googleapis.com/v2/search?q=${new URLSearchParams({query})}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=15`;
        
        const response = await axios.get(url_api);
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

        if(user == undefined) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`\`${interaction.user.username} ${texto_accion} a todos.\``)
                        .setColor(process.env.COLOR)
                        .setImage(gif_url)
                ]
            });
        }
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${interaction.user.username} ${texto_accion} a ${user.username}.\``)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        });
    }
} 