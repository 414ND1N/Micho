const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.resolve(__dirname, '../../data/bot.db')
let db

class DatabaseConnection {
    static initialize() {
        db = new Database(dbPath)
        db.pragma('journal_mode = WAL')
        
        // Crear tablas si no existen
        this.createTables()
        return db
    }

    static createTables() {
        // Tabla Channels
        db.exec(`
            CREATE TABLE IF NOT EXISTS Channels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id TEXT,
                guild_id TEXT NOT NULL,
                key TEXT NOT NULL
            )
        `)

        // Tabla Roles
        db.exec(`
            CREATE TABLE IF NOT EXISTS Roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rol_id TEXT NOT NULL,
                guild_id TEXT NOT NULL,
                key TEXT NOT NULL
            )
        `)
    }

    static getDatabase() {
        if (!db) {
            this.initialize()
        }
        return db
    }
}

module.exports = DatabaseConnection
