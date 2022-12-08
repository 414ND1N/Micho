const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
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
        if (!args) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay mensaje que pueda decir, escribe algo 😊`)
                ],
                ephemeral: true
            })
        }
        interaction.channel.send(args)
        return await interaction.deleteReply();
    }
} 