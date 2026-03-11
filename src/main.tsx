import React from 'react'
import { createRoot } from 'react-dom/client'
import AppProviders from './app/providers/AppProviders'
import AppRouter from './app/router/AppRouter'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
)
