const {EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    ALIASES: ['action','a'],
    DESCRIPTION: "Sirve para hacer una acción a otro usuario",
    
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const userID = args[0]
        const busqueda = args[1].toLowerCase();

        if (!userID) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`Debes colocar la ID o mencionar a alguien 😐`)
                ]
            })
        }

        const user = message.mentions.users.first();
        
        if (user === undefined) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription("No se encontró destinario, vuelve a intentarlo")
                ]
            })
        }

        if (!busqueda) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`Tienes que especificar que gif deseas buscar 🤨`)
                ]
            })
        }
        
        let texto_busqueda = 'hello';
        let opcion = 'saludó';

        switch(busqueda){
            case "cuddle":
            case "hug":
            case "abrazar":{
                texto_busqueda = 'cuddle';
                opcion = 'abrazó'
            }
                break;
            case "kiss":
            case "besar":{
                texto_busqueda = 'kiss';
                opcion = 'besó'
            }
                break;
            case "punch":
            case "golpear":{
                texto_busqueda = 'punch';
                opcion = 'golpeó'
            }
                break;
            case "pat":
            case "palmada":{
                texto_busqueda = 'pat';
                opcion = 'dió palmadas'
            }
                break;
            case "stare":
            case "mirar":{
                texto_busqueda = 'stare';
                opcion = 'miró fijamente'
            }
                break;
            case "slap":
            case "bofetear":{
                texto_busqueda = 'slap';
                opcion = 'abofeteó'
            }
                break;
            case "poke":
            case "toquetear":{
                texto_busqueda = 'poke';
                opcion = 'dió toques'
            }
                break;
            case "smug":
            case "presumir":{
                texto_busqueda = 'smug';
                opcion = 'presumió'
            }
                break;
            case "lick":
            case "lamer":{
                texto_busqueda = 'lick';
                opcion = 'lamió'
            }
                break;
            case "thumbsup":
            case "pulgararriba":{
                texto_busqueda = 'thumbsup';
                opcion = 'dió un pulgar arriba'
            }
                break;
            case "pout":
            case "berrinche":{
                texto_busqueda = 'pout';
                opcion = 'hizó un berrinche'
            }
                break;
            case "blush":
            case "sonrojar":
            case "ruborizar":{
                texto_busqueda = 'blush';
                opcion = 'le sonrojó'
            }
                break;
            default:{
            }   
                break;
            
        }

        const tipos = ['peppo', 'anime', 'adventure time'];
        const randomIndexOpts = Math.floor(Math.random() * tipos.length);
        const tipo_busqueda = tipos[randomIndexOpts];
        let url_api = `https://tenor.googleapis.com/v2/search?q=${tipo_busqueda}-${texto_busqueda}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=30`;
        
        const response = await axios.get(url_api);
        let randomIndex = Math.floor(Math.random() * response.data.results.length);
        let gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${message.author.username} ${opcion} a ${user.username}\``)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        })
        
    } 
} 