// import { BidTableData, PartialBid } from '../../interfaces/cross-functional'
// import { addressEqual, shortenAddress } from '@usedapp/core'
// import { formatEther } from 'ethers/lib/utils'

// /**
//  * This is used to transform crude bid data into more friendly formats for UI
//  * For example, blockTimestamp 1673480292 becomes a locale string 12/01/2023, 01:38:12.
//  *
//  * @param bids The bids retrieved from subgraph of type Array<PartialBid>
//  * @param operatorAddress The address of the operator querying for these bids
//  * @returns Array<BidTableData>
//  */
// export const enrichBids = (
//   bids: Array<PartialBid & { action: JSX.Element }>,
//   operatorAddress: string,
// ) => {
//   const transformed: Array<BidTableData> = bids.map((b) => {
//     return {
//       id: b.id,
//       date: new Date(b.blockTimestamp * 1000).toLocaleString(),
//       bidder: shortenAddress(b.bidder),
//       status: b.status,
//       bidAmount: `${formatEther(b.amount)} ETH`,
//       isMyBid: addressEqual(b.bidder, operatorAddress),
//       bidId: b.bidId,
//       action: b.action,
//     }
//   })
//   return transformed
// }
