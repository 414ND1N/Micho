const {SlashCommandBuilder, PermissionFlagsBits, PollLayoutType} = require('discord.js')

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("encuesta")
        .setNameLocalizations({
            "en-US": "poll"
        })
        .setDescription('Controla una encuesta.')
        .setDescriptionLocalizations({
            "en-US": 'Manage a poll.'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.SendPolls)
        .addSubcommand(subcommand =>
            subcommand.setName("crear")
                .setNameLocalizations({
                    "en-US": "create"
                })
                .setDescription("Crea una encuesta.")
                .setDescriptionLocalizations({
                    "en-US": "Create a poll."
                })
                .addStringOption(option =>
                    option.setName('pregunta')
                        .setNameLocalizations({ "en-US": 'question' })
                        .setDescription('Pregunta de la encuesta.')
                        .setDescriptionLocalizations({
                            "en-US": 'Poll question.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('opciones')
                        .setNameLocalizations({ "en-US": 'options' })
                        .setDescription('Opciones de la encuesta separadas por coma.')
                        .setDescriptionLocalizations({
                            "en-US": 'Poll options separated by comma.'
                        })
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option.setName('multiple')
                        .setNameLocalizations({ "en-US": 'multiple' })
                        .setDescription('Permite seleccionar multiples opciones.')
                        .setDescriptionLocalizations({
                            "en-US": 'Allows selecting multiple options.'
                        })
                )
                .addNumberOption(option =>
                    option.setName('duracion')
                        .setNameLocalizations({ "en-US": 'duration' })
                        .setDescription('Duración de la encuesta en días.')
                        .setDescriptionLocalizations({
                            "en-US": 'Poll duration in days.'
                        })
                        .setMinValue(1)
                        .setMaxValue(7)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("finalizar")
                .setNameLocalizations({
                    "en-US": "finish"
                })
                .setDescription("Finaliza una encuesta.")
                .setDescriptionLocalizations({
                    "en-US": "Finish a poll."
                })
                .addStringOption(option =>
                    option.setName('id')
                        .setNameLocalizations({ "en-US": 'id' })
                        .setDescription('ID de la encuesta a finalizar.')
                        .setDescriptionLocalizations({
                            "en-US": 'Poll ID to finish.'
                        })
                        .setRequired(true)
                )
        )
        ,
    async execute(client, interaction){
        try {
            switch (interaction.options.getSubcommand()) {
                case 'crear':
                    // Constantes
                    const PREGUNTA = interaction.options.getString('pregunta')
                    const OPCIONES = interaction.options.getString('opciones').split(',')
                    const MULTIPLE = interaction.options.getBoolean('multiple') ?? false
                    const DURACION = interaction.options.getNumber('duracion') ?? 1
            
                    // Validaciones
                    if (OPCIONES.length < 2) {
                        return interaction.reply({
                            content: 'Debes ingresar al menos 2 opciones.', 
                            ephemeral: true 
                        })
                    }
            
                    if (DURACION > 120) {
                        return interaction.reply({
                            content: 'La duración máxima es de 5 días.', 
                            ephemeral: true 
                        })
                    }
            
                    interaction.channel.send({
                        poll: {
                            question: {text: PREGUNTA},
                            answers: OPCIONES.map(opcion => ({ text: opcion })),
                            allowMultiselect: MULTIPLE,
                            timeout: DURACION,
                            layoutType: PollLayoutType.Default
                        }
                    })
            
                    // Mensaje de confirmación
                    return interaction.reply({
                        content: `Encuesta creada 📊.`,
                        ephemeral: true
                    })
                case 'finalizar':
                    // Constantes
                    const ID = interaction.options.getString('id')
                    const MESSAGE = await interaction.channel.messages.fetch(ID)
            
                    // Validaciones
                    if (!MESSAGE) {
                        return interaction.reply({
                            content: 'No se encontró la encuesta.', 
                            ephemeral: true 
                        })
                    }
            
                    if (!MESSAGE.poll) {
                        return interaction.reply({
                            content: 'El mensaje no es una encuesta.', 
                            ephemeral: true 
                        })
                    }
            
                    // Finalizar encuesta
                    MESSAGE.poll.end()
            
                    // Mensaje de confirmación
                    return interaction.reply({
                        content: `Encuesta finalizada.`,
                        ephemeral: true
                    })
                default:
                    return interaction.reply({
                        content: 'Debes seleccionar una opción válida.', 
                        ephemeral: true 
                    })
            }
            
        } catch (error) {
            console.log(error)
            return interaction.reply({
                content: 'Ocurrió un error al crear la encuesta.',
                ephemeral: true
            })
        }
    }
} 

