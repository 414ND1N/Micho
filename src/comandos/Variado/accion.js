const {EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    ALIASES: ['action'],
    DESCRIPTION: "Sirve para hacer una acción a otro usuario",
    
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const userID = args[0]
        const busqueda = args[1].toLowerCase();

        if (!userID) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Debes colocar la ID o mencionar a alguien 😐`)
                ]
            })
        }

        const user = message.mentions.users.first();
        
        if (user === undefined) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription("No se encontró destinario, vuelve a intentarlo")
                ]
            })
        }

        if (!busqueda) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que especificar que gif deseas buscar 🤨`)
                ]
            })
        }
        
        let texto_busqueda = 'hello';
        let opcion = 'saludó';
        let descripciones = ['Y somos amigos (〃￣︶￣)人(￣︶￣〃)',`Tremendo csm ╰（‵□′）╯`, `Día troste （︶^︶）`, `¿Qué hacen estos dos? 😳`];
        let descripcion = descripciones[0]

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
                descripcion = descripciones[3]
            }
                break;
            case "punch":
            case "golpear":{
                texto_busqueda = 'punch';
                opcion = 'golpeó'
                descripcion = descripciones[1]
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
                descripcion = descripciones[1]
            }
                break;
            case "poke":
            case "toquetear":{
                texto_busqueda = 'poke';
                opcion = 'dió toques'
                descripcion = descripciones[1]
            }
                break;
            case "smug":
            case "presumir":{
                texto_busqueda = 'smug';
                opcion = 'presumió'
                descripcion = descripciones[1]
            }
                break;
            case "lick":
            case "lamer":{
                texto_busqueda = 'lick';
                opcion = 'lamió'
                descripcion = descripciones[3]
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
                descripcion = descripciones[2]
            }
                break;
            case "blush":
            case "sonrojar":
            case "ruborizar":{
                texto_busqueda = 'blush';
                opcion = 'le sonrojó'
                descripcion = descripciones[3]
            }
                break;
            default:{
            }   
                break;
            
        }

        let url_api = `https://tenor.googleapis.com/v2/search?q=anime-${texto_busqueda}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=25`;
        
        const response = await axios.get(url_api);
        let randomIndex = Math.floor(Math.random() * response.data.results.length);
        let gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${message.author.username} ${opcion} a ${user.username}\``)
                    .setDescription(`${descripcion}`)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        })
        
    } 
} 