const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("avatar")
        .setNameLocalizations({  "en-US": "avatar" })
        .setDescription(`Actualizar el avatar de ${process.env.BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `Update ${process.env.BOT_NAME}'s avatar`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("enlace")
                .setNameLocalizations({ "en-US": "link" })
                .setDescription('Establece un avatar estático desde un enlace')
                .setDescriptionLocalizations({ "en-US": "Set a static avatar from an url" })
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('Enlace de la imagen a setear como avatar')
                        .setDescriptionLocalizations({ "en-US": "Image link to set as avatar" })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("archivo")
                .setNameLocalizations({ "en-US": "dynamic" })
                .setDescription('Establece un avatar dinámico desde un archivo')
                .setDescriptionLocalizations({ "en-US": "Set a dinamic avatar from an image file" })
                .addAttachmentOption(option =>
                    option.setName('archivo')
                        .setDescription('Archivo a setear como avatar')
                        .setDescriptionLocalizations({ "en-US": "File to set as avatar" })
                        .setRequired(true)
                )
        )
        ,
    
    async execute(client, interaction){
       
        try {

            interaction.deferReply({ ephemeral: true })

            switch (interaction.options.getSubcommand()) {
                case 'enlace':
                    const url = interaction.options.getString('url')
                    client.user.setAvatar(url).catch(async err => {
                        console.error(err)
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error al intentar cambiar el avatar`)
                                    .setColor(process.env.COLOR_ERROR)
                            ],
                            ephemeral: true
                        })
                        return
                    })

                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Cambio de avatar de \`${process.env.BOT_NAME}\``)
                                .setColor(process.env.COLOR)
                                .setImage(url)
                        ],
                        ephemeral: true
                    })
                case 'archivo':
                    const { options } = interaction
                    const file = options.getAttachment("archivo")
                    
                    if (!file.contentType.startsWith('image')) {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error al intentar cambiar el avatar`)
                                    .setColor(process.env.COLOR_ERROR)
                                    .setDescription('El archivo debe ser una imagen')
                            ],
                            ephemeral: true
                        })
                        return
                    }

                    await client.user.setAvatar(file.url).catch(async err => {
                        console.error(err)
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error al intentar cambiar el avatar`)
                                    .setColor(process.env.COLOR_ERROR)
                            ],
                            ephemeral: true
                        })
                        return 
                    })

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Cambio de avatar de \`${process.env.BOT_NAME}\``)
                                .setColor(process.env.COLOR)
                                .setImage(file.url)
                        ],
                        ephemeral: true
                    })
            }
        } catch (error) {
            console.error(error)
            return interaction.reply({ 
                content: `Ocurrió un error al intentar cambiar el avatar de ${process.env.BOT_NAME}`, 
                ephemeral: true
            })
        }
        
    }
}  