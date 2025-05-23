import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ProjectProvider } from './context/ProjectContext'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <ProjectProvider>
      <App />
    </ProjectProvider>
  </React.StrictMode>
)
