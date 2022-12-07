const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para que toffu eliga entre distintas opciones")
    .addStringOption(option =>
      option.setName("elecciones")
        .setDescription('Opciones a elegir separados por coma (,)')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        let args = interaction.options.getString("elecciones");
        if (!args) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay opciones donde elegir, escribe algo 😊`)
                ],
                ephemeral: true
            })
        }
        let opciones = args.split(",")
        const randomIndex = Math.floor(Math.random() * opciones.length);
        const item = opciones[randomIndex];

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .addFields({name:`Elegí ${item}`, value:`> 🧐🍀`})
            ]
        })
    }
} 