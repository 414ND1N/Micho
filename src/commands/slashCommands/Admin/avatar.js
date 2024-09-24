const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    cooldown: 20,
    CMD: new SlashCommandBuilder()
        .setName("avatar")
        .setNameLocalizations({ "en-US": "avatar" })
        .setDescription(`Actualizar el avatar de ${process.env.BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `Update ${process.env.BOT_NAME}'s avatar`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('perfil')
                .setNameLocalizations({ "en-US": "profile" })
                .setDescription('Establece la imagen de perfil del bot')
                .setDescriptionLocalizations({ "en-US": "Set the bot profile image" })
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
        )
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('fondo')
                .setNameLocalizations({ "en-US": "banner" })
                .setDescription('Establece la imagen de fondo del bot')
                .setDescriptionLocalizations({ "en-US": "Set the bot banner" })
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
        )
    ,

    async execute(interaction) {

        try {
            const { client } = interaction

            interaction.deferReply({ ephemeral: true })

            const VALID_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            let URL = ''

            switch (interaction.options.getSubcommand()) {
                case 'enlace':
                    URL = interaction.options.getString('url')
                    break
                case 'archivo':
                    const { options } = interaction
                    const file = options.getAttachment("archivo")

                    if (!VALID_FORMATS.includes(file.contentType)) {
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
                    URL = file.url
                    break
            }

            switch (interaction.options.getSubcommandGroup()) {
                case 'perfil':
                    await client.user.setAvatar(URL).catch(async err => {
                        console.error(err)
                        return await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error al intentar cambiar el avatar`)
                                    .setColor(process.env.COLOR_ERROR)
                            ],
                            ephemeral: true
                        })
                    })

                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Cambio de avatar de \`${process.env.BOT_NAME}\``)
                                .setColor(process.env.COLOR)
                                .setImage(URL)
                        ],
                        ephemeral: true
                    })
                case 'fondo':

                    await client.rest.patch("/users/@me", {
                        body: {
                            banner: "data:image/gif;base64," + Buffer.from(
                                await (await fetch(URL)).arrayBuffer()).toString('base64')
                        }
                    }).catch(async err => {
                        console.error(err)
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Error al intentar cambiar el banner`)
                                    .setColor(process.env.COLOR_ERROR)
                            ],
                            ephemeral: true
                        })
                        return
                    })

                    // await client.rest.patch(Routes.user(), {
                    //     body: { banner: await DataResolver.resolveImage(URL) }
                    // }).catch(async err => {
                    //     console.error(err)
                    //     await interaction.editReply({
                    //         embeds: [
                    //             new EmbedBuilder()
                    //                 .setTitle(`Error al intentar cambiar el banner`)
                    //                 .setColor(process.env.COLOR_ERROR)
                    //         ],
                    //         ephemeral: true
                    //     })
                    //     return
                    // })

                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Cambio de banner de \`${process.env.BOT_NAME}\``)
                                .setColor(process.env.COLOR)
                                .setImage(URL)
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