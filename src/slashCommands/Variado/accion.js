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
        const USUARIO = interaction.options.getUser('usuario'); // Usuario al que se le hará la acción
        const TIPO = interaction.options.getString('tipo') ?? get_random_option(); // Si no se especifica el tipo, se elige uno aleatorio
        
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
                            .setTitle(`\`${interaction.user.username} saludó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} felicitó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} le dió una palamada a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} tocó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} lamió a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} le dió un pulgar arriba a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} se sonrojó por ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} abrazó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} besó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} abofeteó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} golpeó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} guiñó a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} le desea la muerte a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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
                            .setTitle(`\`${interaction.user.username} acarició a ${USUARIO?.username??'todos'}.\``) // Si no se especifica usuario, se indica a todos
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