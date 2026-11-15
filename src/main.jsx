import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MissionProvider } from './context/MissionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MissionProvider>
        <App />
      </MissionProvider>
    </BrowserRouter>
  </StrictMode>,
)
