const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para saltar a una canción de la lista en reproducción")
    .addStringOption(option =>
        option.setName("numero")
        .setDescription('Número de la canción en la lista.')
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        try{
            const voicechannel = interaction.member.voice.channel
            const queue = client.distube.getQueue(voicechannel);
            let args = interaction.options.getString("numero");
            let num_cancion = Number(args)-1;

            if (!queue){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay música reproduciendose`)
                    ],
                    ephemeral: true
                })
            }
            if (!voicechannel){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }

            client.distube.jump(voicechannel, parseInt(num_cancion));
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .addFields({name: `**Se ha saltado a la canción número \`${Number(args)}\`**`, value:`> 🐱‍🏍 🎶🎵`})
                ]
            })
        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    }
} 