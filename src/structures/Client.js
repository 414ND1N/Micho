const { Client, Collection, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus } = require('discord.js');
const BotUtils = require('./Utils');

// Instancia del cliente
module.exports = class extends Client {
    constructor(options = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMessageReactions
        ],
        partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.ThreadMember],
        allowedMentions: {
            parse: ["roles", "users", "everyone"],
            repliedUser: false,
        },
        presence: {
            activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}
            ],
            status: PresenceUpdateStatus.Online
        },
    }) {
        super({
            ...options
        });

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.voiceGenerator = new Collection();
        this.slashArray = [];
        
        this.utils = new BotUtils(this);

        this.start();
    }

    async start() {
        await this.loadEvents();
        await this.loadHandlers();
        await this.loadSlashCommands();
        this.login(process.env.BOT_TOKEN)
    }

    //Funcion eliminada (comandos prefix)
    /*
    async loadCommandsPrefix() {
        console.log(`(${process.env.PREFIX}) Cargando comandos`.yellow);
        await this.commands.clear();

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/comandos");

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    const COMANDO = require(rutaArchivo);
                    const NOMBRE_COMANDO = rutaArchivo.split('\\').pop().split('/').pop().split(".")[0];
                    COMANDO.NAME = NOMBRE_COMANDO;

                    if (NOMBRE_COMANDO) this.commands.set(NOMBRE_COMANDO, COMANDO);
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL COMANDO ${rutaArchivo}`.bgRed);
                    console.log(e);
                }
            })
        }
        console.log(`(${process.env.PREFIX}) ${this.commands.size} Comandos cargados`.green);
    }
    */
   
    async loadSlashCommands() {
        console.log(`(/) Cargando comandos ...`.yellow)
        await this.slashCommands.clear()

        this.slashArray = []

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/slashCommands")

        if (RUTA_ARCHIVOS.length) {
            for (const rutaArchivo of RUTA_ARCHIVOS) {
                try {
                    const COMANDO = require(rutaArchivo);
        
                    if ((rutaArchivo.split('\\').pop().split('/').slice(-2)[0]).toLowerCase() === "subcommands") {
                        continue // Si es un subcommand no hacer nada
                    }
        
                    this.slashCommands.set(COMANDO.CMD.name, COMANDO) // Se agrega el comando a la colección
                    this.slashArray.push(COMANDO.CMD.toJSON()) // Se agrega el comando a la lista de comandos a publicar
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL COMANDO ${rutaArchivo}`.red);
                    console.log(e);
                }
            }
        }

        console.log(`(✔) ${this.slashCommands.size} Comandos cargados`.green);

        if (this?.application?.commands) {
            this.application.commands.set(this.slashArray);
            console.log(`(*) ${this.slashCommands.size} Comandos Publicados!`.green);
        }
    }

    async loadHandlers() {
        console.log(`(/) Cargando handlers ...`.yellow);

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/handlers");

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    require(rutaArchivo)(this);
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL HANDLER ${rutaArchivo}`.red);
                    console.log(e);
                }
            })
        }
        console.log(`(✔) ${RUTA_ARCHIVOS.length} Handlers Cargados`.green);
    }

    async loadEvents() {
        console.log(`(/) Cargando eventos ...`.yellow);

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/eventos");

        this.removeAllListeners();

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    const EVENTO = require(rutaArchivo);
                    const NOMBRE_EVENTO = rutaArchivo.split('\\').pop().split('/').pop().split(".")[0];
                    this.on(NOMBRE_EVENTO, EVENTO.bind(null, this));
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL EVENTO ${rutaArchivo}`.red);
                    console.log(e);
                }
            })
        }
        console.log(`(✔) ${RUTA_ARCHIVOS.length} Eventos Cargados`.green);
    }
    
}