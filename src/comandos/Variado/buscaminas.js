const { EmbedBuilder } = require("discord.js");
const { min } = require("moment/moment");

module.exports = {

    ALIASES: ["minesweeper"],
    DESCRIPTION: "Juega al buscaminas",


    async execute (client, message, args, prefix){
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
        console.log(tablero)
        return tablero;
        };

        try {
            const columnas = args[0]
            const filas = args[1];
            const minas = args[2];
            
            if (!columnas | !filas | !minas) {
                return  message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Debes de ingresar el número de columnas, filas y minas (en este orden 😊)`)
                    ]
                })
            }
            
            if(isNaN(columnas) | isNaN(filas)) {
                return  message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Debes de ingresar unicamente números, máximo 9 filas y columnas`)
                    ]
                })
            }

            if(isNaN(minas)) {
                return  message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Debes de ingresar unicamente números, máximo 40 minas`)
                    ]
                })
            }

            if (columnas>9) {columnas=9}
            if (filas>9) {filas=9}
            if (minas>40) {minas=40}


            let tablero = generarTablero(columnas, filas, minas);
            
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setTitle(`:bomb: Buscaminas de ${columnas}x${filas} con ${minas} minas.`)
                        .setDescription(tablero)
                ]
                
            })

        } catch (error) {
            console.log(error);
        }
        

    }
};
