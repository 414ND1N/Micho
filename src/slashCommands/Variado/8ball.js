const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Bola 8 te dará la respuesta a tu pregunta")
    .addStringOption(option =>
        option.setName("pregunta")
        .setDescription('Pregunta que deseas que la bola te responda')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        
        let pregunta = interaction.options.getString("pregunta");

        const opciones = [
            "Es cierto",
            "Definitivamente",
            "Lo mas probable",
            "No tengo una respuesta para eso..", 
            "No cuentes con ello",
            "Es muy dudoso",
            "Creeria que si",
            "Diria que no",
            "Los astros aun no se alinean",
        ]

        const randomIndex = Math.floor(Math.random() * opciones.length);
        const item = opciones[randomIndex];
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} pregunto: **${pregunta}**`)
                    .setColor(process.env.COLOR)
                    .setThumbnail('https://i.imgur.com/q0C7GuE.png')
                    .setDescription(`**Mi respuesta es:** \`${item}\``)
            ]
        })
    }
}