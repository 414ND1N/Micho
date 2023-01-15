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

        const valor = interaction.options.getInteger("mensajes");

        await interaction.channel.bulkDelete(valor+1).catch(err =>{ return });

        const ClearCommandembed = new EmbedBuilder()
            .setTitle('🧹 __CLEAR__ 🧹')
            .setColor(process.env.COLOR)
            .setDescription(`Se han eliminado una cantidad de \`${valor}\` de mensajes`)
            .setThumbnail("https://i.imgur.com/7bj9r36.gif")

        interaction.reply({ embeds: [ClearCommandembed]})
            .then(() => {setTimeout(() => interaction.deleteReply(), 10000)}).catch();
    }
}   