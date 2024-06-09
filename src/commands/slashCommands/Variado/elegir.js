const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("elegir")
        .setNameLocalizations({
            "en-US": "choose"
        })
        .setDescription('Elige un valor aleatorio')
        .setDescriptionLocalizations({
            "en-US": "Choose a random value"
        })
        .addSubcommand(subcommand =>
            subcommand.setName('opciones')
                .setNameLocalizations({
                    "en-US": "options"
                })
                .setDescription(`Elige entre las opciones dadas`)
                .setDescriptionLocalizations({
                    "en-US": `Choose between the given options`
                })
                .addStringOption(option =>
                option.setName("elecciones")
                    .setDescription('Opciones a elegir separados por coma (,)')
                    .setDescriptionLocalizations({
                        "en-US": "Options to choose separated by comma (,)"
                    })
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('numeros')
                .setNameLocalizations({
                    "en-US": "numbers"
                })
                .setDescription('Elige un número entre el rango dado')
                .setDescriptionLocalizations({
                    "en-US": "Choose a number between the given range"
                })
                .addIntegerOption(option =>
                    option.setName("maximo")
                        .setNameLocalizations({"en-US": 'maximum'})
                        .setDescription('Número máximo')
                        .setDescriptionLocalizations({
                            "en-US": 'Maximum number'
                        })
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName("minimo")
                        .setNameLocalizations({"en-US": 'minimum'})
                        .setDescription('Número mínimo')
                        .setDescriptionLocalizations({
                            "en-US": 'Minimum number'
                        })
                )
        ),
    async execute(interaction){

        //constantes
        const SUB = interaction.options.getSubcommand()
        let args, opciones, rIndex

        switch (SUB) {
            case 'opciones':
            case 'options':
                args = interaction.options.getString("elecciones")
                opciones = args.split(",")
                rIndex = Math.floor(Math.random() * opciones.length)

                await interaction.channel.sendTyping()
                
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Elegí \`${opciones[rIndex]}\` 🧐`)
                    ]
                })
            case 'numeros':
            case 'numbers':
                args = interaction.options.getString("elecciones")
                let min = interaction.options.getInteger("minimo") || 0 //si no viene el minimo, poner 0
                let max = interaction.options.getInteger("maximo") // valor maximo siempre viene
                rIndex = Math.floor(Math.random() * (max - min + 1)) + min //random entre el rango dado

                await interaction.channel.sendTyping()
                
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Elegí \`${rIndex}\` 🧐`)
                    ]
                })
        }

    }
} 