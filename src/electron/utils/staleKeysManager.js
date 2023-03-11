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
    // Make sure table exists
    return db
}

const checkForStaleKeys = async (stakeInfoPath) => {
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
                // Log the file names for the matched keys
                // rows.forEach(row => {
                // console.log(row);
                // });
            }
        });
    })
    return result
}

const updateStaleKeys = async (stakeInfoPath) => {
    var db = null 
    try {
        db = setUpDB()
        await addStaleKeys(stakeInfoPath, db)
    } catch (error) {
        console.error(error)
    } finally {
        if (db) db.close()
    } 
}

const addStaleKeys = async (stakeInfoPath, db) => {
    const rawData = readFileSync(stakeInfoPath)
    const stakeInfoJson = JSON.parse(rawData)
    const fileName = path.basename(stakeInfoPath)

    const bidderPublicKeysList = stakeInfoJson.map(item => item.bidderPublicKey)
    const query = `INSERT INTO stale_keys_table (bidder_public_key, stake_info_file) VALUES (?, ?)`;
    const tuplesToInsert = bidderPublicKeysList.map(item => [item, fileName])
    const result = await new Promise((resolve, reject) => {
        db.all(query, tuplesToInsert, (err) => {
            if (err) {
                reject(err)
                console.error(err.message);
            } else {
                resolve()
            }
        });
    })
    return result
}

module.exports = {
    checkForStaleKeys,
    getStaleKeys,
    updateStaleKeys,
    addStaleKeys,
} 