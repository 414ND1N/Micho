const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Dar sugerencia a votación en el canal de sugerencias")
    .addStringOption(option =>
      option.setName("sugerencia")
        .setDescription('Sugerencia para la votación')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        let pregunta = interaction.options.getString("sugerencia");
        const channel = client.channels.cache.get(process.env.ID_CANAL_SUGERENCIAS);
        
        const mensaje = await channel.send({ embeds: [
            new EmbedBuilder()
                .setTitle(`Sugerencia de \`${interaction.user?.username}\``)
                .setDescription(`\`${pregunta}\``)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
        ], fetchReply: true });
        mensaje.react(`👍`);
        mensaje.react(`👎`);

        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle(`Sugerencia realizada`)
                .setDescription(`Se envió tu sugerencia al canal de \`sugerencias\``)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/X3E6BAy.gif`)
        ], ephemeral: true })
    }
} 