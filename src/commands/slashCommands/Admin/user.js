const { ChatInputCommandInteraction,SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("user")
        .setNameLocalizations({ "en-US": "user" })
        .setDescription("Maneja la información de un usuario.")
        .setDescriptionLocalizations({ "en-US": "Manages the information of a user." })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand.setName("info")
                .setNameLocalizations({ "en-US": "info" })
                .setDescription("Te muestra las estadísticas de un usuario.")
                .setDescriptionLocalizations({ "en-US": "Shows you the statistics of a user." })
                .addUserOption((option) =>
                    option.setName(`usuario`)
                        .setNameLocalizations({ "en-US": "user" })
                        .setDescription(`Elige al usuario para ver sus estadísticas.`)
                        .setDescriptionLocalizations({ "en-US": `Choose the user to see their statistics.` })
                )
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {

        //const { client } = interaction
        const user = interaction.options.getUser(`usuario`) || interaction.user
        const member = interaction.guild.members.cache.get(user.id)

        const embed = new EmbedBuilder()
            .setTitle(`${user.globalName || user.username}`)
            .setColor("Random")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setImage(user.bannerURL({ size: 512 }))
            .setTimestamp()
            .setFooter({
                text: `Solicitado por: ${interaction.user.tag}`,
                iconURL:
                    interaction.user.displayAvatarURL({ dynamic: true }) ||
                    "https://cdn.discordapp.com/attachments/1053464482095050803/1053464952607875072/PRywUXcqg0v5DD6s7C3LyQ.png",
            })
            .addFields(
                {
                    name: "\`Información del Usuario\`",
                    value: [
                        `**Usuario**: ${member?.nickname || user?.username}`,
                        `**Nombre**: ${user.globalName}`,
                        `**ID**: (${user.id})`,
                        `**Color**: ${user.hexAccentColor || "Ninguno"}`,
                        `**Boost**: ${member.premiumSince ? `<:boosterdtc:1087580561498980362> Si` : `No`}`,
                        `**Insignia**: ${user.flags.toArray().join(", ") || "Ninguna"}`,
                        `**Bot**: ${user.bot ? `Si` : `No`}`,
                        `**Status**: ${user.presence?.status || "Desconectado"}`,
                    ].join("\n"),
                },
                {
                    name: `\`Roles (${member.roles.cache.size})\``,
                    value: [
                        `\n${member.roles.cache.map((role) => role.toString()).join(", ")}`,
                    ].join("\n"),
                },
                {
                    name: "\`Banner\`",
                    value: user.bannerURL() ? "** **" : "El usuario no tiene banner.",
                },
            );
        await interaction.reply({
            embeds: [embed],
        });
    },
};