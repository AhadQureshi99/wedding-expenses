import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ViewerProvider } from './context/ViewerContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ViewerProvider>
          <App />
        </ViewerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
