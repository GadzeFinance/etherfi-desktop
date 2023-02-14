import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'

const container = document!.getElementById("root");
const root = createRoot(container);

root.render(
    <div>
        <ChakraProvider theme={theme}>
            <App/> 
        </ChakraProvider>
    </div>
);