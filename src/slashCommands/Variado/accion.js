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
    
    async execute(client, interaction){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        //<#> Listas de opciones
        const lista_tipos_busqueda = [
            'zelda','pokemon','anime','adventure time','regular show','five nights at freddys'
        ]
        const lista_acciones = [
            {
                sub: "saludar",
                query: "saying hello",
                mensaje: "saludó a",
            },{
                sub: "felicitar",
                query: "congratulations",
                mensaje: "felicitó a",
            },{
                sub: "palmada",
                query: "pat",
                mensaje: "le dió una palamada a",
            },{
                sub: "tocar",
                query: "poke",
                mensaje: "tocó a",

            },{
                sub: "lamer",
                query: "lick",
                mensaje: "lamió a",
            },{
                sub: "pulgar",
                query: "thumbs up",
                mensaje: "le dió un pulgar arriba a",
            },{
                sub: "sonrojar",
                query: "blush",
                mensaje: "se sonrojó por",
            },{
                sub: "abrazar",
                query: "hug",
                mensaje: "abrazó a",
            },{
                sub: "besar",
                query: "kiss",
                mensaje: "besó a",
            },{
                sub: "abofetear",
                query: "slap",
                mensaje: "abofeteó a",
            },{
                sub: "golpear",
                query: "punch",
                mensaje: "golpeó a",
            },{
                sub: "guiño",
                query: "wink",
                mensaje: "guiñó a",
            },{
                sub: "muerte",
                query: "kill",
                mensaje: "quiere matar a",
            },{
                sub: "acariciar",
                query: "cuddle",
                mensaje: "acarició a",
            }
            
        ] 

        //<#> Datos de la interacción
        const SUB = interaction.options.getSubcommand(); // Subcomando
        const TIPO = interaction.options.getString('tipo') ?? get_random_option(); // Si no se especifica el tipo, se elige uno aleatorio

        // Usuario al que se le hará la acción
        const USUARIO = interaction.options.getUser('usuario'); // Usuario al que se le hará la acción
        const MEMBER = interaction.guild.members.cache.get(USUARIO?.id); // Objeto de miembro del usuario
        const USERNAME = MEMBER?.nickname || USUARIO?.username || 'todos'; // Apodo del usuario

        // Usuario que realiza la acción
        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario

        const accion_eligida = lista_acciones.find(accion => accion.sub == SUB); // Acción elegida

        if (accion_eligida == undefined) { // Si no se encuentra la acción, se cancela
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`No se encontró la acción seleccionada 🤨`)
                ]
            });
        }


        //<#> Busqueda de gif
        const query = `${TIPO} ${accion_eligida.query}`; // Busqueda en Tenor
        const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;
        
        const response = await axios.get(url_api);
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

        //<#> Respuesta
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${AUTHOR} ${accion_eligida.mensaje} ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        });

        function get_random_option(){
            const randomIndexOpts = Math.floor(Math.random() * lista_tipos_busqueda.length);
            return lista_tipos_busqueda[randomIndexOpts];
        }
    }
} 