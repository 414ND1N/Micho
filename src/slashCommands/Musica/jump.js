const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para saltar a una canción de la lista en reproducción")
    .addIntegerOption(option =>
        option.setName("numero")
        .setDescription('Número de la canción en la lista.')
        .setMinValue(2)
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        try{
            const voicechannel = interaction.member.voice.channel
            const queue = client.distube.getQueue(voicechannel);
            let args = interaction.options.getInteger("numero");
            let num_cancion = args-1;

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
            if (num_cancion > (queue.songs.length)-1) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`La lista unicamente cuenta con \`${queue.songs.length}\` canciones`)
                    ],
                    ephemeral: true
                })
            };

            client.distube.jump(voicechannel, num_cancion);
            
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Salto en lista de música')
                        .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                        .setColor(process.env.COLOR)
                        .addFields({name: `Se saltó a la canción número \`${Number(args)}\``, value:`> 🐱‍🏍 🎶🎵`})
                ]
            })
        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    }
} 