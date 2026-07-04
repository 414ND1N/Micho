const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Roles = require('@/schemas/roles')
const { COLOR } = require('@/config')
const { ErrorEmbed } = require('@/utils/predifined_components')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("verificar")
        .setNameLocalizations({ "en-US": "verify" })
        .setDescription(`Mensaje de verificación`)
        .setDescriptionLocalizations({ "en-US": "Verification message" })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setNameLocalizations({ "en-US": 'channel' })
                .setDescription('Canal donde se enviará el mensaje de verificación')
                .setDescriptionLocalizations({
                    "en-US": "Channel where the verification message will be sent",
                })
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {

        await interaction.deferReply()
        const channel = interaction.options.getChannel("canal")

        // Buscar el rol en la bd con el guildID y el nombre
        const ROL_DATA = await Roles.findOne({ guild_id: interaction.guild.id, key: 'verify' })
        if (!ROL_DATA) {
            return interaction.reply({
                embeds: [ErrorEmbed(`❌ **No se ha encontrado el rol de Verficado en la base de datos**`)],
                ephemeral: true
            })
        }

        // Buscar el rol en el servidor
        const ROL_VERIFICADO = interaction.guild.roles.cache.get(ROL_DATA.rol_id)

        if (!ROL_VERIFICADO) {
            return interaction.reply({
                embeds: [ErrorEmbed(`❌ **No se ha encontrado el rol de Verficado en el servidor**`)],
                ephemeral: true
            })
        }

        embed_verify = new EmbedBuilder()
            .setColor(COLOR)
            .setTitle(`Bienvenido a ${interaction.guild?.name}`)
            .setDescription(`Reacciona a este mensaje para obtener el rol de \`${ROL_VERIFICADO.name}\` y poder ver el resto del servidor`)

        const btn_verify = new ButtonBuilder()
            .setCustomId('verify_role')
            .setLabel('Verificar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✅')
            ;

        channel.send({
            embeds: [embed_verify], //embed
            components: [new ActionRowBuilder().addComponents(btn_verify)] //buttons
        }).catch(() => { });

        return interaction.deleteReply();

    }
}  