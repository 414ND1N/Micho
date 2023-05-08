const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Toffu dirá el texto que le digas")
    .addStringOption(option =>
        option.setName("texto")
        .setDescription('Texto que deseas que diga 😊')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        await interaction.deferReply();
        let args = interaction.options.getString("texto");
        await interaction.channel.sendTyping();
        interaction.channel.send(args)
        return await interaction.deleteReply();
    }
} 