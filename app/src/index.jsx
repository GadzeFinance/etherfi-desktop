import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client'
import { subgraph } from './clients/subgraph/index.ts'
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <div>
        <ApolloProvider client={subgraph}>
            <ChakraProvider>
                <App/> 
            </ChakraProvider>
        </ApolloProvider>
    </div>
);