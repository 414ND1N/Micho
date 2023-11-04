const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("elegir")
        .setDescription(`${process.env.BOT_NAME} elige entre las opciones dadas`)
        .addStringOption(option =>
        option.setName("elecciones")
            .setDescription('Opciones a elegir separados por coma (,)')
            .setRequired(true)
        ),
    async execute(client, interaction){
        let args = interaction.options.getString("elecciones");
        let opciones = args.split(",")
        const randomIndex = Math.floor(Math.random() * opciones.length);
        const item = opciones[randomIndex];

        await interaction.channel.sendTyping();
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Elegí \`${item}\` 🧐`)
            ]
        })
    }
} 