// import { TransactionStatus } from '@usedapp/core'
// import { useEffect } from 'react'

// export const useRevalidateQueryKey = async (
//   state: TransactionStatus,
//   queryKeys: string[],
//   delayMilliseconds = 10000, // 10 seconds
// ) => {
//   useEffect(() => {
//     if (state.status === 'Success') {
//       //eslint-disable-next-line
//       console.log('WAITING....')
//       setTimeout(() => {
//         //eslint-disable-next-line
//         console.log('REFETCHING....')
//         subgraph?.refetchQueries({
//           include: queryKeys,
//         })
//       }, delayMilliseconds)
//     }
//   }, [delayMilliseconds, queryKeys, state.status])
// }
