const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
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
    
    async execute(interaction){
       
        await interaction.deferReply();
        const channel = interaction.options.getChannel("canal");

        embed_verify = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle(`Bienvenido a ${interaction.guild?.name}`)
            .setDescription("Reacciona a este mensaje para obtener el rol de \`Pana\` y poder ver el resto del servidor")

        const btn_verify =  new ButtonBuilder()
            .setCustomId('verify_role')
            .setLabel('Verificar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✅')
        ;

        channel.send({
            embeds: [embed_verify], //embed
            components: [new ActionRowBuilder().addComponents(btn_verify)] //buttons
        }).catch(() => {});

        return interaction.deleteReply();
        
    }
}  