module.exports = client => {
    process.removeAllListeners();

    process.on("unhandledRejection", (reason, p) => {
        console.log('[ANTICRASH] - ERROR ENCONTRADO :O'.red);
        console.log(reason, p);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[ANTICRASH] - ERROR ENCONTRADO :O'.red);
        console.log(err, origin);
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log('[ANTICRASH] - ERROR ENCONTRADO :O'.red);
        console.log(err, origin);
    });

    process.on("multipleResolves", () =>{});
}