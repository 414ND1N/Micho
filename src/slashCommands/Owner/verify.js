const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("verificar")
        .setDescription(`Mensaje de verificación`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviará el mensaje de verificación')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    
    async execute(client, interaction){
       
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