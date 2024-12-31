import React from 'react'
import LoginPage from './pages/Login'
import NotFound from './pages/404'
import Dashboard from './pages/Dashboard'
import OAuth2CallbackGoogle from './pages/OAuth2CallbackGoogle'
import "./css/App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContextProvider } from './context/Context'


function App() {
    return (
        <ContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div>Landing Page</div>} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Login" element={<LoginPage />} />
                    <Route path="/auth/google/oauth2callback" element={<OAuth2CallbackGoogle />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ContextProvider>

    )
}

export default App