const { SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Enlace de la pana página"),

    async execute(client, interaction){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setTitle('Página de Onanībando')
                    .setDescription(`Página con información relacionada\ncon el grupo de \`Onanībando\`.`)
                    .setThumbnail('https://i.imgur.com/3LKKy2F.png')
                    .setURL(process.env.URL_PAGINA)
            ]
        })
    }
} 