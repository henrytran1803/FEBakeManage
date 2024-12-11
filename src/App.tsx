import './App.css'
import '@/app/global.css'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { ToastProvider } from '@radix-ui/react-toast';
import React, { useEffect } from 'react';
import TableDetector from './components/TableDetector';
import ErrorMessageManager from './utils/errorMessages';



const App: React.FC = () => {
    useEffect(() => {
        // Khởi tạo ErrorMessageManager khi app được mount
        ErrorMessageManager.loadErrorMessages();
    }, []);
    return (
        <ToastProvider>
            <BrowserRouter>
                <TableDetector />
                <AppRoutes />
                <Toaster />
            </BrowserRouter>
        </ToastProvider>
    );
};

export default App;