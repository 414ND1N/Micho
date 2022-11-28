const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);

module.exports = class BotUtils{
    constructor(client){
        this.client = client;
    }

    async loadFiles(dirName){
        const ARCHIVOS = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
  
        ARCHIVOS.forEach((ARCHIVO) => delete require.cache[require.resolve(ARCHIVO)]);

        return ARCHIVOS;
    }
}