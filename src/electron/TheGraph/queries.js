const { createClient } = require('urql')
// needs to be imported to fetch 
// const fetch = require('node-fetch')
const fetch = require('isomorphic-unfetch')
globalThis.fetch = fetch

const APIURL = "https://api.studio.thegraph.com/query/41778/etherfi/0.0.11"

const depositedStakesForAddressQuery = `
query GetDepositedStakesByAddress($stakerAddress: Bytes) {
    stakes(where: { sender: $stakerAddress, phase: DEPOSITED }) {
        id
        stakeId
        sender
        value
        phase
        transactionHash
        blockNumber
        winningBidId {
          bidderPublicKey
          bidId
        }
    }
}
`

const client = createClient({
  url: APIURL,
})

const getDepositedStakesForAddressQuery = async (walletAddress) => {
  console.log("getDepositedStakesForAddressQuery ++")
  console.log(APIURL)
  const data = await client.query(depositedStakesForAddressQuery, {stakerAddress: walletAddress}).toPromise()
  console.log(data)
  return data
}

module.exports = {
    getDepositedStakesForAddressQuery
}