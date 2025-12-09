import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StrictMode>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </StrictMode>
    </BrowserRouter>
)
