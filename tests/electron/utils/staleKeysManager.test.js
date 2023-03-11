const {getStaleKeys} = require('../../../src/electron/utils/staleKeysManager')
const sqlite3 = require('sqlite3').verbose();
const mockfs = require('mock-fs');
const largeStakeInfo = require('../../mockedData/StakeInfo/StakeInfo-Large.json')

// jest.mock('sqlite3');

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
        ('key3', 'file3.json')
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
        ('key3', 'file3.json')
    `);
    const result = await getStaleKeys('test3.json', db)
    expect(result).toHaveLength(1);
    expect(result).toContainEqual({ bidder_public_key: 'key100', stake_info_file: 'file1.json' });
  });
});

