const { createClient } = require('urql')
// needs to be imported to fetch 
const fetch = require("isomorphic-unfetch");

const APIURL = "https://api.studio.thegraph.com/query/41778/etherfi/0.0.7"

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
        winningBid {
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
    const data = await client.query(depositedStakesForAddressQuery, {stakerAddress: walletAddress}).toPromise()
    return data
}

module.exports = {
    getDepositedStakesForAddressQuery
}