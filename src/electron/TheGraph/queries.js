const { createClient } = require('urql')
globalThis.fetch = require('node-fetch')
const APIURL = "https://api.studio.thegraph.com/query/41778/etherfi/0.0.7"

const stakesQuery = `
  query {
    stakes {
        id
        stakeId
        sender
        value
        blockTimestamp
        blockNumber
        phase
        transactionHash
      }
  }
`


const client = createClient({
  url: APIURL,
})

const callStakesQuery = async () => {
    const data = await client.query(stakesQuery).toPromise()

    return data
}
// callStakesQuery()

module.exports = {
    callStakesQuery
}