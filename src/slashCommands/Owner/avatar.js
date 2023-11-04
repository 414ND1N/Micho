const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActivityType} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription(`Actualizar el avatar de ${process.env.BOT_NAME}`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Enlace de la imagen a setear como avatar')
                .setRequired(true)
        ),
    
    async execute(client, interaction){
       
        const url = interaction.options.getString('url');
        client.user.setAvatar(url);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Cambio de avatar de ${process.env.BOT_NAME}`)
                    .setColor(process.env.COLOR)
                    .setImage(url)
            ],
            ephemeral: true
        });
    }
}  