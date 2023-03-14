const sqlite3 = require('sqlite3').verbose()
const {readFileSync} = require('fs')
const path = require('path');

const setUpDB = async () => {
    // Connect to database
    const db = await new sqlite3.Database('staleKeys.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the staleKeys database.');
      });

      await new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS stale_keys_table (
            bidder_public_key TEXT NOT NULL,
            stake_info_file TEXT NOT NULL
        );`, (err) => {
                if (err) {
                    reject(err)
                    console.error(err.message);
                }
                    resolve()
            }
        );
    })
    return db
}

const checkIfKeysAreStale = async (stakeInfoPath) => {
    var db = null
    var staleKeysList = []
    try {
        db = await setUpDB()
        staleKeysList = await getStaleKeys(stakeInfoPath, db)
    } catch (error) {
        console.error(error)
    } finally {
        if (db) db.close()
    }
    return staleKeysList
}

const getStaleKeys = async (stakeInfoPath, db) => {
    const rawData = readFileSync(stakeInfoPath)
    const stakeInfoJson = JSON.parse(rawData)
    const bidderPublicKeysList = stakeInfoJson.map(item => item.bidderPublicKey)
    const placeholders = bidderPublicKeysList.map(() => '?').join(',');
    const query = `SELECT bidder_public_key, stake_info_file FROM stale_keys_table WHERE bidder_public_key IN (${placeholders})`;
    const result = await new Promise((resolve, reject) => {
        db.all(query, bidderPublicKeysList, (err, rows) => {
            if (err) {
                reject(err)
                console.error(err.message);
            } else {
                resolve(rows)
            }
        });
    })
    return result
}

const updateStaleKeys = async (stakeInfoPath) => {
    var db = null
    var success = true
    try {
        db = await setUpDB()
        await addStaleKeys(stakeInfoPath, db)
    } catch (error) {
        console.error(error)
        success = false
    } finally {
        if (db) db.close()
    } 
    return success
}

const addStaleKeys = async (stakeInfoPath, db) => {
    const rawData = readFileSync(stakeInfoPath)
    const stakeInfoJson = JSON.parse(rawData)
    const fileName = path.basename(stakeInfoPath)
    const bidderPublicKeysList = stakeInfoJson.map(item => item.bidderPublicKey)
    var query = 'INSERT INTO stale_keys_table (bidder_public_key, stake_info_file) VALUES ';
    const tuplesToInsert = bidderPublicKeysList.map(item => [item, fileName])
    for (let i = 0; i < tuplesToInsert.length; i++) { 
        query += `('${tuplesToInsert[i][0]}', '${tuplesToInsert[i][1]}')`
        if (i < tuplesToInsert.length - 1) {
            query += ', '
        } else {
            query += ';'
        }
    }
    await new Promise((resolve, reject) => {
        db.all(query, (error, db) => {
        error ? reject(error) : resolve(db)
        });
    })
}

module.exports = {
    checkIfKeysAreStale,
    getStaleKeys,
    updateStaleKeys,
    addStaleKeys,
} 