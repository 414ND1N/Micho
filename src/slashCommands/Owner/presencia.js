const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActivityType} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("presencia")
        .setNameLocalizations({ "en-US": "presence" })
        .setDescription(`Actualizar la presencia de ${process.env.BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `Update ${process.env.BOT_NAME}'s presence`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand.setName('actividad')
            .setDescription(`Actualiza la actividad de ${process.env.BOT_NAME}`)
            .setDescriptionLocalizations({
                "en-US": `Update ${process.env.BOT_NAME}'s activity`
            })
            .addStringOption(option =>
                option.setName('tipo')
                    .setDescription('Tipo de actividad al cual actualizar')
                    .setDescriptionLocalizations({
                        "en-US": 'Type of activity to update'
                    })
                    .setRequired(true)
                    .addChoices(
                        {name: 'Playing', value: 'Playing'},
                        {name: 'Streaming', value: 'Streaming'},
                        {name: 'Listening', value: 'Listening'},
                        {name: 'Watching', value: 'Watching'},
                        {name: 'Competing', value: 'Competing'}
                    )
            )
            .addStringOption(option =>
                option.setName('actividad')
                    .setDescription('Setear la actividad actual')
                    .setDescriptionLocalizations({
                        "en-US": 'Set the current activity'
                    })
                    .setRequired(true)    
            )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('estado')
            .setDescription(`Actualiza el estado de ${process.env.BOT_NAME}`)
            .setDescriptionLocalizations({
                "en-US": `Update ${process.env.BOT_NAME}'s status`
            })
            .addStringOption(option =>
                option.setName('tipo')
                    .setDescription('Tipo de estado al cual actualizar')
                    .setDescriptionLocalizations({
                        "en-US": 'Type of status to update'
                    })
                    .setRequired(true)
                    .addChoices(
                        {name: 'Online', value: 'online'},
                        {name: 'Idle', value: 'idle'},
                        {name: 'Do not disturb', value: 'dnd'},
                        {name: 'Invisible', value: 'invisible'}
                    )
            )
        ),
    
    async execute(client, interaction){
       
        const sub = interaction.options.getSubcommand();
        const tipo = interaction.options.getString('tipo');
        const actividad = interaction.options.getString('actividad');

        switch (sub){
            case 'actividad':
                switch(tipo){
                    case 'Playing':
                        client.user.setActivity(actividad, {type: ActivityType.Playing});
                        break;
                    case 'Streaming':
                        client.user.setActivity(actividad, {type: ActivityType.Streaming});
                        break;
                    case 'Listening':
                        client.user.setActivity(actividad, {type: ActivityType.Listening});
                        break;
                    case 'Competing':
                        client.user.setActivity(actividad, {type: ActivityType.Competing});
                        break;     
                    default:
                        client.user.setActivity(actividad, {type: ActivityType.Watching});
                        break;
                }
                break;
            case 'estado':
                client.user.setPresence({status: tipo});
                break;
        }

        const texto_estado = actividad? `${tipo} ${actividad}`: tipo;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Cambio de presencia de ${process.env.BOT_NAME}`)
                    .setColor(process.env.COLOR)
                    .setDescription(`Se cambió ${sub} a \`${texto_estado}\`.`)
                    .setThumbnail("https://i.imgur.com/lIs9ZAg.gif")
            ],
            ephemeral: true
        });
    }
}  