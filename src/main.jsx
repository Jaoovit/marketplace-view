{/*React Hookes*/}
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

{/*Css*/}
import './index.css'

{/*JSX files*/}
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
