import { CodegenConfig } from '@graphql-codegen/cli'

import { SUBGRAPH_URL } from './app/src/constants/env'

const config: CodegenConfig = {
  overwrite: true,
  schema: SUBGRAPH_URL,
  documents: './app/src/graphql/**/*.graphql',
  generates: {
    './app/src/clients/subgraph/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    },
  },
}

export default config
