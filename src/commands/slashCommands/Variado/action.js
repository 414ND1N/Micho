const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const axios = require('axios')
const { COLOR, COLOR_ERROR } = require('@/config')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("accion")
        .setNameLocalizations({
            "en-US": "action"
        })
        .setDescription("Acción a otro usuario")
        .setDescriptionLocalizations({
            "en-US": "Action to another user"
        })
        .addSubcommand(subcommand => 
            subcommand.setName('saludar')
                .setNameLocalizations({
                    "en-US": "greet"
                })
                .setDescription('Saluda a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Greet another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('felicitar')
                .setNameLocalizations({
                    "en-US": "congratulate"
                })
                .setDescription('Felicita a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Congratulate another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('palmada')
                .setNameLocalizations({
                    "en-US": "pat"
                })
                .setDescription('Dale palmadas a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Pat another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('tocar')
                .setNameLocalizations({
                    "en-US": "poke"
                })
                .setDescription('Darle toques a otro usuario')
                .setDescriptionLocalizations({
                    "en-US" : "Poke another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('lamer')
                .setNameLocalizations({
                    "en-US": "lick"
                })
                .setDescription('Lamer a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Lick another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('pulgar')
                .setNameLocalizations({
                    "en-US": "thumbsup"
                })
                .setDescription('Dale un pulgar arriba a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Give a thumbs up to another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('sonrojar')
                .setNameLocalizations({
                    "en-US": "blush"
                })
                .setDescription('Sonrojate por otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Blush for another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('abrazar')
                .setNameLocalizations({
                    "en-US": "hug"
                })
                .setDescription('Dale un abrazo a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Give a hug to another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('besar')
                .setNameLocalizations({
                    "en-US": "kiss"
                })
                .setDescription('Dale un beso a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Give a kiss to another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('abofetear')
                .setNameLocalizations({
                    "en-US": "slap"
                })
                .setDescription('Dale una bofetada a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Slap another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('golpear')
                .setNameLocalizations({
                    "en-US": "punch"
                })
                .setDescription('Dale un golpe a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Punch another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('guiño')
                .setNameLocalizations({
                    "en-US": "wink"
                })
                .setDescription('Dale un guiño a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Wink at another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('acariciar')
                .setNameLocalizations({
                    "en-US": "cuddle"
                })
                .setDescription('Acariciar a otro usuario')
                .setDescriptionLocalizations({
                    "en-US": "Cuddle another user"
                })
                .addUserOption(option => 
                    option.setName('usuario')
                        .setNameLocalizations({
                            "en-US": "user"
                        })
                        .setDescription('Usuario al que se desea hacer la acción')
                        .setDescriptionLocalizations({
                            "en-US": 'User to whom you want to do the action'
                        })
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": "type"
                        })
                        .setDescription('Tipo de imagenes para enviar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of images to send'
                        })
                )
        ),
    
    async execute(interaction){

        await interaction.deferReply() // Defer para respuestas de más de 3 segundos

        //<#> Listas de opciones
        const types_list = [
            'zelda','pokemon','anime','adventure time','regular show','five nights at freddys'
        ]
        const actions_list = [
            // Español
            {
                sub: "saludar",
                query: "greet",
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
                sub: "acariciar",
                query: "cuddle",
                mensaje: "acarició a",
            }
        ] 

        //<#> Datos de la interacción
        const SUB = interaction.options.getSubcommand() // Subcomando
        const TIPO = interaction.options.getString('tipo') || types_list[Math.floor(Math.random() * types_list.length)]// Si no se especifica el tipo, se elige uno aleatorio

        // Usuario al que se le hará la acción
        const USUARIO = interaction.options.getUser('usuario') // Usuario al que se le hará la acción
        const MEMBER = interaction.guild.members.cache.get(USUARIO?.id) // Objeto de miembro del usuario
        const USERNAME = MEMBER?.nickname || USUARIO?.username || 'todos' // Apodo del usuario

        // Usuario que realiza la acción
        const AUTHOR = interaction.member?.nickname?? interaction.user.username // Si no tiene apodo, se usa el nombre de usuario

        const accion_eligida = actions_list.find(accion => accion.sub == SUB) // Acción elegida

        if (accion_eligida == undefined) { // Si no se encuentra la acción, se cancela
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`No se encontró la acción seleccionada 🤨`)
                ]
            })
        }

        //<#> Busqueda de gif
        const query = `${TIPO} ${accion_eligida.query}` // Busqueda en Tenor
        const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`
        
        const response = await axios.get(url_api)
        const randomIndex = Math.floor(Math.random() * response.data.results.length)
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"]

        //<#> Respuesta
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${AUTHOR} ${accion_eligida.mensaje} ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                    .setColor(COLOR)
                    .setImage(gif_url)
            ]
        })
    }
} 