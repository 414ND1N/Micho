const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para reproducir una canción dada")
    .addStringOption(option =>
        option.setName("cancion")
        .setDescription("Canción que se desea reproducir")
    ),
    async execute(client, interaction, prefix){
        try{
            let args = interaction.options.getString("cancion");
            const voicechannel = interaction.member.voice.channel

            //comprobaciones previas :o
            if (args == null) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que especificar el nombre de una canción 🤨`)
                    ],
                    ephemeral: true
                })
            }

            if (!args.length) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que especificar el nombre de una canción 🤨`)
                    ],
                    ephemeral: true
                })
            }
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
                        .setColor(process.env.COLOR)
                        .addFields({name: `**Buscando \`${args}\` ...**`, value:`> 🔎🧐`})
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    } 
       
}