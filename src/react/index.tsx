import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <div>
        <ChakraProvider>
            <App/> 
        </ChakraProvider>
    </div>
);