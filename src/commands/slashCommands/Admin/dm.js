const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("dm")
        .setNameLocalizations({ "en-US": "dm" })
        .setDescription(`${process.env.BOT_NAME} envía un mensaje privado al usuario indicado`)
        .setDescriptionLocalizations({
            "en-US": `${process.env.BOT_NAME} sends a private message to the indicated user`
        })
        .addUserOption(option => 
            option.setName('usuario')
                .setNameLocalizations({ "en-US": 'user' })
                .setDescription('Usuario al que se desea enviar el mensaje privado 🧐')
                .setDescriptionLocalizations({
                    "en-US": 'User to whom you want to send the private message 🧐'
                })
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setNameLocalizations({ "en-US": 'message' })
                .setDescription('Mensaje que se desea enviar')
                .setDescriptionLocalizations({ "en-US": 'Message to send' })
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction){
        const user = interaction.options.getUser('usuario')
        const mensaje = interaction.options.getString('mensaje')

        if(!user) return interaction.reply("No se encontró destinario, vuelve a intentarlo")

        user.send(mensaje)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Mensaje envíado a ${user} \n> ${mensaje}`)
            ],
            ephemeral: true
        })
    }
}                   