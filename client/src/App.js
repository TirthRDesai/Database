import React from 'react'
import LoginPage from './pages/Login'
import NotFound from './pages/404'
import Dashboard from './pages/Dashboard'
import "./css/App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Landing Page</div>} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>

    )
}

export default App