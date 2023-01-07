const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para dar una sugerencia para poder votar")
    .addStringOption(option =>
      option.setName("sugerencia")
        .setDescription('Sugerencia para la votación')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        let pregunta = interaction.options.getString("sugerencia");
        
        const embed_sug = new EmbedBuilder()
        .setTitle(`Sugerencia de \`${interaction.user?.username}\``)
        .setDescription(`\`${pregunta}\``)
        .setColor(process.env.COLOR)
        .setTimestamp()
        .setThumbnail(`https://i.imgur.com/rIPXKFQ.png`);

        const mensaje = await interaction.reply({embeds: [embed_sug], fetchReply: true});
        
        mensaje.react(`👍`);
        mensaje.react(`👎`);
        mensaje.react(`🏳️‍🌈`);
    }
} 