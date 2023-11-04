const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Genera tu propio meme con plantillas")
        .addSubcommand(subcommand =>
            subcommand.setName('plantillas')
                .setDescription('Crea un meme con una plantilla')
                .addStringOption(option =>
                    option.setName('plantilla')
                        .setDescription('Tipo de plantilla que se usara')
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
                        .setDescription('Texto que se pondra en la plantilla del meme separado por comas (;)')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('personalizado')
                .setDescription('Crea un meme con tu propia imagen')
                .addStringOption(option =>
                    option.setName('imagen')
                        .setDescription('URL de la imagen que se usara')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('textos')
                        .setDescription('Texto que se pondra separado por comas (;)')
                        .setRequired(true)
                )
        )
    ,

    async execute(client, interaction) {

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos
        const SUB = interaction.options.getSubcommand(); //Subcomando

        const TEXTO_ENTRADA = interaction.options.getString('textos'); //Texto de entrada

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
        };
        
        const textoSeparados = TEXTO_ENTRADA.split(';');
        const textoProcesado = textoSeparados.map(text => (
            text.replace(/[\?&%#\/\\<>"]/g, match => remplazos[match]).replace(/\s/g, "_")
        ));
        
        const TEXTO_FORMATEADO = textoProcesado.join('/');

        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario


        switch (SUB) {
            case 'plantillas':

                const ID_PLANTILLA = interaction.options.getString('plantilla');

                img_url = `https://api.memegen.link/images/${ID_PLANTILLA}/${TEXTO_FORMATEADO}.png`;
        
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR}\` envió un meme`)
                            .setColor(process.env.COLOR)
                            .setImage(img_url)
                            .setFooter({text: 'Creado con memegen.link'})
                    ]
                })
            case 'personalizado':

                const BACKGROUND_IMG = interaction.options.getString('imagen');
                
                img_url = `https://api.memegen.link/images/custom/${TEXTO_FORMATEADO}.png?background=${BACKGROUND_IMG}`;

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`\`${AUTHOR}\` envió un meme`)
                            .setColor(process.env.COLOR)
                            .setImage(img_url)
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

