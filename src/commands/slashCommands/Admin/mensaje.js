const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("mensaje")
        .setNameLocalizations({ "en-US": "message" })
        .setDescription(`${process.env.BOT_NAME} dirá el texto que le digas`)
        .setDescriptionLocalizations({
            "en-US": `${process.env.BOT_NAME} will say the text you tell him`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("canal")
            .setNameLocalizations({ "en-US": "channel" })
            .setDescription('Canal donde deseas que diga')
            .setDescriptionLocalizations({ "en-US": "Channel where you want to say" })
            .addStringOption(option =>
                option.setName("texto")
                    .setNameLocalizations({ "en-US": "text" })
                    .setDescription('Texto que deseas que diga')
                    .setDescriptionLocalizations({ "en-US": "Text you want to say" })
                    .setRequired(true)
            )
            .addChannelOption(option =>
                option.setName("canal")
                    .setNameLocalizations({ "en-US": "channel" })
                    .setDescription('Canal donde deseas que diga')
                    .setDescriptionLocalizations({ "en-US": "Channel where you want to say" })
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("directo")
            .setNameLocalizations({ "en-US": "direct" })
            .setDescription('Mensaje directo al usuario')
            .setDescriptionLocalizations({ "en-US": "Direct message to the user" })
            .addUserOption(option =>
                option.setName("usuario")
                    .setNameLocalizations({ "en-US": "user" })
                    .setDescription('Usuario al que deseas enviar el mensaje')
                    .setDescriptionLocalizations({ "en-US": "User to whom you want to send the message" })
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName("texto")
                    .setNameLocalizations({ "en-US": "text" })
                    .setDescription('Texto que deseas que diga')
                    .setDescriptionLocalizations({ "en-US": "Text you want to say" })
                    .setRequired(true)
            )
        )
        ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction){

        const text = interaction.options.getString("texto")
        switch(interaction.options.getSubcommand()){
            case "canal":
                await interaction.deferReply()

                const channel = interaction.options.getChannel("canal") || interaction.channel

                await channel.sendTyping()
                channel.send(text)

                return await interaction.deleteReply()
            case "directo":

                const user = interaction.options.getUser('usuario')
                
                if(!user) return interaction.reply("No se encontró destinario, vuelve a intentarlo")

                user.send(text)

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Mensaje directo a ${user.username}`)
                            .setDescription(`Se ha enviado el mensaje:\n> ${text}`)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .setColor(process.env.COLOR)
                            .setTimestamp()
                    ],
                    ephemeral: true
                })
            default:
                return interaction.reply("Opción no encontrada")
        }

    }
} 