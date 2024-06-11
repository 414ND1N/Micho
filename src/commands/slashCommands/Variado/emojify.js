const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const axios = require('axios');
const url = require('url');
const onlyEmoji = require('emoji-aware').onlyEmoji;

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("emojify")
        .setNameLocalizations({
            "en-US": "emojify"
        })
        .setDescription('Trabaja con emojis.')
        .setDescriptionLocalizations({
            "en-US": 'Work with emojis.'
        })
        .addSubcommand(subcommand =>
            subcommand.setName("escribir")
                .setNameLocalizations({
                    "en-US": "write"
                })
                .setDescription("Escribe un texto con emojis.")
                .setDescriptionLocalizations({
                    "en-US": "Write a text with emojis."
                })
                .addStringOption(option =>
                    option
                        .setName("texto")
                        .setNameLocalizations({
                            "en-US": "text"
                        })
                        .setDescription("Texto a convertir con emojis.")
                        .setDescriptionLocalizations({
                            "en-US": "Text to convert with emojis."
                        })
                        .setRequired(true)
                        .setMaxLength(100)
                        .setMinLength(1)
                )
                .addBooleanOption(option =>
                    option
                        .setName("invisible")
                        .setNameLocalizations({
                            "en-US": "hidden"
                        })
                        .setDescription("Mostrar el texto para los demás.")
                        .setDescriptionLocalizations({
                            "en-US": "Show the text for others."
                        })
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("mezclar")
                .setNameLocalizations({
                    "en-US": "mix"
                })
                .setDescription("Mezcla emojis.")
                .setDescriptionLocalizations({
                    "en-US": "Mix emojis."
                })
                .addStringOption(option =>
                    option
                        .setName("emojis")
                        .setNameLocalizations({
                            "en-US": "emojis"
                        })
                        .setDescription("Emojis a mezclar.")
                        .setDescriptionLocalizations({
                            "en-US": "Emojis to mix."
                        })
                        .setRequired(true)
                )
        )
        ,
    async execute(interaction){
        try {

            await interaction.deferReply()
            const { options } = interaction

            switch (interaction.options.getSubcommand()) {
                case 'escribir':

                    const texto = options.getString("texto")
                    const hidden = options.getBoolean("invisible")

                    var emoji_text = texto
                        .toLowerCase()
                        .split('')
                        .map(char => {
                            if (char === ' ') return ' '
                            if (char.match(/[a-z]/)) return `:regional_indicator_${char}:`
                            return char
                        })
                        .join('')

                    if (emoji_text.length > 2000) {
                        return interaction.editReply({
                            content: `El texto es muy largo!`,
                            ephemeral: true
                        })
                    }

                    return interaction.editReply({
                        content: emoji_text,
                        ephemeral: hidden
                    })
                 
                case 'mezclar':
                    const eString = options.getString("emojis")
                    const emojis = onlyEmoji(eString)
                    const response = `❌ Uno o varios emojis no son válidos en \`${eString}\`!\nTen en cuentas que gestos 👌 y emojis personalizados del servidor \`no son válidos\`.`

                    const output = await axios.get('https://tenor.googleapis.com/v2/featured?'+(
                        new url.URLSearchParams({
                            key: process.env.TENOR_API_KEY,
                            contentfilter: "high",
                            media_filter: "png_transparent",
                            component: "proactive",
                            collection: "emoji_kitchen_v5",
                            q: emojis.join('_')
                        }).toString()
                    ))
                    
                    // Validaciones
                    if(!output){
                        return interaction.editReply({
                            content: response,
                            ephemeral: true
                        })
                    } else if (!output.data.results[0]){
                        return interaction.editReply({
                            content: response,
                            ephemeral: true
                        })
                    } else if (eString.startsWith('<')|| eString.endsWith('>')){
                        return interaction.editReply({
                            content: response,
                            ephemeral: true
                        })
                    }

                    //respuesta con embed
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setImage(output.data.results[0].url)
                                .setColor("Random")
                                .setTimestamp()
                        ]
                    })

                default:
                    console.log("No existe el subcomando!")
                    interaction.editReply({
                        content: `No existe el subcomando!`,
                        ephemeral: true
                    })
                    return
            }
            
        } catch (error) {
            //console.log(error)
            return interaction.editReply({
                content: `Ha ocurrido un error al ejecutar el comando!`,
                ephemeral: true
            })
        }
    }
} 

