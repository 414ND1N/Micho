const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Genera tu propio meme con plantillas")
        .setDescriptionLocalizations({
            "en-US": "Generate your own meme with templates"
        })
        .addSubcommand(subcommand =>
            subcommand.setName('predefinido')
                .setNameLocalizations({
                    "en-US": "predefined"
                })
                .setDescription('Crea un meme con una plantilla')
                .setDescriptionLocalizations({
                    "en-US": "Create a meme with a template"
                })
                .addStringOption(option =>
                    option.setName('plantilla')
                        .setNameLocalizations({
                            "en-US": "template"
                        })
                        .setDescription('Tipo de plantilla que se usara')
                        .setDescriptionLocalizations({
                            "en-US": "Type of template to use"
                        })
                        .setRequired(true)
                        .addChoices(
                            { name: 'Change My Mind', value: "cmm" },
                            { name: 'It\'s A Trap!', value: "ackbar" },
                            { name: 'Siempre lo fue', value: "astronaut" },
                            { name: 'Buzz Everywhere', value: "buzz" },
                            { name: 'Capitan America Elevador', value: "captain-america" },
                            { name: 'Bugs Bunny Comunista', value: "cbb" },
                            { name: 'Cheems', value: "cheems" },
                            { name: 'Lloranto en el suelo', value: "cryingfloor" },
                            { name: 'Novio distraido', value: "db" }, //3 lines
                            { name: 'Expectativa vs realidad', value: "dbg" }, //2 lines
                            { name: 'Eleccion', value: "ds" }, //3 lines
                            { name: 'Elmo cocaina', value: "elmo" },
                            { name: 'Eligiendo camino', value: "exit" },
                            { name: 'Todo esta bien', value: "fine" },
                            { name: 'Pain Harold', value: "harold" },
                            { name: 'A ustedes les pagan ?', value: "millers" },
                            { name: 'Mini Keanu', value: "mini-keanu" },
                            { name: 'Toma mi dinero', value: "money" },
                            { name: 'Panico - Calma', value: "panik-kalm-panik" },
                            { name: 'Poh fino', value: "pooh" },
                            { name: 'Spiderman apuntando', value: "spiderman" },
                            { name: 'Stonks', value: "stonks" },
                            { name: 'Mujer gritando a gato', value: "woman-cat" },
                            { name: 'Buena idea', value: "rollsafe" }
                        )
                )
                .addStringOption(option =>
                    option.setName('textos')
                        .setNameLocalizations({
                            "en-US": "texts"
                        })
                        .setDescription('Texto que se pondra en la plantilla del meme separado por punto y coma (;)')
                        .setDescriptionLocalizations({
                            "en-US": 'Text to be placed on the meme template separated by semicolon (;)'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('personalizado')
                .setNameLocalizations({
                    "en-US": "custom"
                })
                .setDescription('Crea un meme con tu propia imagen')
                .setDescriptionLocalizations({
                    "en-US": "Create a meme with your own image"
                })
                .addStringOption(option =>
                    option.setName('imagen')
                        .setDescription('URL de la imagen que se usara')
                        .setDescriptionLocalizations({
                            "en-US": "Image URL to use"
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('textos')
                        .setNameLocalizations({
                            "en-US": "texts"
                        })
                        .setDescription('Texto que se pondra en la plantilla del meme separado por punto y coma (;)')
                        .setDescriptionLocalizations({
                            "en-US": 'Text to be placed on the meme template separated by semicolon (;)'
                        })
                        .setRequired(true)
                )
        )
    ,

    async execute(interaction) {

        await interaction.deferReply() // Defer para respuestas de más de 3 segundos

        const TEXTO_ENTRADA = interaction.options.getString('textos') //Texto de entrada

        const remplazos = {
            "?": "~q",
            "&": "~a",
            "%": "~p",
            "#": "~h",
            "/": "~s",
            "\\": "~b",
            "<": "~l",
            ">": "~g",
            "\"": "''''",
        }
        
        const textoProcesado = TEXTO_ENTRADA.split(';')
        .map(text => ( //Remplazar caracteres especiales 
            text.replace(/[\?&%#\/\\<>"]/g, match => remplazos[match]).replace(/\s/g, "_") 
        ))
        .join('/')

        const AUTHOR = interaction.member?.nickname?? interaction.user.username // Si no tiene apodo, se usa el nombre de usuario

        switch (interaction.options.getSubcommand()) {
            case 'predefinido':

                const ID_PLANTILLA = interaction.options.getString('plantilla')
        
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR}\` envió un meme`)
                            .setColor(process.env.COLOR)
                            .setImage(`https://api.memegen.link/images/${ID_PLANTILLA}/${textoProcesado}.png`)
                            .setFooter({text: 'Creado con memegen.link'})
                    ]
                })
            case 'personalizado':

                const IMG = options.getString('imagen')

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR}\` envió un meme`)
                            .setColor(process.env.COLOR)
                            .setImage(`https://api.memegen.link/images/custom/${textoProcesado}.png?background=${IMG}`)
                            .setFooter({text: 'Creado con memegen.link'})
                    ]
                })
            default:
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle({text: `Subcomando no encontrado`})
                    ]
                })

        }

    }
}

