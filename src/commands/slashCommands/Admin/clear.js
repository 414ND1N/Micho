const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("limpiar")
        .setNameLocalizations({ "en-US": "clear" })
        .setDescription("Elimina los mensajes indicados del canal")
        .setDescriptionLocalizations({
            "en-US": "Deletes the indicated messages from the channel",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addNumberOption(option =>
            option.setName("mensajes")
                .setNameLocalizations({ "en-US": "messages" })
                .setDescription("Número de mensajes a eliminar")
                .setDescriptionLocalizations({
                    "en-US": "Number of messages to delete",
                })
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .addUserOption(option =>
            option.setName("objetivo")
                .setNameLocalizations({ "en-US": "target" })
                .setDescription("Indica a quien se desea eliminar los mensajes")
                .setDescriptionLocalizations({
                    "en-US": "Indicates who you want to delete the messages",
                })
        ),
    async execute(interaction){

        const valor = interaction.options.getNumber("mensajes")
        const user = interaction.options.getUser("objetivo")

        const channelMessages = await interaction.channel.messages.fetch()
        
        if (user){
            let i = 0
            let messagesToDelete = []
            channelMessages.filter((message) =>{
                if (message.author.id == user.id && valor > i){
                    messagesToDelete.push(message)
                    i++
                }
            })
            interaction.channel.bulkDelete(messagesToDelete, true).then(async (messages) => {
                console.log(`🧹 Se han eliminado una cantidad de ${valor} mensajes de ${user.username}`.blue)
                let ClearCommandembed = new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(Number(process.env.COLOR))
                    .setDescription(`Se han eliminado una cantidad de \`${messages.size}\` mensajes de \`${user.username}\``)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")

                await interaction.reply({ embeds: [ClearCommandembed]})
                setTimeout(() => interaction.deleteReply(), 10000)
            })
        }else{
            interaction.channel.bulkDelete(valor, true).then(async (messages) => {
                let ClearCommandembed = new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(Number(process.env.COLOR))
                    .setDescription(`Se han eliminado una cantidad de \`${messages.size}\` mensajes 🧹`)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")
                
                await interaction.reply({ embeds: [ClearCommandembed]})
                setTimeout(() => interaction.deleteReply(), 10000)
            })
        }
    }
}   