const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("decir")
        .setNameLocalizations({ "en-US": "say" })
        .setDescription(`${process.env.BOT_NAME} dirá el texto que le digas`)
        .setDescriptionLocalizations({
            "en-US": `${process.env.BOT_NAME} will say the text you tell him`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("texto")
                .setNameLocalizations({ "en-US": "text" })
                .setDescription('Texto que deseas que diga 😊')
                .setDescriptionLocalizations({ "en-US": "Text you want to say 😊" })
                .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply()
        let args = interaction.options.getString("texto")
        await interaction.channel.sendTyping()
        interaction.channel.send(args)
        return await interaction.deleteReply()
    }
} 