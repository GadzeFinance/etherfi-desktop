/* eslint-disable no-var */
import { ApolloClient, NormalizedCacheObject, InMemoryCache } from '@apollo/client'

import { SUBGRAPH_URL } from '../../constants/env'

const SUBGRAPH_MODE = process.env.NODE_ENV || 'development'

declare global {
  // eslint-disable-next-line vars-on-top
  var subgraph: ApolloClient<NormalizedCacheObject> | undefined
}

export const subgraph =
  global.subgraph ||
  new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(), // TODO: define cache options
    ssrMode: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })

if (SUBGRAPH_MODE !== 'production') global.subgraph = subgraph
