const { storage } = require('./storage')

const MAX_RECORD_PER_PAGE = 10;

const addHistoryRecord = (data) => {
  console.log("addHistoryRecord:", data)
  // get the latest page id
  const latestPageId = storage.getHistoryPageCount();
  // check the number of records on that page
  const count = storage.getHistoryRecordCount(latestPageId);  
  // get the timestamp
  const timestamp = new Date().getTime();
  console.log("count:", count)
  if (count >= MAX_RECORD_PER_PAGE) {
    const newPageId = storage.addHistoryPage()
    storage.addHistoryRecord(newPageId, timestamp, data);
  } else {
    console.log("storage.addHistoryRecord", latestPageId, timestamp, data)
    storage.addHistoryRecord(latestPageId, timestamp, data);
  }
}

// address: string
// stakeInfo file: {name: string, content: string}
// mnemonic: string
// validators: array of validator id => json string
const encodeGenerateKeysData = (address, stakeFileName, stakeFileContent, mnemonic, validatorIds) => {
  const stakeInfoFile = {
    name: stakeFileName,
    content: stakeFileContent
  };
  const stakeFileString = JSON.stringify(stakeInfoFile);
  const validatorIdsString = JSON.stringify(validatorIds);
  const encodedData = {
    address,
    mnemonic,
    stakeInfoFile: stakeFileString,
    validatorIds: validatorIdsString
  };
  return encodedData;
}

const decodeGenerateKeysData = (data) => {
  const validatorIds = JSON.parse(data.validatorIds);
  const stakeInfoFile = JSON.parse(data.stakeInfoFile);
  const decodedData = {
    address: data.address,
    mnemonic: data.mnemonic,
    stakeInfoFile,
    validatorIds
  };
  return decodedData;
}

const getHistoryRecordsByPage = async (pageId) => {
  console.log("getHistoryRecordsByPage:", pageId)
  console.log("storage:", storage._store.store);
  const page = storage.getHistoryPage(pageId);
  const records = page.records || {};
  const decodedRecords = {};
  for (const [timestamp, record] of Object.entries(records)) {
    decodedRecords[timestamp] = decodeGenerateKeysData(record);
  }
  return decodedRecords;
}



module.exports = {
  addHistoryRecord,
  encodeGenerateKeysData,
  decodeGenerateKeysData,
  getHistoryRecordsByPage
}