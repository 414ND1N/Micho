const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para dar un mensaje de pregunta")
    .addStringOption(option =>
      option.setName("pregunta")
        .setDescription('Pregunta que deseas realizar')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        let pregunta = interaction.options.getString("pregunta");
        
        const embed_sug = new EmbedBuilder()
            .setTitle(`Pregunta de \`${interaction.user?.username}\``)
            .setDescription(`\`${pregunta}\``)
            .setColor(process.env.COLOR)
            .setTimestamp()
            .setThumbnail(`https://i.imgur.com/2BF8HEc.gif`);

        const mensaje = await interaction.reply({embeds: [embed_sug], fetchReply: true});
        
        mensaje.react(`👍`);
        mensaje.react(`👎`);
        mensaje.react(`🤨`);
        mensaje.react(`😴`);
        mensaje.react(`🏳️‍🌈`);
    }
} 