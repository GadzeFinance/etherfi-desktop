const {getStaleKeys, addStaleKeys} = require('../../../src/electron/utils/staleKeysManager')
const sqlite3 = require('sqlite3').verbose();
const mockfs = require('mock-fs');
const largeStakeInfo = require('../../mockedData/StakeInfo/StakeInfo-Large.json')


describe('getStaleKeys', () => {
  let db;

  beforeEach(async () => {
    try {
        // Mock the SQLite3 Database
        db = await new sqlite3.Database(':memory:');
        await new Promise((resolve, reject) => {
            db.run(`
            CREATE TABLE IF NOT EXISTS stale_keys_table (
            bidder_public_key TEXT NOT NULL,
            stake_info_file TEXT NOT NULL
            );
          `, (error, db) => {
            error ? reject(error) : resolve(db)
          });
        })
      } catch (err) {
        console.error(err.message);
      }

            // console.log('stale_keys_table table created successfully.');
    // Mock the file system with test data
    mockfs({
      'test1.json': '[{"bidderPublicKey": "key1"}, {"bidderPublicKey": "key2"}]',
      'test2.json': '[{"bidderPublicKey": "key3"}, {"bidderPublicKey": "key4"}]',
      'test3.json': JSON.stringify(largeStakeInfo),
      'testEmpty.json': '[]'
    });
  });

  afterEach( async() => {
    await db.close()
    // Clean up mock file system
    mockfs.restore();
    // Clean up mock SQLite3 Database
    // db.close();
    jest.clearAllMocks();
  });

  test('1: Three Items in database - Two matches - Returns 2 items', async () => {
    // Add test data to the mock database
    await db.exec(`
      INSERT INTO stale_keys_table (bidder_public_key, stake_info_file) VALUES
      ('key1', 'file1.json'),
      ('key2', 'file2.json'),
      ('key3', 'file3.json')
    `);
    // Call function with test data
    const result = await getStaleKeys('test1.json', db)
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ bidder_public_key: 'key1', stake_info_file: 'file1.json' });
    expect(result).toContainEqual({ bidder_public_key: 'key2', stake_info_file: 'file2.json' });
  });

  test('2: Empty Database - Return empty list', async () => {
    // Call function with test data
    const result = await getStaleKeys('test1.json', db)
    expect(result).toHaveLength(0);
  });

  test('3: Empty Database - Large Stake Info - No Matches - Returns empty list', async () => {
    // Call function with test data
    const result = await getStaleKeys('test3.json', db)
    expect(result).toHaveLength(0);
  });

  test('4: Non Empty Database - Large Stake Info - no matches - return empty list', async () => {
    // Call function with test data
    await db.exec(`
        INSERT INTO stale_keys_table (bidder_public_key, stake_info_file) VALUES
        ('key1', 'file1.json'),
        ('key2', 'file2.json'),
        ('key3', 'file3.json');
    `);
    const result = await getStaleKeys('test3.json', db)
    expect(result).toHaveLength(0);
  });

  test('5: Non Empty Database - Large Stake Info - One matche - Return 1 item', async () => {
    // Call function with test data
    await db.exec(`
        INSERT INTO stale_keys_table (bidder_public_key, stake_info_file) VALUES
        ('key100', 'file1.json'),
        ('key2', 'file2.json'),
        ('key3', 'file3.json');
    `);
    const result = await getStaleKeys('test3.json', db)
    expect(result).toHaveLength(1);
    expect(result).toContainEqual({ bidder_public_key: 'key100', stake_info_file: 'file1.json' });
  });
});


describe('addStaleKeys', () => {
  let db;

  beforeEach(async () => {
    try {
        // Mock the SQLite3 Database
        db = await new sqlite3.Database(':memory:');
        await new Promise((resolve, reject) => {
            db.run(`
            CREATE TABLE IF NOT EXISTS stale_keys_table (
            bidder_public_key TEXT NOT NULL,
            stake_info_file TEXT NOT NULL
            );
          `, (error, db) => {
            error ? reject(error) : resolve(db)
          });
        })
      } catch (err) {
        console.error(err.message);
      }

            // console.log('stale_keys_table table created successfully.');
    // Mock the file system with test data
    mockfs({
      'test1.json': '[{"bidderPublicKey": "key1"}, {"bidderPublicKey": "key2"}]',
      'test2.json': '[{"bidderPublicKey": "key3"}, {"bidderPublicKey": "key4"}]',
      'test3.json': JSON.stringify(largeStakeInfo)
    });
  });

  afterEach( async() => {
    await db.close()
    // Clean up mock file system
    mockfs.restore();
    // Clean up mock SQLite3 Database
    // db.close();
    jest.clearAllMocks();
  });

  test('1: Add two items - Should be two items in it', async () => {
    // Add test data to the mock database
    // Call function with test data
    await addStaleKeys('test1.json', db)
    const result = await getStaleKeys('test1.json', db);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ bidder_public_key: 'key1', stake_info_file: 'test1.json' });
    expect(result).toContainEqual({ bidder_public_key: 'key2', stake_info_file: 'test1.json' });
  });

  test('2: Add large Stake info - Should have 180 items', async () => {
    // Add test data to the mock database
    // Call function with test data
    await addStaleKeys('test3.json', db)
    // const result = await getStaleKeys('test3.json', db);
    const result = await getAllKeysInDB(db)
    expect(result).toHaveLength(180);
  });

  test('3: Add large Stake info add small stake info - Should have 182 items', async () => {
    // Insert 180 items
    await addStaleKeys('test3.json', db)
    // Check to see if items that have not been inserted are there
    const result1 = await getStaleKeys('test1.json', db)
    expect(result1).toHaveLength(0)
    
    var allKeys = await getAllKeysInDB(db)
    expect(allKeys).toHaveLength(180);
    

    // Insert 2 more items
    await addStaleKeys('test1.json', db)
    const result2 = await getStaleKeys('test1.json', db)
    // Check to see if the two itesm that were inserted are there
    expect(result2).toHaveLength(2)

    // Check too see if all the items are there.
    allKeys = await getAllKeysInDB(db)
    expect(allKeys).toHaveLength(182);

  });
});


// Helper function for tests
const getAllKeysInDB = async (db) => {
  var result = await new Promise((resolve, reject) => {
    db.all('SELECT bidder_public_key from stale_keys_table;', (error, result) => {
    error ? reject(error) : resolve(result)
    });
  })
  return result
} 
