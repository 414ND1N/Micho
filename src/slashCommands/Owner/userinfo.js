const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Muestra información de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) => 
            option.setName('usuario')
            .setDescription('Usuario del cual mostrar información.')
        ),

    execute(client, interaction) {

        const USUARIO = interaction.options.getUser('usuario'); // Usuario al que se le hará la acción
        const MEMBER = interaction.guild.members.cache.get(USUARIO?.id); // Objeto de miembro del usuario
        const USERNAME = MEMBER?.nickname || USUARIO?.username; // Apodo del usuario
        
        //Fecha de creación de la cuenta con formato dd/mm/aaaa
        const FECHA_CREACION = `${USUARIO.createdAt.getDate()}/${USUARIO.createdAt.getMonth() + 1}/${USUARIO.createdAt.getFullYear()}`;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Información de usuario`)
                    .setColor(process.env.COLOR)
                    .addFields(
                        {name: `\`Usuario\``, value:`${USUARIO.tag}`},
                        {name: `\`Apodo\``, value: `${USERNAME}`},
                        {name: `\`Bot\``, value:USUARIO.bot? "Si":"No"},
                        {name: `\`Creacion de cuenta\``, value:`${FECHA_CREACION}`}
                    )
                    .setColor(process.env.COLOR)
                    .setThumbnail(`${USUARIO.displayAvatarURL({ size: 256, dynamic: true })}`)
            ]
        });

        
        
    }
}