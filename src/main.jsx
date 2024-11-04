{/*React Hookes*/}
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

{/*Css*/}
import './index.css'

{/*JSX files*/}
import App from './App.jsx'
import Home from './pages/Home.jsx'
import AdDetails from './pages/AdDetails.jsx'
import UserProfile from './pages/UserProfile.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
        <Route path='/'element={<Home />}></Route>
        <Route path="/advertisement/:id" element={<AdDetails />} />
        <Route path="/user/:id" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
