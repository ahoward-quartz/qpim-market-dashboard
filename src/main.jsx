import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Lato, self-hosted via Fontsource. Only Regular (400) and Bold (700) are
// loaded — the two weights the app actually uses (see index.css's
// --font-sans and the font-weight audit in Card/CategorySection/etc.).
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
