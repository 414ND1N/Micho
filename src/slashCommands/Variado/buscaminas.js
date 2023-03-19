const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Juega al buscaminas")
    .addNumberOption((option) =>
      option
        .setName("columnas")
        .setDescription("Cantidad de columnas (máximo de 9)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9)
    )
    .addNumberOption((option) =>
      option
        .setName("filas")
        .setDescription("Cantidad de filas (máximo de 9)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9)
    )
    .addStringOption((option) =>
      option
        .setName("dificultad")
        .setDescription("Dificultad (Número de minas)")
        .setRequired(true)
        .addChoices(
            {name: "Fácil", value:"0"},
            {name: "Intermedio", value:"1"},
            {name: "Difícil", value:"2"},
        )
    ),

    async execute(client, interaction, prefix){
        function generarTablero(columnas, filas, minas) {
        let tablero = [];
            

        for (let i = 0; i < columnas; i++) {
            let columna = [];
            for (let j = 0; j < filas; j++) {
            columna.push(0);
            }
            tablero.push(columna);
        }

        for (let i = 0; i < minas; ) {
            let colu_rand = Math.floor(Math.random() * columnas);
            let fil_rand = Math.floor(Math.random() * filas);
            if (tablero[colu_rand][fil_rand] != "M") {
                tablero[colu_rand][fil_rand] = "M";
                i++;
            }
        }

        for (let col = 0; col < columnas; col++) {
            for (let fil = 0; fil < filas; fil++) {
            if (tablero[col][fil] !== "M") {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (
                        col + i >= 0 &&
                        col + i < columnas &&
                        fil + j >= 0 &&
                        fil + j < filas &&
                    tablero[col + i][fil + j] === "M"
                    ) {
                    count++;
                    }
                }
                }
                tablero[col][fil] = count;
            }
            }
        }

        for (let columna = 0; columna < columnas; columna++) {
            for (let fila = 0; fila < filas; fila++) {
            switch (tablero[columna][fila]) {
                case 0:
                {
                    tablero[columna][fila] = "||:zero:||";
                }
                break;
                case 1:
                {
                    tablero[columna][fila] = "||:one:||";
                }
                break;
                case 2:
                {
                    tablero[columna][fila] = "||:two:||";
                }
                break;
                case 3:
                {
                    tablero[columna][fila] = "||:three:||";
                }
                break;
                case 4:
                {
                    tablero[columna][fila] = "||:four:||";
                }
                break;
                case 5:
                {
                    tablero[columna][fila] = "||:five:||";
                }
                break;
                case 6:
                {
                    tablero[columna][fila] = "||:six:||";
                }
                break;
                case 7:
                {
                    tablero[columna][fila] = "||:seven:||";
                }
                break;
                case 8:
                {
                    tablero[columna][fila] = "||:eight:||";
                }
                break;
                case "M":
                {
                    tablero[columna][fila] = "||:bomb:||";
                }
                break;
            }
            }
        }

        for (let c = 0; c < columnas; c++) {
            tablero[c] = tablero[c].join(" ");
        }
        tablero = tablero.join("\n");
        return tablero;
        };

        const columnas = interaction.options.getNumber("columnas");
        const filas = interaction.options.getNumber("filas");
        const dificultad = interaction.options.getString("dificultad");
        let minas = 0
        let textoDificultad = ""

        switch (dificultad) {
            case "0":
                minas = Math.round(filas*columnas* 0.25)
                textoDificultad = "fácil"
                break;
            case "2":
                minas = Math.round(filas*columnas* 0.65)
                textoDificultad = "díficil 💀"
                break;
            default:
                minas = Math.round(filas*columnas* 0.40)
                textoDificultad = "intermedio"
                break;
        }

        let tablero = generarTablero(columnas, filas, minas);
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setTitle(`:bomb: Buscaminas de ${columnas}x${filas} con dificultad ${textoDificultad}.`)
                    .setDescription(tablero)
            ]
        })

    }
};
