import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
