const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Elimina los mensajes indicados del canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addNumberOption(option =>
        option.setName("mensajes")
        .setDescription("Número de mensajes a eliminar")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addUserOption(option =>
        option.setName("objetivo")
        .setDescription("Indica a quien se desea eliminar los mensajes")   
    ),
    async execute(client, interaction, prefix){

        const valor = interaction.options.getNumber("mensajes");
        const user = interaction.options.getUser("objetivo");

        const channelMessages = await interaction.channel.messages.fetch();
        
        if (user){
            let i = 0
            let messagesToDelete = []
            channelMessages.filter((message) =>{
                if (message.author.id == user.id && valor > i){
                    messagesToDelete.push(message);
                    i++
                }
            });
            interaction.channel.bulkDelete(messagesToDelete, true).then((messages) => {
                let ClearCommandembed = new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se han eliminado una cantidad de \`${messages.size}\` mensajes de \`${user.username}\``)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")

                interaction.reply({ embeds: [ClearCommandembed]});
                setTimeout(() => interaction.deleteReply(), 10000)
            });
        }else{
            interaction.channel.bulkDelete(valor, true).then((messages) => {
                let ClearCommandembed = new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se han eliminado una cantidad de \`${messages.size}\` mensajes`)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")

                interaction.reply({ embeds: [ClearCommandembed]});
                setTimeout(() => interaction.deleteReply(), 10000)
            });
        }
    }
}   