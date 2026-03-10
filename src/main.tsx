import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-400 mb-4">
          Foundation Ready
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Meal Planner App - Vite + React + TypeScript
        </p>
      </div>
    </div>
  </React.StrictMode>,
)
