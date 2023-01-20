const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para reproducir una canción dada")
    .addStringOption(option =>
        option.setName("cancion")
        .setDescription("Canción que se desea reproducir")
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        try{
            let args = interaction.options.getString("cancion");
            const voicechannel = interaction.member.voice.channel

            //comprobaciones previas :o

            if (!voicechannel) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }

            client.distube.play(voicechannel, args,{
                member: interaction.member,
                textChannel: interaction.channel
            });
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Reproducción música')
                        .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                        .setColor(process.env.COLOR)
                        .setDescription(`Buscando \`${args}\` ...`)
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}