import React from 'react';
import './App.css'
import '@/app/global.css'
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "@/routes.tsx";
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;