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
        let sugerencia = interaction.options.getString("sugerencia");
        const channel = client.channels.cache.get(process.env.ID_CANAL_SUGERENCIAS); //ID del canal de sugerencias
        const channel_pruebas = client.channels.cache.get(process.env.ID_CANAL_PRUEBAS); //ID del canal de pruebas
        
        //Si el canal es el de pruebas se enviará la sugerencia en el canal de pruebas
        if (interaction.channel == channel_pruebas) {
            const mensaje = await channel_pruebas.send({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Sugerencia de \`${interaction.user?.username}\``)
                    .setDescription(`\`${sugerencia}\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
            ], fetchReply: true });
            mensaje.react(`👍`);
            mensaje.react(`👎`);

            return interaction.reply('Sugerencia enviada')
            
        }

        //Si el canal no es el de pruebas se enviará la sugerencia en el canal de sugerencias
        const mensaje = await channel.send({ embeds: [
            new EmbedBuilder()
                .setTitle(`Sugerencia de \`${interaction.user?.username}\``)
                .setDescription(`\`${sugerencia}\``)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
        ], fetchReply: true });
        mensaje.react(`👍`);
        mensaje.react(`👎`);

        return interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle(`Sugerencia realizada`)
                .setDescription(`Sugerencia \`${sugerencia}\` enviada a ${channel}`)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/X3E6BAy.gif`)
        ], ephemeral: true })
        
    }
} 