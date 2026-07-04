const Database = require('../database/db')

class Roles {

    static async findAll() {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()

                let sql = 'SELECT * FROM Roles'

                const stmt = db.prepare(sql)
                const result = stmt.all()

                resolve(result)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    static findOne(query) {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()
                
                let sql = 'SELECT * FROM Roles WHERE 1=1'
                const params = []
                
                if (query.guild_id) {
                    sql += ' AND guild_id = ?'
                    params.push(query.guild_id)
                }
                if (query.rol_id) {
                    sql += ' AND rol_id = ?'
                    params.push(query.rol_id)
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
                    INSERT INTO Roles (guild_id, rol_id, key) 
                    VALUES (?, ?, ?)
                `)
                
                const info = stmt.run(data.guild_id, data.rol_id, data.key)
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
                
                let sql = 'UPDATE Roles SET '
                const updateParams = []
                const keys = Object.keys(update)
                
                keys.forEach((key, index) => {
                    sql += `${key} = ?`
                    if (index < keys.length - 1) sql += ', '
                    updateParams.push(update[key])
                })
                
                sql += ' WHERE 1=1'
                
                if (query.guild_id) {
                    sql += ' AND guild_id = ?'
                    updateParams.push(query.guild_id)
                }
                if (query.rol_id) {
                    sql += ' AND rol_id = ?'
                    updateParams.push(query.rol_id)
                }
                if (query.key) {
                    sql += ' AND key = ?'
                    updateParams.push(query.key)
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

    static delete(query) {
        return new Promise((resolve, reject) => {
            try {
                const db = Database.getDatabase()
                
                let sql = 'DELETE FROM Roles WHERE 1=1'
                const params = []
                
                if (query.guild_id) {
                    sql += ' AND guild_id = ?'
                    params.push(query.guild_id)
                }
                if (query.rol_id) {
                    sql += ' AND rol_id = ?'
                    params.push(query.rol_id)
                }
                if (query.key) {
                    sql += ' AND key = ?'
                    params.push(query.key)
                }
                
                const stmt = db.prepare(sql)
                const info = stmt.run(...params)
                
                resolve(info.changes > 0)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Roles