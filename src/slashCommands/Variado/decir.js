const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para que toffu diga el texto dicho")
    .addStringOption(option =>
      option.setName("input")
        .setDescription('Texto que deseas que diga 😊')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        let args = interaction.options.getString("input");
        return interaction.reply(args)
    }
} 