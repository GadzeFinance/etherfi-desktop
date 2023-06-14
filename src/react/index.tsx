import { createRoot } from "react-dom/client";
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import "./index.css";

const queryClient = new QueryClient()

const container = document!.getElementById("root");
const root = createRoot(container);

root.render(
    <div>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </QueryClientProvider>
    </div>
);