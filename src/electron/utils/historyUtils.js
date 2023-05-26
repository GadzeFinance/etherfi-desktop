const storage = require('./storage')

const MAX_RECORD_PER_PAGE = 20;

const addHistoryRecord = (data) => {
  // get the latest page id
  const latestPageId = storage.getHistoryPageCount();
  // check the number of records on that page
  const count = storage.getHistoryRecordCount(latestPageId);  
  // get the timestamp
  const timestamp = new Date().getTime();
  if (count >= MAX_RECORD_PER_PAGE) {
    const newPageId = storage.addHistoryPage()
    storage.addHistoryRecord(newPageId, timestamp, data);
  } else {
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





module.exports = {
  addHistoryRecord,
  encodeGenerateKeysData
}