const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Elimina los mensajes indicados del canal")
    .addIntegerOption(option =>
        option.setName("mensajes")
        .setDescription("Número de mensajes a eliminar")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    )
    .setDefaultMemberPermissions('0'),
    async execute(client, interaction, prefix){

        await interaction.deferReply();

        const valor = interaction.options.getInteger("mensajes");

        interaction.channel.bulkDelete(valor + 1, true);

        const ClearCommandembed = new EmbedBuilder()
            .setTitle('🧹 __CLEAR__ 🧹')
            .setColor(process.env.COLOR)
            .setDescription(`Se han eliminado una cantidad de ${valor} de mensajes`)
            .setThumbnail("https://i.imgur.com/WHCwA6t.gif")

        interaction.channel.send({ embeds: [ClearCommandembed], ephemeral: true })
            .then(msg => {setTimeout(() => msg.delete(), 10000)}).catch(console.log('Error csm con clear :p'));
        return await interaction.deleteReply();
    }
} 