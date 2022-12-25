const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Toffu envía un mensaje privado al usuario indicado")
    .addUserOption(option => 
        option.setName('usuario')
            .setDescription('Usuario al que se desea enviar el mensaje privado 🧐')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('mensaje')
            .setDescription('Mensaje que se desea enviar')
            .setRequired(true)
    ),
    
    async execute(client, interaction, prefix){
        const user = interaction.options.getUser('usuario');
        const mensaje = interaction.options.getString('mensaje');

        if(!user) return interaction.reply("No se encontró destinario, vuelve a intentarlo");

        user.send(mensaje);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Mensaje envíado a ${user} \n > ${mensaje}`)
            ],
            ephemeral: true
        });
    }
}                   