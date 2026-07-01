const Database = require('../database/db')

class Channels {
    static findOne(query) {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()
                
                let sql = 'SELECT * FROM Channels WHERE 1=1'
                const params = []
                
                if (query.guild_id) {
                    sql += ' AND guild_id = ?'
                    params.push(query.guild_id)
                }
                if (query.channel_id) {
                    sql += ' AND channel_id = ?'
                    params.push(query.channel_id)
                }
                if (query.key) {
                    sql += ' AND key = ?'
                    params.push(query.key)
                }
                
                const stmt = db.prepare(sql)
                const result = stmt.get(...params)
                
                resolve(result || null)
            } catch (error) {
                reject(error)
            }
        })
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()
                const stmt = db.prepare(`
                    INSERT INTO Channels (channel_id, guild_id, key) 
                    VALUES (?, ?, ?)
                `)
                
                const info = stmt.run(data.channel_id, data.guild_id, data.key)
                resolve({ id: info.lastInsertRowid, ...data })
            } catch (error) {
                reject(error)
            }
        })
    }

    static findOneAndUpdate(query, update) {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()
                
                let sql = 'UPDATE Channels SET '
                const updateParams = []
                const keys = Object.keys(update)
                
                keys.forEach((k, index) => {
                    sql += `${k} = ?`
                    if (index < keys.length - 1) sql += ', '
                    updateParams.push(update[k])
                })
                
                sql += ' WHERE 1=1'
                
                if (query.guild_id) {
                    sql += ' AND guild_id = ?'
                    updateParams.push(query.guild_id)
                }
                if (query.channel_id) {
                    sql += ' AND channel_id = ?'
                    updateParams.push(query.channel_id)
                }
                if (query.key) {
                    sql += ' AND key = ?'
                    params.push(query.key)
                }
                
                const stmt = db.prepare(sql)
                stmt.run(...updateParams)
                
                // Recuperar el documento actualizado
                this.findOne(query).then(resolve).catch(reject)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Channels