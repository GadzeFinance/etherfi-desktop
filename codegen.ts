import { CodegenConfig } from '@graphql-codegen/cli'

import { SUBGRAPH_URL } from './src/react/constants/env'

const config: CodegenConfig = {
  overwrite: true,
  schema: SUBGRAPH_URL,
  documents: './src/react/graphql/**/*.graphql',
  generates: {
    './src/react/clients/subgraph/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    },
  },
}

export default config
