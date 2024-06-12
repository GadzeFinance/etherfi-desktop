const { storage } = require('./storage')

const MAX_RECORD_PER_PAGE = 10;

const addHistoryRecord = (data) => {
  const timestamp = new Date().getTime();
  storage.addHistoryRecord(timestamp, data);
}

const encodeGenerateKeysData = (address, stakeFileName, stakeFileContent, mnemonic, validatorIds, stakingCode, databasePassword) => {
  const stakeInfoFile = {
    name: stakeFileName,
    content: stakeFileContent
  };
  const stakeFileString = JSON.stringify(stakeInfoFile);
  const validatorIdsString = JSON.stringify(validatorIds);
  const encodedData = {
    address,
    // encrypt the mnemonic if we have one
    mnemonic: mnemonic === "" ? mnemonic : storage.encrypt(mnemonic, databasePassword),
    stakeInfoFile: stakeFileString,
    validatorIds: validatorIdsString,
    stakingCode
  };
  return encodedData;
}

const decodeGenerateKeysData = (data, databasePassword) => {
  const validatorIds = JSON.parse(data.validatorIds);
  const stakeInfoFile = JSON.parse(data.stakeInfoFile);
  const decodedData = {
    address: data.address,
    mnemonic: data.mnemonic === "" ? data.mnemonic : storage.decrypt(data.mnemonic, databasePassword),
    stakeInfoFile,
    validatorIds,
    stakingCode: data.stakingCode
  };
  return decodedData;
}

// Example: 3 records per page
// page 1: get record n-1, record n-2, record n-3
// page 2: get record n-4, record n-5, record n-6
const getHistoryRecordsByPage = async (pageId, databasePassword) => {
  const allTimestampList = storage.getHistoryTimestampList() || [];
  const totalCount = allTimestampList.length;
  // count from back to front
  const selectedList = []
  for (let i = 1; i <= MAX_RECORD_PER_PAGE; i++) {
    const index = totalCount - MAX_RECORD_PER_PAGE * (pageId - 1) - i;
    if (index < 0) break;
    const timestamp = allTimestampList[index];
    selectedList.push(timestamp);
  }
  const records  = storage.getHistoryRecordsByTimestampList(selectedList) || {};
  for (const [timestamp, record] of Object.entries(records)) {
    records[timestamp] = decodeGenerateKeysData(record, databasePassword);
  }
  return records;
}

const getHistoryPageCount = async () => {
  const totalRecords = storage.getHistoryRecordCount() || 0;
  const totalPages = Math.ceil(totalRecords / MAX_RECORD_PER_PAGE);
  return totalPages;
}



module.exports = {
  addHistoryRecord,
  encodeGenerateKeysData,
  decodeGenerateKeysData,
  getHistoryRecordsByPage,
  getHistoryPageCount
}