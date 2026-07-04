const Database = require('@/database/db')

module.exports = async (client, _) => {
    try {
        Database.initialize()
        console.log('🗄️ Conectado a la base de datos'.brightGreen)
    } catch (err) {
        console.log('Error al conectar a la base de datos ❌'.brightRed)
        console.log(err)
    }
}