import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import UserProvider from './context/UserContext.jsx'
import ProductContextProvider from './context/ProductContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <ShopContextProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </ShopContextProvider>
    </UserProvider>
  </BrowserRouter>,
)
