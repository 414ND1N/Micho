const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para que toffu diga el texto dado")
    .addStringOption(option =>
        option.setName("texto")
        .setDescription('Texto que deseas que diga 😊')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        await interaction.deferReply();
        let args = interaction.options.getString("texto");
        interaction.channel.send(args)
        return await interaction.deleteReply();
    }
} 