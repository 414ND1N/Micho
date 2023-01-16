const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActivityType} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para actualizar la presencia de Toffu")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => 
        subcommand.setName('actividad')
        .setDescription('Actualiza la actividad de Toffu')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de actividad al cual actualizar')
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
                .setRequired(true)    
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('estado')
        .setDescription('Actualiza el estado de Toffu')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de estado al cual actualizar')
                .setRequired(true)
                .addChoices(
                    {name: 'Online', value: 'online'},
                    {name: 'Idle', value: 'idle'},
                    {name: 'Do not disturb', value: 'dnd'},
                    {name: 'Invisible', value: 'invisible'}
                )
        )
    ),
    
    async execute(client, interaction, prefix){
       
        const sub = interaction.options.getSubcommand();
        const tipo = interaction.options.getString('tipo');
        const actividad = interaction.options.getString('actividad')

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
                        //por default sera Watching
                        client.user.setActivity(actividad, {type: ActivityType.Watching});
                        break;
                }
                break;
            case 'estado':
                client.user.setPresence({status: tipo});
                break;
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Cambió de presencia de Toffu')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se cambió ${sub} a \`${tipo}\`.`)
                    .setThumbnail("https://i.imgur.com/lIs9ZAg.gif")
            ],
            ephemeral: true
        });
    }
}  