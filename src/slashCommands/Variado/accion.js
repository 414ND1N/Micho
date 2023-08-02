const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Acción a otro usuario")
    .addSubcommand(subcommand => 
        subcommand.setName('saludar')
        .setDescription('Saluda a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('felicitar')
        .setDescription('Felicita a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('palmada')
        .setDescription('Dale palmadas a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('tocar')
        .setDescription('Darle toques a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('lamer')
        .setDescription('Lamer a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('pulgar')
        .setDescription('Dale un pulgar arriba a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('sonrojar')
        .setDescription('Sonrojate por otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('abrazar')
        .setDescription('Dale un abrazo a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('besar')
        .setDescription('Dale un beso a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('abofetear')
        .setDescription('Dale una bofetada a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('golpear')
        .setDescription('Dale un golpe a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('guiño')
        .setDescription('Dale un guiño a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('muerte')
        .setDescription('Desearle la muerte a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('acariciar')
        .setDescription('Acariciar a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que se desea hacer la acción')
        )
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de imagenes para enviar')
        )
    ),
    
    async execute(client, interaction, prefix){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        const SUB = interaction.options.getSubcommand(); // Subcomando
        const TIPO = interaction.options.getString('tipo') ?? get_random_option(); // Si no se especifica el tipo, se elige uno aleatorio

        // Usuario al que se le hará la acción
        const USUARIO = interaction.options.getUser('usuario'); // Usuario al que se le hará la acción
        const MEMBER = interaction.guild.members.cache.get(USUARIO?.id); // Objeto de miembro del usuario
        const USERNAME = MEMBER?.nickname || USUARIO?.username || 'todos'; // Apodo del usuario

        // Usuario que realiza la acción
        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario
        
        switch(SUB){
            case 'saludar':{
                const query = `${TIPO} saying hello`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} saludó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'felicitar':{
                const query = `${TIPO} congratulations`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} felicitó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'palmada':{
                const query = `${TIPO} pat`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} le dió una palamada a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'tocar':{
                const query = `${TIPO} poke`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} tocó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'lamer':{
                const query = `${TIPO} lick`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} lamió a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'pulgar':{
                const query = `${TIPO} thumbs up`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} le dió un pulgar arriba a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'sonrojar':{
                const query = `${TIPO} blush`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} se sonrojó por ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'abrazar':{
                const query = `${TIPO} hug`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} abrazó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'besar':{
                const query = `${TIPO} kiss`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} besó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'abofetear':{
                const query = `${TIPO} slap`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} abofeteó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'golpear':{
                const query = `${TIPO} punch`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} golpeó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'guiño':{
                const query = `${TIPO} wink`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} guiñó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'muerte':{
                const query = `${TIPO} kill`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} quiere matar a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            case 'acariciar':{
                const query = `${TIPO} cuddle`; // Busqueda en Tenor
                const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
                
                const response = await axios.get(url_api);
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR} acarició a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                            .setColor(process.env.COLOR)
                            .setImage(gif_url)
                    ]
                });
            } break;
            default:{
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle(`Subcomando no encontrado`)
                    ]
                });
            }
            
        };

        function get_random_option(){
            const tipos = ['zelda','pokemon','anime', 'adventure time', 'regular show'];
            const randomIndexOpts = Math.floor(Math.random() * tipos.length);
            return tipos[randomIndexOpts];
        }
    }
} 